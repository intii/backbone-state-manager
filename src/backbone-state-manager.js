/**
 * ResponsiveView will serve as a base view for every page that needs to handle
 * responsive styling from javascript (for complex behaviours in which css is not
 * enough)
 * The child view can define the set of transformations needed for each specified
 * screen size. ResponsiveView will handle the rendering and destroying of them
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["underscore", "simpleStateManager"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("underscore"), require("simpleStateManager"));
    } else {
        root.Requester = factory(root._, root.ssm);
    }
}(this, function (_, ssm) {

    var Requester = {

      /**
       * Initializes the view
       * @param  {Array} states a set of views with the specified screen sizes in which they
       * should be rendered
       * [{view: , minWidth:, maxWidth:}]
       */
      initialize: function (states) {
        /**
         * Each state of the view can make a set of transformations to the base view.
         * As no element of the base view will ever get removed from the DOM, the
         * transformations will only be additions.
         * The transformations array will contain a reference View that represents the addition,
         * allowing to undo each transformation by destroying the view
         */
        this.transformations = [];
        this.breakpoints = [];
        this.updateStates(states);
      },

      /**
       * Starts the responsive behavior
       */
      render: function () {
        this.addResizeHandlers();
      },

      /**
       * Takes the transformations defined for the view, and updates the view breakpoints
       * @param  {Array} states The actions defined in the view with the screen sizes
       */
      updateStates: function (transformations) {
        _.each(transformations, function (tfm) {
          var state = _.findWhere(this.breakpoints, {minWidth: tfm.minWidth, maxWidth: tfm.maxWidth});
          if(state) {
            state.transformations.push({view: tfm.view, id: tfm.view});
          } else {
            this.breakpoints.push({
              minWidth: tfm.minWidth,
              maxWidth: tfm.maxWidth,
              transformations: [{view: tfm.view, id: tfm.view}]
            });
          }
        }, this);
      },

      /**
       * Takes the breakpoints defined for the view, and registers the handlers for
       * the state changes
       */
      addResizeHandlers: function () {
        var self = this;
        _.each(this.breakpoints, function (breakpoint, index) {
          ssm.addState({
            id: index,
            minWidth: breakpoint.minWidth,
            maxWidth: breakpoint.maxWidth,
            onEnter: function () {
              self.reloadView(breakpoint.transformations);
              if (breakpoint.callback) {
                breakpoint.callback();
              }
            }
          });
        });
        ssm.ready();
      },

      /**
       * Updates the view for the new state
       * @param  {Object} ts  The transformations defined for the current breakpoint
       */
      reloadView: function (ts) {
        /**
         * As _.difference() but working with Objects
         */
        function difference(origin, test) {
          return _.filter(origin, function (obj) {
            return !_.findWhere(test, {id: obj.id});
          });
        }

        var toDestroy = difference(this.transformations, ts),
          toRender = difference(ts, this.transformations);

        this.flushTransformations(toDestroy);
        this.applyTransformations(toRender);

        //remove from the transformations registry the already destroyed views
        this.transformations = difference(this.transformations, toDestroy);
      },

      /**
       * Restores the DOM to the desired state by destroying the previoulsy rendered views
       * @param  {Array} toDestroy The transformations to be removed
       */
      flushTransformations: function (toDestroy) {
        _.each(toDestroy, function (transformation) {
          transformation.view.destroy();
        });
      },

      /**
       * Applies the transformations for the current breakpoint by rendering the
       * needed views
       * @param  {Array} toRender The transformations defined for the current breakpoint
       */
      applyTransformations: function (toRender) {
        _.each(toRender, function (transformation) {
          var view = new transformation.view();
          view.render();
          this.transformations.push({
            id: transformation.id,
            view: view
          });
        }, this);
      },

      /**
       * Destroys each view that's currently rendered
       */
      destroy: function() {
        this.flushTransformations(this.transformations);
      }
    };

    return Requester;
}));