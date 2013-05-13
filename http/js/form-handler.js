FormHandler = function() {
  this.submitDataset = function submitDataset() {
    var datasetName = $("#dataset-name").val();
    var apikey = $("#apikey").val();
    alert("submitting " + apikey + " " + datasetName);
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "http://demo.ckan.org/api/3/action/package_create",
      headers: {Authorization: apikey},
      data: JSON.stringify({name: datasetName}),
      success: function (jqXHR, textStatus) {
         alert("Success " + JSON.stringify(jqXHR));
      },
      error: function (jqXHR, textStatus) {
         alert("Error " +  JSON.stringify(jqXHR));
      }
    });
  }

  this.isNameUsed = function isNameUsed(datasetName) {
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
  }

  this.resetErrors = function resetErrors() {
    $(".control-group").removeClass("error");
    $("form span").html("");
  }

  this.isValid = function isValid() {
    var datasetName = $("#dataset-name").val();
    if(this.isNameUsed(datasetName)) {
      $("#dataset-name-cg").addClass("error");
      $("#dataset-name-error").html("This name is already in use.");
      return false;
    } else {
      return true;
    }
  }
};
