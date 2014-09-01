module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: '<json:package.json>',

    nodeunit: {
      files: ['test/test.js']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Register nodeunit task.
  grunt.registerTask('test', ['nodeunit']);


};
