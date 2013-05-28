$(function(){
  var form = new Form();
  var form_handler = new FormHandler();

  form_handler.getLicenses().then(form.setLicenses);

  $('#apikey').on('input', function(event) {
    var apikey = $(event.target).val()
    form_handler.getOrganisations(apikey).then(form.setOrganisations);
  });

  var submit = function submit() {
    form_handler.resetErrors();
    if(form_handler.isValid()) {
      form_handler.submitDataset();
    }
  };

  $("form").submit(function() {
    submit();
    return false;
  });

  $('#submitBtn').click(function() {
    submit();
    return false;
  });

  var ckanTagLookup = function ckanTagLookup(query, process) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/tag_list",
      data: {query: query},
      success: function(jqXHR, textStatus) {
        process(jqXHR.result);
      }
    });
  };

  $(".tagManager").tagsManager({
    deleteTagsOnBackspace: false,
    prefilled: ["ScraperWiki"],
    preventSubmitOnEnter: true,
    typeahead: true,
    typeaheadAjaxSource: null,
    typeaheadSource: ckanTagLookup,
    blinkBGColor_1: '#FFFF9C',
    blinkBGColor_2: '#CDE69C'
  });
});
