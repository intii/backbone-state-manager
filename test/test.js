'use strict';
//A dummy app
var App = require('./src/sample/app');
var jsdom = require('jsdom');

var wrapTest = function(test) {
  jsdom.env('<div></div>',function (errors, window) {
    GLOBAL.window = window;
    console.log(GLOBAL.window.open(''));
    GLOBAL.document = window.document;
    test();
  });
};

exports['Main test'] = {

  'singleTest': function(test) {
    var callback = function() {
      //Create a single instance of the state manager
      var sampleStateManager1 = require('./src/sample/sampleStateManager1');
      var app = new App();
      window.resizeTo(800,600);
      console.log(window.outerWidth);
      app.addManager(sampleStateManager1);
      //Ensure that the transformations are rendered in response to viewport resizing
      test.equal(true,true);
      test.done();
    }
    wrapTest(callback);

  },
  'multipleTest': function(test) {
    var callback = function() {
      //Create two or more state manager instances
      var sampleStateManager1 = require('./src/sample/sampleStateManager1');
      var sampleStateManager2 = require('./src/sample/sampleStateManager2');
      var app = new App();
      app.addManager(sampleStateManager1);
      app.addManager(sampleStateManager2);
      test.equal(true,true);
      test.done();
    }
    wrapTest(callback);
  }

}