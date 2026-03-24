requirejs.config({
  baseUrl: ".",
  paths: {
    knockout: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/knockout/knockout-3.5.1",
    jquery: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/jquery/jquery-3.7.1.min",
    "jqueryui-amd": "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/jquery/jqueryui-amd-1.14.1.min",
    ojs: "https://static.oracle.com/cdn/jet/v19.0.0/default/js/min",
    ojL10n: "https://static.oracle.com/cdn/jet/v19.0.0/default/js/ojL10n",
    ojtranslations: "https://static.oracle.com/cdn/jet/v19.0.0/default/js/resources",
    text: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/require/text",
    hammerjs: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/hammer/hammer-2.0.8.min",
    signals: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/js-signals/signals.min",
    ojdnd: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/dnd-polyfill/dnd-polyfill-1.0.2.min",
    css: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/require-css/css.min",
    customElements: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/webcomponents/custom-elements.min",
    proj4: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/proj4js/dist/proj4",
    touchr: "https://static.oracle.com/cdn/jet/v19.0.0/3rdparty/touchr/touchr"
  }
});

require([
  "ojs/ojbootstrap",
  "knockout",
  "./js/appController",
  "ojs/ojknockout",
  "ojs/ojbutton",
  "ojs/ojavatar",
  "ojs/ojformlayout",
  "ojs/ojinputtext",
  "ojs/ojtextarea"
], function (Bootstrap, ko, app) {
  Bootstrap.whenDocumentReady().then(function () {
    ko.applyBindings(app, document.getElementById("globalBody"));
  });
});
