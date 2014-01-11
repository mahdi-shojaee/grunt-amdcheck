# grunt-amd-dependency-checker

> Finds and removes unused dependencies in AMD modules.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-amd-dependency-checker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-amd-dependency-checker');
```

## The "amd_dependency_checker" task

### Overview
When an AMD based project grows, number of it's js files grows too and some dependencies of the modules that had been used before, can become useless later. The AMD module loader (e.g. `requirejs`) loads those useless dependencies from network which can increase initial page load time.
This grunt plugin can detect and remove those useless dependencies without modifying source files.

### Options

#### excepts
Type: Array  
Default value: []

An array of strings or RegExps that represent dependency names that should not take into account.

#### exceptsPaths
Type: Array  
Default value: []

An array of strings or RegExps that represent dependency paths that should not take into account.

#### logFilePath
Type: boolean  
Default value: true

Log the file path of the current processing file if this option or one of the options `logDependencyPaths`, `logDependencyNames`, `logUnusedDependencyPaths` or `logUnusedDependencyNames` was true.

#### logModuleId
Type: boolean  
Default value: false

Logs the id of the module if the module id is specified.

#### logDependencyPaths
Type: boolean  
Default value: false

Logs the list of dependencies paths of the module.

#### logDependencyNames
Type: boolean  
Default value: false

Logs the list of dependencies names of the module.

#### logUnusedDependencyPaths
Type: boolean  
Default value: true

Logs the list of unused dependencies paths of the module.

#### logUnusedDependencyNames
Type: boolean  
Default value: false

Logs the list of unused dependencies names of the module.

#### removeUnusedDependencies
Type: boolean  
Default value: true

Removes detected unused dependencies and save the new files.

### Usage Examples

```js
grunt.initConfig({
  amd_dependency_checker: {
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
 * 2014-01-11   v0.1.7   Bug fix on commented dependencies. Add the new `exceptsPaths` option. Options `excepts` and `exceptsPaths` can take RegExps.
 * 2014-01-11   v0.1.6   Bug fix on commented dependencies.
 * 2014-01-05   v0.1.5   Can remove unused dependencies. Add some logging options.
 * 2014-01-02   v0.1.1   Works on files with multiple modules. Can detect module id if provided.
 * 2014-01-01   v0.1.0   Works on files with a single module.

