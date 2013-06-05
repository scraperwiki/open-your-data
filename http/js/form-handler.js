FormHandler = function() {
  this.getLicenses = function getLicenses(url) {
    return $.ajax({
      type: "GET",
      dataType: "json",
      url: url + "/api/3/action/licence_list",
      data: JSON.stringify({})
    });
  };

  this.getOrganisations = function getOrganisations(apikey, url) {
    return $.ajax({
      type: "GET",
      dataType: "json",
      url: url + "/api/3/action/organization_list_for_user",
      headers: {Authorization: apikey}
    });
  };

  this.submitDataset = function submitDataset(form) {
    var http_url = scraperwiki.readSettings().source.url + "/http/";

    var resources = new Array();
    $('input:checked').each(function() {
      var filename = $(this).attr('value');
      var url = http_url + filename;      
      resources.push({url: url, format: 'CSV', mimetype: 'text/csv', name: filename});
    });

    var tags = $("input[name='hidden-tags']").val().split(",");
    $(tags).each(function(index, value) {
      tags[index] = {"name": value};
    });

    $.ajax({
      type: "POST",
      dataType: "json",
      url: form.getDatahubURL() + "/api/3/action/package_create",
      headers: {Authorization: form.getAPIKey()},
      data: JSON.stringify({
        title: form.getDatasetTitle(),
        name: form.getDatasetName(),
        resources: resources,
        notes: form.getDescription(),
        license_id: form.getLicenseId(),
        owner_org: form.getOrgId(),
        tags: tags,
        extras: [
          {key: "Source", value: "http://scraperwiki.com"}
        ]
        // groups: [ {name: 'scraperwiki'}]  
      }),
      success: function (jqXHR, textStatus) {
         $("form").replaceWith("<p>Your dataset has been successfully registered. You can see it <a href=" + form.getDatahubURL() + "/dataset/" + jqXHR.result.name + " target='_blank'>here</a></p>");
      },
      error: function (jqXHR, textStatus) {
         alert("Error " +  JSON.stringify(jqXHR));
      }
    });
  };

  function isNameUsed(datasetName, url) {
    var used;

    $.ajax({
      type: "POST",
      dataType: "json",
      url: url + "/api/3/action/package_list",
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
    $("form span.help-inline").html("");
  };

  this.isValid = function isValid(form) {
    var isValid = true;

    if(form.getDatasetTitle() === "") {
      form.setError("#dataset-title", "Please provide a dataset title")
      isValid = false;
    }

    var datasetName = form.getDatasetName();
    if(datasetName === "") {
      form.setError("#dataset-name", "Please provide a dataset name")
      isValid = false;
    }
    else if(datasetName.length < 2) {
      form.setError("#dataset-name", "Dataset name be at least 2 characters")
      isValid = false;
    }
    else if(datasetName.length > 100) {
      form.setError("#dataset-name", "Dataset name be at less than 101 characters")
      isValid = false;
    }
    else if(!/^[a-z0-9-_]+$/.test(datasetName)) {
      form.setError("#dataset-name", "Dataset name may only contain lowercase alphanumeric characters, - and _")
      isValid = false;
    }
    else if(isNameUsed(datasetName, form.getDatahubURL())) {
      form.setError("#dataset-name", "This name is already in use")
      isValid = false;
    } 

    if(form.getAPIKey() === "") {
      form.setError("#apikey", "Please provide an API key")
      isValid = false;
    }

    return isValid;
  };
};
