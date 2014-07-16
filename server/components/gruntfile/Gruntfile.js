'use strict';

module.exports = function (grunt) {

  function diffStats (err, stdout, stderr, callback) {
    if(err) {
      return callback(err);
    }
    var gitOutputArr = stdout.split('\n');
    var changedGitLine = gitOutputArr[gitOutputArr.length - 2];
    var changedLineArr = changedGitLine.split(' ');
    var insertions = 0;
    var deletions = 0;
    for(var i = 0; i < changedLineArr.length; i++) {
      if(changedLineArr[i].indexOf('insertions') !== -1) {
        insertions = parseInt(changedLineArr[i - 1]);
      }
      if(changedLineArr[i].indexOf('deletions') !== -1) {
        deletions = parseInt(changedLineArr[i - 1]);
      }
    }
    if(isNaN(insertions) || isNaN(deletions)) {
      grunt.log.error('Issue getting insertions and deletions.');
      return callback();
    }
    grunt.option('insertions', insertions);
    grunt.option('deletions', deletions);
    grunt.task.run('updateLines');
    return callback();
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['**/*', '!GruntFile.js', '!gruntFile&username&.js', '!node_modules/**/*'],
        tasks: ['jshint:all', 'shell'],
        options: {
          spawn: false,
          livereload: 35730
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
        '!GruntFile.js',
        '!gruntFile&username&.js',
        '!node_modules/**/*'
      ]
    },
    shell: {
      gitdiff: {
        command: 'git diff --stat',
        options: {
          stderr: false,
          stdout: false,
          failOnError: true,
          callback: diffStats
        }
      }
    },
    http: {
      updateLines: {
        options: {
          url: '&siteURL&',
          method: 'POST',
          form: {
            username: '&username&',
            apiKey: '&apiKey&',
            linesAdded: null
          }
        }
      }
    }
  });
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('updateLines', 'Updates the user\'s lines per minute.', function () {
    grunt.task.requires('jshint:all');
    grunt.task.requires('shell:gitdiff');
    var oldLinesAdded = grunt.config.get('http.updateLines.options.form.linesAdded');
    var newLinesAdded = grunt.option('insertions') - grunt.option('deletions');
    grunt.log.writeln('Old Lines Added: ' + oldLinesAdded);
    grunt.log.writeln('New Lines Added: ' + newLinesAdded);
    grunt.config.set('http.updateLines.options.form.linesAdded', newLinesAdded - oldLinesAdded);
    grunt.task.run('http:updateLines');
  });
  grunt.registerTask('default', ['openport:watch.options.livereload:35730', 'watch']);
};