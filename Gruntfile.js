/*
 * grunt-amdcheck
 * https://github.com/mehdishojaei/grunt-amdcheck
 *
 * Copyright (c) 2013 Mehdi Shojaei
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    amdcheck: {
      main: {
        options: {
          // excepts: ['b'],
          exceptsPaths: [/^jquery\./],
          // logUnusedDependencyPaths: false,
          // logUnusedDependencyNames: true,
          // removeUnusedDependencies: false
        },
        files: [
          {
            expand: true,
            cwd: 'js/',
            src: ['**/*.js'],
            dest: 'tmp/'
          }
        ]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-amdcheck');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['amdcheck']);

};
