module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browserify: {
        files: ['src/js/**/*.js'],
        tasks: ['browserify:dev', 'string-replace:dev'],
        options: {
          livereload: true
        }
      },
      copy: {
        files: ['src/*', 'src/css/*', 'src/img/*'],
        tasks: ['clean', 'copy', 'browserify:dev', 'htmlmin', 'string-replace:dev'],
        options: {
          livereload: true
        }
      }
    },
    clean: ['!dist/js/app.js', '!dist/js/app.js.map', 'dist/**', 'tmp/**'],
    browserify: {
      dev: {
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            ['babelify', { presets: ['es2015', 'react', 'stage-0'] }],
            ['envify', { NODE_ENV: 'development', global: true }]/*,
            'browserify-shim'*/
          ]
        },
        src: ['src/js/main.js'],
        dest: 'tmp/js/app.js'
      },
      dist: {
        options: {
          browserifyOptions: {
            debug: false
          },
          transform: [
            ['babelify', { presets: ['es2015', 'react', 'stage-0'] }],
            ['envify', { NODE_ENV: 'production', global: true }]/*,
            'browserify-shim'*/
          ]
        },
        src: ['src/js/main.js'],
        dest: 'tmp/js/app.js'
      }
    },
    'string-replace': {
      dev: {
        files: {
          'dist/js/app.js': 'tmp/js/app.js',
          'dist/index.html': 'tmp/index.html'
        },
        options: {
          replacements: [
            {
              pattern: '****version****',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '***version***',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '**version**',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '<!--[if dev]><![endif]-->',
              replacement: '<script src="http://localhost:35729/livereload.js"></script>'
            }
          ]
        }
      },
      dist: {
        files: {
          'tmp/js/app.js': 'tmp/js/app.js',
          'dist/index.html': 'tmp/index.html'
        },
        options: {
          replacements: [
            {
              pattern: '****version****',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '***version***',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '**version**',
              replacement: grunt.file.readJSON('package.json').version
            },
            {
              pattern: '<!--[if dev]><![endif]-->',
              replacement: ''
            }
          ]
        }
      }
    },
    closurecompiler: {
      dist: {
        options: {
          closure_compilation_level: 'SIMPLE',
          debug: false,
          closure_create_source_map: false,
          exec_maxBuffer: 100000
        },
        files: {
          'dist/js/app.js': ['tmp/js/app.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'src/', src: ['*'], dest: 'dist/', filter: 'isFile' },
          { expand: true, cwd: 'src/', src: ['js/vendor/**'], dest: 'dist/' },
          { expand: true, cwd: 'src/', src: ['css/**'], dest: 'dist/' },
          { expand: true, cwd: 'src/', src: ['img/**'], dest: 'dist/' },
          { expand: true, cwd: 'node_modules/bootstrap/dist/css/', src: ['bootstrap.min.css', 'bootstrap.min.css.map'], dest: 'dist/css/' }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true
        },
        files: {
          'tmp/index.html': 'src/index.html'
        }
      }
    },
    cssmin: {
      options: {
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/main.css': 'src/css/main.css'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-google-closure-tools-compiler')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-string-replace')

  grunt.registerTask('default', ['clean', 'copy', 'browserify:dev', 'htmlmin', 'string-replace:dev'])
  grunt.registerTask('dist', ['clean', 'copy', 'cssmin', 'browserify:dist', 'htmlmin', 'string-replace:dist', 'closurecompiler'])

}