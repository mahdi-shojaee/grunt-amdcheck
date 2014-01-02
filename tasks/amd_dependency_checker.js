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
    // Add white space to start and end of text for cases that variable is $ and text starts or ends with $.
    // Its acctually a bug that must fix!
    text = ' ' + text + ' ';
    variable = variable.replace('$', '\\$');

    var validChars = '(?:[^A-Za-z0-9_\\$"\']|^|$)',
      pattern = validChars + variable + validChars,
      regExp = new RegExp(pattern);

    return !!regExp.exec(text);
  },

  processFile = function (filepath) {
    var unusedDependencies = [],
      content = grunt.file.read(filepath);

    // Read file source.
    var matches = /define\s*\(\s*\[\s*([^]*?)\s*\]\s*,\s*function\s*\(\s*([^]*?)\s*\)\s*(\{[^]*\})/m.exec(content);

    if (matches) {
      var paths = matches[1],
          dependencies = matches[2],
          text = matches[3], // Unprocessed
          body, // Module body with comments
          source, // Module body without comments
          comments; // Array of inline and block comments

      if (paths) {
        //grunt.log.writeln('paths:', paths);
        paths = paths.split(/\s*,\s*/);
      }

      if (dependencies) {
        //grunt.log.writeln('dependencies:', dependencies);
        dependencies = dependencies.split(/\s*,\s*/);
      }

      if (paths && dependencies && text) {
        body = getModuleBody(text);

        if (body) {
          var result = removeComments(body);

          if (result) {
            source = result.source;
            comments = result.comments;

            for (var key in dependencies) {
              var dependency = dependencies[key];

              if (!findUseage(dependency, source)) {
                unusedDependencies.push(dependency);
              }
            }
          }
        }
      }
    }

    return unusedDependencies;
  };

  grunt.registerMultiTask('amd_dependency_checker', 'A grunt plugin that finds unused dependencies in AMD modules.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
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
        var result = processFile(filepath);

        if (result && result.length) {
          ++filesWithUnusedDependenciesCounter;
          var str = '';
          result.forEach(function (dependency) {
            ++unusedCounter;
            str += (str.length ? ', ' : '') + dependency;
          });

          grunt.log.writeln();
          grunt.log.writeln('Unused dependencies: ' + str);
          grunt.log.writeln();
        } else {
          grunt.log.writeln(' Ok');
        }
      });
    });

    grunt.log.writeln();
    grunt.log.writeln('Total unused dependencies: ' + unusedCounter + ' in ' + filesWithUnusedDependenciesCounter + ' files.');
    grunt.log.writeln('Total processed files: ' + filesCounter);
  });

};
