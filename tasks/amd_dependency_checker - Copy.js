/*
 * grunt-amd-dependency-checker
 * https://github.com/mehdishojaei/grunt-amd-dependency-checker
 *
 * Copyright (c) 2013 Mehdi Shojaei
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var options = {};

  var getModuleBody = function (text) {
    for (var i = 0, counter = 0, len = text.length; i < len; ++i) {
      if (text[i] === '{') {
        ++counter;
      } else if (text[i] === '}') {
        --counter;
      }

      if (!counter) {
        break;
      }
    }

    return text.substring(1, i);
  },

  removeComments = function (text) {
    var comments = [];
    text = text.replace(/(?:\/\*[^]*?\*\/)|(?:\/\/[^]*?$)/gm, function (match) {
      comments.push(match);
      return '';
    });

    return { source: text, comments: comments };
  },

  findUseage = function (variable, text) {
    variable = variable.replace('$', '\\$');

    var validChars = '(?:[^A-Za-z0-9_\\$"\']|^|$)',
      pattern = validChars + variable + validChars,
      regExp = new RegExp(pattern);

    return !!regExp.exec(text);
  },

  processFile = function (filepath) {
    var results = [],
        content = grunt.file.read(filepath);

    var re = /define\s*\(\s*(?:['"](.*)['"]\s*,\s*)?(?:\[\s*([^]*?)\s*\]\s*,)?\s*function\s*\(\s*([^]*?)\s*\)\s*\{/gm,
        matches;

    while ((matches = re.exec(content)) !== null) {
      var moduleId = matches[1],
          pathsStr = matches[2],
          dependenciesStr = matches[3],
          paths,
          dependencies,
          unusedDependencies = [],
          usedDependencies = [],
          text = content.substr(re.lastIndex - 1), // Unprocessed
          body, // Module body with comments
          source, // Module body without comments
          comments; // Array of inline and block comments

      paths = pathsStr ? pathsStr.split(/\s*,\s*/) : [];
      dependencies = dependenciesStr ? dependenciesStr.split(/\s*,\s*/) : [];

      if (paths && dependencies && text) {
        body = getModuleBody(text);

        if (body) {
          var rcResult = removeComments(body);

          if (rcResult) {
            source = rcResult.source;
            comments = rcResult.comments;

            unusedDependencies = dependencies.filter(function (dependency) {
              return options.excepts.indexOf(dependency) < 0 && !findUseage(dependency, source);
            });

            usedDependencies = dependencies.filter(function (dependency) {
              return unusedDependencies.indexOf(dependency) < 0;
            });

            results.push({
              moduleId: moduleId,
              paths: paths,
              dependencies: dependencies,
              unusedDependencies: unusedDependencies,
              bodyWithComments: body,
              bodyWithoutComments: source,
              comments: comments
            });
          }

          re.lastIndex += body.length;
        }
      }
    }

    return results;
  },

  logResult = function (result) {
    if (options.logModuleId && result.moduleId) {
      grunt.log.writeln('\nmodule id:', result.moduleId);
    }

    if (options.logDependencyPaths && result.paths.length) {
      grunt.log.writeln('\npaths:', result.paths.join(', '));
    }

    if (options.logDependencyNames && result.dependencies.length) {
      grunt.log.writeln('\ndependencies:', result.dependencies.join(', '));
    }

    if (options.logUnusedDependencyNames && result.unusedDependencies.length) {
      grunt.log.writeln('\nUnused dependencies: ' + result.unusedDependencies.join(', '));
    }
  };

  grunt.registerMultiTask('amd_dependency_checker', 'Finds unused dependencies in AMD modules.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      excepts: [],
      logModuleId: false,
      logDependencyPaths: false,
      logDependencyNames: false,
      logUnusedDependencyNames: true
    });

    var filesCounter = 0,
        unusedCounter = 0,
        filesWithUnusedDependenciesCounter = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
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
        grunt.log.write('Processing "' + filepath + '"...');

        var results = processFile(filepath);

        grunt.log.write(' [' + (results.length ? results.length : 'no') + ' module' + (results.length > 1 ? 's' : '') + ']');

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
        }

        grunt.log.writeln();
      });
    });

    grunt.log.writeln();
    grunt.log.writeln('Total unused dependencies: ' + unusedCounter + ' in ' + filesWithUnusedDependenciesCounter + ' files.');
    grunt.log.writeln('Total processed files: ' + filesCounter);
  });

};
