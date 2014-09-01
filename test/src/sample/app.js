var _ = require('lodash');

var app = function() {

  var _managers = [];

  this.addManager =  function(manager) {
    _managers.push(manager);
  };

  this.run = function() {
    _.each(_managers, function(manager) {
      new manager();
    });
  };

};

module.exports = app;