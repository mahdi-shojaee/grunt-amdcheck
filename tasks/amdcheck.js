/*
 * grunt-amdcheck
 * https://github.com/mehdishojaei/grunt-amdcheck
 *
 * Copyright (c) 2013 Mehdi Shojaei
 * Licensed under the MIT license.
 */

'use strict';

var amdextract = require('amdextract');

module.exports = function(grunt) {

  var options = {},

  logResult = function (result) {
    if (options.logModuleId && result.moduleId) {
      grunt.log.writeln('module id:', result.moduleId);
    }

    if (options.logDependencyPaths && result.paths.length) {
      grunt.log.writeln('paths:', result.paths.join(', '));
    }

    if (options.logDependencyNames && result.dependencies.length) {
      grunt.log.writeln('dependencies:', result.dependencies.join(', '));
    }

    if (options.logUnusedDependencyPaths && result.unusedPaths.length) {
      grunt.log.writeln('Unused paths: ' + result.unusedPaths.join(', '));
    }

    if (options.logUnusedDependencyNames && result.unusedDependencies.length) {
      grunt.log.writeln('Unused dependencies: ' + result.unusedDependencies.join(', '));
    }
  };

  grunt.registerMultiTask('amdcheck', 'Finds and removes unused dependencies in AMD modules.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      excepts: [],
      exceptsPaths: [],
      logFilePath: true,
      logModuleId: false,
      logDependencyPaths: false,
      logDependencyNames: false,
      logUnusedDependencyPaths: true,
      logUnusedDependencyNames: false,
      removeUnusedDependencies: true,
      saveFilesWithUnusedDependenciesOnly: false
    });

    options.logFilePath = options.logFilePath || options.logDependencyPaths || options.logDependencyNames || options.logUnusedDependencyPaths || options.logUnusedDependencyNames;

    var filesCounter = 0,
        unusedCounter = 0,
        filesWithUnusedDependenciesCounter = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var dest = f.dest;
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          ++filesCounter;
          return true;
        }
      }).forEach(function(filepath) {
        if (options.logFilePath) {
          grunt.log.write(filepath);
        }

        var fileContent = grunt.file.read(filepath),
            processResult = amdextract.parse(fileContent, {
              excepts: options.excepts,
              exceptsPaths: options.exceptsPaths,
              removeUnusedDependencies: options.removeUnusedDependencies
            }),
            results = processResult.results;

        if (options.logFilePath) {
          grunt.log.writeln(' (' + (results.length ? results.length : 'no') + ' module' + (results.length > 1 ? 's' : '') + ')');
        }

        var fileHasUnusedDependencies = false;

        results.forEach(function (result) {
          var unusedDependencies = result.unusedDependencies;

          if (unusedDependencies.length) {
            fileHasUnusedDependencies = true;
            unusedCounter += unusedDependencies.length;
          }

          logResult(result);
        });

        if (fileHasUnusedDependencies) {
          ++filesWithUnusedDependenciesCounter;
          grunt.log.writeln();
        }

        if (options.removeUnusedDependencies) {
          if (!options.saveFilesWithUnusedDependenciesOnly || fileHasUnusedDependencies) {
            grunt.file.write(dest, processResult.optimizedContent);
          }
        }
      });
    });

    grunt.log.writeln();
    grunt.log.writeln('Total unused dependencies: ' + unusedCounter + ' in ' + filesWithUnusedDependenciesCounter + ' files.');
    grunt.log.writeln('Total processed files: ' + filesCounter);
  });

};
