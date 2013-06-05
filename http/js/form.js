Form = function () {
  this.setLicenses = function setLicenses (licenses) { 
    $("#license").find("option").remove();
    $(licenses.result).each(function (index, license) {
      $("#license")
        .append($("<option></option>")
        .attr("value", license.id)
        .text(license.title));
    });
  };

  this.setOrganisations = function setOrganisations (orgs) { 
    $(orgs.result).each(function (index, org) {
      $("#org")
        .append($("<option></option>")
        .attr("value", org.id)
        .text(org.name));
    });
  };

  this.setError = function setError (selector, message) {
    $(selector).closest(".control-group").addClass("error");
    $(selector).siblings(".help-inline").html(message);
  };

  this.getDatahubURL = function getDatahubURL () {
    return $("#hub").attr("value")
  };

  this.getAPIKey = function getAPIKey () {
    return $("#apikey").attr("value")
  };

  this.getDatasetTitle = function getAPIKey () {
    return $("#dataset-title").val();
  };

  this.getDatasetName = function getDatasetName () {
    return $("#dataset-name").val();
  };

  this.getDescription = function getDescription () {
    return $("#description").val();
  };

  this.getLicenseId = function getLicenseId () {
    return $("#license").val();
  };

  this.getOrgId = function getOrgId () {
    return $("#org").val();
  };
};
