FormHandler = function() {
  this.submitDataset = function submitDataset() {
    var datasetName = $("#dataset-name").val();
    var apikey = $("#apikey").val();

    var http_url = scraperwiki.readSettings().source.url + "/http/";

    var resources = new Array();
    $('input:checked').each(function() {
      var url = http_url + $(this).siblings('a').attr('href');
      resources.push({url: url, mimetype: 'csv'});
    });

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/package_create",
      headers: {Authorization: apikey},
      data: JSON.stringify({name: datasetName, resources: resources}),
      success: function (jqXHR, textStatus) {
         console.log(JSON.stringify(jqXHR));
         $("form").replaceWith("<p>Your dataset has been successfully registered. You can see it <a href=" + "xxx" + " target='_blank'>here</a></p>");
      },
      error: function (jqXHR, textStatus) {
         alert("Error " +  JSON.stringify(jqXHR));
      }
    });
  };

  function isNameUsed(datasetName) {
    var used;

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/package_list",
      headers: {Authorization: apikey},
      data: JSON.stringify({name: datasetName}),
      async: false,
      success: function (jqXHR, textStatus) {
         if($.inArray(datasetName, jqXHR.result) === -1) {
             used = false;
         } else {
             used = true;
         }
      },
      error: function (jqXHR, textStatus) {
         alert("Error " +  JSON.stringify(jqXHR));
      }
    });
    return used;
  };

  this.resetErrors = function resetErrors() {
    $(".control-group").removeClass("error");
    $("form span").html("");
  };

  this.isValid = function isValid() {
    var isValid = true;

    var datasetName = $("#dataset-name").val();

    if(datasetName === "") {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("Please provide a dataset name.");
      isValid = false;
    }
    else if(isNameUsed(datasetName)) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("This name is already in use.");
      isValid = false;
    } 

    var apikey = $("#apikey").val();
    if(apikey === "") {
      $("#apikey-cg").addClass("error");
      $("#apikey-error").html("Please provide an API key.");
      isValid = false;
    }

    return isValid;
  };
};
