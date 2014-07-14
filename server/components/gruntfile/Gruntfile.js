'use strict';

var updateLinesTask = 'updateLines:&username&';
var config = require('../lib/config/config');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['**/*', '!GruntFile.js', '!node_modules/**/*'],
        tasks: ['jshint:all', updateLinesTask],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '**/*.js',
        '!node_modules/**/*'
      ]
    },
    http: {
      updateLines: {
        options: {
          url: '&siteURL&',
          method: 'POST',
          form: {
            username: username,
            currentTime: Date.now(),
            linesAdded: // TODO
          }
        }
      }
    }
  });
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('updateLines', 'Updates the user\'s lines per minute.', function (username) {
    grunt.task.requires('jshint:all');
  });
  grunt.registerTask('default', ['watch']);
};