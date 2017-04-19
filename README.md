# grunt-amdcheck [![Known Vulnerabilities](https://snyk.io/test/github/mehdishojaei/grunt-amdcheck/badge.svg)](https://snyk.io/test/github/mehdishojaei/grunt-amdcheck)

> Uses AST to find and remove unused dependencies in AMD modules.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-amdcheck --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-amdcheck');
```

## The "amdcheck" task

### Overview
When an AMD-based project grows, so does the number of its JS files. Some dependencies of previously used modules may no longer be necessary. The AMD module loader (e.g. `requirejs`) loads those useless dependencies from the network, which can increase initial page load time.
This grunt plugin can detect and remove those useless dependencies without modifying source files.

## example

source.js
```js
define('module1', ['p1', 'p2'], function (a, b) {
  return a;
});

define('module2', ['p1', 'p2', 'p3'], function (a, b, c) {
  return b;
});
```

optimized-source.js
```js
define('module1', ['p1'], function (a) {
  return a;
});

define('module2', ['p2'], function (b) {
  return b;
});
```

### Options

#### excepts
Type: Array  
Default value: []

An array of strings or RegExps that represent dependency names that should not be taken into account.

#### exceptsPaths
Type: Array  
Default value: []

An array of strings or RegExps that represent dependency paths that should not be taken into account.

NOTE: `exceptsPaths`, followed by a comma-separated list of module paths can be declared before each module definition. This exception is only applied to the underlying module definition.

source.js
```js
/* exceptsPaths: p3 */
define(['p1', 'p2', 'p3'], function (a, b, c) {
  return b;
});
```

optimized-source.js
```js
/* exceptsPaths: p3 */
define(['p2', 'p3'], function (b, c) {
  return b;
});
```

#### strict
Type: boolean  
Default value: false

When strict is true, throws an error if at least one unused dependency path or dependency name was found.

#### logModuleId
Type: boolean  
Default value: false

Logs the id of the module if the module id is specified.

#### logDependencyPaths
Type: boolean  
Default value: false

Logs the list of dependency paths of the module.

#### logDependencyNames
Type: boolean  
Default value: false

Logs the list of dependency names of the module.

#### logUnusedDependencyPaths
Type: boolean  
Default value: true

Logs the list of unused dependency paths of the module.

#### logUnusedDependencyNames
Type: boolean  
Default value: false

Logs the list of unused dependency names of the module.

#### removeUnusedDependencies
Type: boolean  
Default value: true

Removes detected unused dependencies and saves the new files.

#### saveFilesWithUnusedDependenciesOnly
Type: boolean  
Default value: false

When removing unused dependencies (i.e. `removeUnusedDependencies: true`), only write out files that have unused dependencies.

### Usage Examples

```js
grunt.initConfig({
  amdcheck: {
    dev: {
      options: {
        excepts: ['module'],
        exceptsPaths: ['require', /^jquery\./]
      },
      files: [
        {
          expand: true,
          cwd: 'js/',
          src: ['**/*.js'],
          dest: 'build/'
        }
      ]
    }
  }
});
```

## Release History
 * 2016-04-13   v1.3.2   Update grunt peerDep.
 * 2015-05-13   v1.3.1   Option 'strict' added.
 * 2015-05-12   v1.3.0   Option 'logFilePath' removed (only filepaths with unused deps will be logged).
 * 2014-08-22   v1.2.5   Fix a bug when there are comments between paths and dependencies.
 * 2014-08-16   v1.2.0   Entirely uses AST.
 * 2014-07-20   v1.0.0   Uses AST to find out unused dependencies.
 * 2014-04-21   v0.3.0   Added option to only write out files that have unused dependencies.
 * 2014-03-19   v0.2.2   Update the dependency version.
 * 2014-01-22   v0.2.1   `exceptsPaths` can also be defined before each module definition.
 * 2014-01-13   v0.2.0   Extracted the core as a separate package ([amdextract](https://github.com/mehdishojaei/amdextract)).
 * 2014-01-12   v0.1.7   Bug fix on commented dependencies. Add the new `exceptsPaths` option. Options `excepts` and `exceptsPaths` can take RegExps.
 * 2014-01-11   v0.1.6   Bug fix on commented dependencies.
 * 2014-01-05   v0.1.5   Can remove unused dependencies. Add some logging options.
 * 2014-01-02   v0.1.1   Works on files with multiple modules. Can detect module id if provided.
 * 2014-01-01   v0.1.0   Works on files with a single module.
