# grunt-amd-dependency-checker

> A grunt plugin that finds unused dependencies in AMD modules.

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
In your project's Gruntfile, add a section named `amd_dependency_checker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  amd_dependency_checker: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

Currently no options are supported.

### Usage Examples

```js
grunt.initConfig({
  amd_dependency_checker: {
    options: {},
    files: [
      {
        expand: true,     // Enable dynamic expansion.
        cwd: 'test/js/',  // Src matches are relative to this path.
        src: ['**/*.js'], // Actual pattern(s) to match.
      },
    ],
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
