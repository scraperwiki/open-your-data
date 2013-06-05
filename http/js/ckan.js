$(function(){
  var form = new Form();
  var form_handler = new FormHandler();

  $('#apikey').on('input', function(event) {
    var apikey = form.getAPIKey();
    var url = form.getDatahubURL();
    form_handler.getOrganisations(apikey, url).then(form.setOrganisations);
  });

  $('#hub').change(function() {
    var url = form.getDatahubURL();
    form_handler.getLicenses(url).then(form.setLicenses);

    var apikey = form.getAPIKey();
    form_handler.getOrganisations(apikey, url).then(form.setOrganisations);
  }).change();

  var submit = function submit() {
    form_handler.resetErrors();
    if(form_handler.isValid(form)) {
      form_handler.submitDataset(form);
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
      url: form.getDatahubURL() + '/api/3/action/tag_list',
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
