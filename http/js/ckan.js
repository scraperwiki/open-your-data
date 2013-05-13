$(function(){
  console.log(JSON.stringify(scraperwiki.readSettings(), undefined, 2));
  console.log(5);

  var form_handler = new FormHandler();
  $('#submitBtn').click(function(){
    form_handler.resetErrors();
    if(form_handler.isValid()) {
      form_handler.submitDataset();
    }
    return false;
  });
})
