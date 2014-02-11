module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner:
        '// Backbone.Supermodel\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Tan Nguyen\n' +
        '// Distributed under MIT license\n' +
        '//\n'
    },

    preprocess: {
      amd: {
        src: 'src/amd.js',
        dest: 'build/backbone.supermodel.amd.js'
      },
      direct: {
        src: 'src/backbone.supermodel.js',
        dest: 'build/backbone.supermodel.js'
      }
    },

    uglify : {
      options: {
        banner: "<%= meta.banner %>"
      },
      amd : {
        src : 'build/backbone.supermodel.amd.js',
        dest : 'build/backbone.supermodel.amd.min.js',
      },
      direct: {
        src : 'build/backbone.supermodel.js',
        dest : 'build/backbone.supermodel.min.js',
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests.js'],
      },
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      supermodel : [ 'src/backbone.supermodel.js' ]
    },

    benchmark: {
      all: {
        src: ['benchmarks/*.js'],
        dest: 'benchmarks/results.csv'
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-benchmark');

  grunt.registerTask('build', ['preprocess', 'jshint', 'uglify']);
  grunt.registerTask('test', ['build', 'mochaTest']);
  grunt.registerTask('default', ['test', 'build']);

};