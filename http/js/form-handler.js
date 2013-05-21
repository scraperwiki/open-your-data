FormHandler = function() {
  this.setupLicenses = function setupLicenses() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/licence_list",
      headers: {Authorization: apikey},
      success: function(jqXHR, textStatus) {
        for (var i = 0; i < jqXHR.result.length; i++) {
          var license = jqXHR.result[i];
          $("#license")
            .append($("<option></option>")
            .attr("value", license.id)
            .text(license.title));
        }
      }
    });
  };

  this.setupOrganisations = function setupOrganisations() {
    var apikey = $("#apikey").val();
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/organization_list_for_user",
      headers: {Authorization: apikey},
      success: function(jqXHR, textStatus) {
        for (var i = 0; i < jqXHR.result.length; i++) {
          var org = jqXHR.result[i];
          $("#org")
            .append($("<option></option>")
            .attr("value", org.id)
            .text(org.name));
        }
      }
    });
  };

  this.submitDataset = function submitDataset() {
    var datasetTitle = $("#dataset-title").val();
    var datasetName = $("#dataset-name").val();
    var apikey = $("#apikey").val();
    var description = $("#description").val();
    var license_id = $("#license").val();
    var org_id = $("#org").val();

    var http_url = scraperwiki.readSettings().source.url + "/http/";

    var resources = new Array();
    $('input:checked').each(function() {
      var filename = $(this).attr('value');
      var url = http_url + filename;      
      resources.push({url: url, format: 'CSV', mimetype: 'text/csv', name: filename});
    });

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/package_create",
      headers: {Authorization: apikey},
      data: JSON.stringify({
        title: datasetTitle,
        name: datasetName,
        resources: resources,
        notes: description,
        license_id: license_id,
        owner_org: org_id,
        extras: [
          {key: "Source", value: "http://scraperwiki.com"}
        ]
        // groups: [ {name: 'scraperwiki'}]  
      }),
      success: function (jqXHR, textStatus) {
         console.log(JSON.stringify(jqXHR));
         $("form").replaceWith("<p>Your dataset has been successfully registered. You can see it <a href=" + "http://demo.ckan.org/dataset/" + jqXHR.result.name + " target='_blank'>here</a></p>");
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

    var datasetTitle = $("#dataset-title").val();
    var datasetName = $("#dataset-name").val();

    if(datasetTitle === "") {
      $("#dataset-title-cg").addClass("error");
      $("#dataset-title-error").html("Please provide a dataset title");
      isValid = false;
    }

    if(datasetName === "") {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("Please provide a dataset name");
      isValid = false;
    }
    else if(datasetName.length < 2) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("Dataset name be at least 2 characters");
      isValid = false;
    }
    else if(datasetName.length > 100) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("Dataset name be at less than 101 characters");
      isValid = false;
    }
    else if(!/^[a-z0-9-_]+$/.test(datasetName)) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("Dataset name may only contain lowercase alphanumeric characters, - and _");
      isValid = false;
    }
    else if(isNameUsed(datasetName)) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("This name is already in use");
      isValid = false;
    } 

    var apikey = $("#apikey").val();
    if(apikey === "") {
      $("#apikey-cg").addClass("error");
      $("#apikey-error").html("Please provide an API key");
      isValid = false;
    }

    return isValid;
  };
};
