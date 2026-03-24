define(["knockout", "./data"], function (ko, prototypeData) {
  function AppController() {
    var self = this;

    self.currentRole = ko.observable("admin");
    self.currentScreen = ko.observable("admin-dashboard");

    self.district = prototypeData.district;
    self.users = prototypeData.users;
    self.segmentDefinitions = prototypeData.segmentDefinitions;
    self.audienceSegments = prototypeData.audienceSegments;
    self.sources = prototypeData.sources;
    self.issues = prototypeData.issues;
    self.events = prototypeData.events;
    self.districtNotes = ko.observable(prototypeData.district.notes);

    self.activeRoleLabel = ko.pureComputed(function () {
      return self.currentRole() === "admin" ? "Administrator View" : "Campaign Manager View";
    });

    self.switchToAdministrator = function () {
      self.currentRole("admin");
      self.currentScreen("admin-dashboard");
    };

    self.switchToManager = function () {
      self.currentRole("manager");
      self.currentScreen("manager-dashboard");
    };

    self.goToScreen = function (screenId) {
      if (screenId === "admin-dashboard") {
        self.currentRole("admin");
      }

      if (screenId === "manager-dashboard") {
        self.currentRole("manager");
      }

      self.currentScreen(screenId);
    };

    self.saveDistrict = function () {
      window.alert("Prototype action: district saved.");
    };

    self.duplicateDistrict = function () {
      window.alert("Prototype action: duplicate district setup.");
    };

    self.applySourceFilters = function () {
      window.alert("Prototype action: source filters applied.");
    };

    self.addSource = function () {
      window.alert("Prototype action: add source workflow.");
    };
  }

  return new AppController();
});
