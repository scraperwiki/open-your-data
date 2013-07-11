longPollSet = false

function humanOldness(diff){
  // diff should be a value in seconds
	var	day_diff = Math.floor(diff / 86400)
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return
	return day_diff == 0 && (
			diff < 60 && "brand new" ||
			diff < 120 && "1 minute old" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes old" ||
			diff < 7200 && "1 hour old" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours old") ||
		day_diff == 1 && "1 day old" ||
		day_diff < 7 && day_diff + " days old" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks old"
}

// http://stackoverflow.com/questions/280634
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1
}

function localSql(sql, success, error) {
  var settings = scraperwiki.readSettings()
  options = {
    url: "" + settings.source.url + "/sql/",
    type: "GET",
    dataType: "json",
    data: {
      q: sql
    }
  }
  if (success != null) {
    options.success = success
  }
  if (error != null) {
    options.error = error
  }
  return $.ajax(options)
}

function showFiles(files){
  // files should be a list of objects, containing rowids, filenames and ages:
  // [ {rowid: 2, filename: 'test.csv', age: 3600}, {…}, … ]
  console.log('showFiles')
  var $filesControl = $('#files')

  $('label', $filesControl).each(function() {
    var label = $(this)
    var id = label.attr('id')
    var found = false
    $.each(files, function(i, file){
      if('file_' + file.rowid == id){
        found = true
      }
    })
    if(!found){
      label.remove()
    }
  })


  $.each(files, function(i, file){
    var elementId = '#file_' + file.rowid
    var loading = (file.age == '' || file.age == null)
    var needToCreate = !($(elementId).length)

    if(needToCreate) {
      var label = $("<label class='checkbox'></label>").attr("id", "file_" + file.rowid)
      var input = $("<input type='checkbox' checked='checked'>").attr('value', file.filename)
      var link = $("<a></a>").text(file.filename)
      var span = $("<span class='muted'></span>")
      label.append(input).append(link).append(span)
      $filesControl.append(label)
    }

    if(loading){
      var timeOrLoading = 'Creating <img src="loading.gif" width="16" height="16">'
      $(elementId).addClass('loading').children('a').removeAttr('href')
    } else {
      var timeOrLoading = humanOldness(file.age)
      $(elementId).removeClass('loading').children('a').attr('href', file.filename)
    }

    if($(elementId + ' span.muted').html() != timeOrLoading){
      $(elementId + ' span.muted').html(timeOrLoading)  // update the time
    }
  })
  if ($('#files label').not('.loading').length == window.totalTables && longPollSet == false) {
    clearTimeout(window.poll)
    console.log('clear poll')
    window.longPoll = setInterval(trackProgress, 10000)
    longPollSet = true
    console.log('create long poll')
  }
}

function trackProgress(){
  console.log('trackProgress')
  localSql('SELECT rowid, filename, STRFTIME("%s", "now") - STRFTIME("%s", created) AS age FROM _state ORDER BY filename ASC').done(function(files){
    showFiles(files)
  }).fail(function(x, y, z){
    if(x.responseText.match(/database file does not exist/) != null){
      regenerate()
    } else {
      scraperwiki.alert('Error contacting ScraperWiki API', x.responseText, 1)
    }
  })
}

function regenerate(){
  console.log('regenerate')
  clearTimeout(window.longPoll)
  console.log('clear long poll')
  longPollSet = false
  window.poll = setInterval(trackProgress, 2000)
  console.log('create poll')
  scraperwiki.exec('echo "started"; run-one tool/extract.py ' + scraperwiki.readSettings().target.url + ' &> log.txt &')
  var li = $('<label class="loading"><span class="muted">Creating files <img src="loading.gif" width="16" height="16"></span></label>')
  li.appendTo('#files')
}

$(function(){

  $(document).on('click', '#regenerate', regenerate)
  
  scraperwiki.sql.meta(function(meta) {
    window.totalTables = Object.keys(meta.table).length
  })
  
  trackProgress()
})
