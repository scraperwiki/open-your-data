Form = function () {
  this.setLicenses = function setLicenses (licenses) { 
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
};
