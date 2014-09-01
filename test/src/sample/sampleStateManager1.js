var StateManager = require('../stateManager');
var dummyView1 = require('./components/sampleView1.js');
var dummyView2 = require('./components/sampleView2.js');

var sampleStateManager1 = StateManager.extend({

  states: {
    b3:[
      {id: 'dummyView1', view: dummyView1}
    ],
    b4:[
      {id: 'dummyView1', view: dummyView1}
    ],
    b5:[
      {id: 'dummyView2', view: dummyView2}
    ]
  },

  initialize: function() {
    StateManager.prototype.initialize(this.states);
  },

  render: function() {
    StateManager.prototype.render();
  },

  destroy: function() {
  }
});

module.exports = sampleStateManager1;
