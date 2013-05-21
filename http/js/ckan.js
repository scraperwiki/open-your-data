$(function(){
  console.log(JSON.stringify(scraperwiki.readSettings(), undefined, 2));
  console.log(6);

  var form_handler = new FormHandler();
  form_handler.setupLicenses();
  $('#apikey').on('input', function() {
    form_handler.setupOrganisations();
  });
  $('#submitBtn').click(function(){
    form_handler.resetErrors();
    if(form_handler.isValid()) {
      form_handler.submitDataset();
    }
    return false;
  });
});
