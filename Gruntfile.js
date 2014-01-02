/*
 * grunt-amd-dependency-checker
 * https://github.com/mehdishojaei/grunt-amd-dependency-checker
 *
 * Copyright (c) 2013 Mehdi Shojaei
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    amd_dependency_checker: {
      main: {
        options: {
        },
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'js/',  // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
          },
        ],
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['amd_dependency_checker']);

};
