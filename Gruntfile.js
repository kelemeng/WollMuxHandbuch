module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Kommandozeilenparameter
    var tag = grunt.option('tag');
    var message = grunt.option('message');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
          scripts: {
            files: ['markdown/**/*.*'],
            tasks: ['run:honkit'],
            options: {
              spawn: false,
              interrupt: true,
              livereload: true
            },
          },
        },
        run: {
            options: {
              // Task-specific options go here.
            },
            honkit: {
                 cmd: (function(){
                    return "node_modules/honkit/bin/honkit.js";
                }()),
                args: [
                    'build'
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '_book'
                }
            }
        },
        markdownlint: {
            full: {
                options: {
                    config: {
                        'default': true,
                        'line-length': false,
                        'blanks-around-headers': false,
                        'no-duplicate-header': false,
                        'no-inline-html': false,
                        'fenced-code-language': false
                    }
                },
                src: [
                    'README.md',
                    'markdown/**/*.md'
                ]
            }
        },
        'gh-pages': {
            options: {
                base: '_book',
                push: true,
                tag: (function(){ return (tag) ? tag : ""; }()),
                message: (function(){ return (message) ? message : "Neue Version."; }()),
                user: {
                    name: 'WollMux',
                    email: 'wollmux@wollmux.org'
                }
            },
            src: ['**']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-markdownlint');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['run:honkit', 'connect', 'watch']);
    grunt.registerTask('check', ['markdownlint']);
    grunt.registerTask('deploy', ['run:honkit', 'gh-pages']);
    grunt.registerTask('serve', ['run:honkit', 'serve']);
};
