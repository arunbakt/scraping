module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bgShell: {
            coverage: {
                cmd: 'node node_modules/istanbul/lib/cli.js cover --dir build/coverage node_modules/jasmine-node/bin/jasmine-node -- spec --forceexit'
            },
            cobertura: {
                cmd: 'node node_modules/istanbul/lib/cli.js report --root build/coverage --dir build/coverage/cobertura cobertura'
            }
        },

        open: {
           file: {
               path: 'build/coverage/lcov-report/index.html'
           }
        },

        jasmine_node: {

            specNameMatcher: "spec",
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: true,
                savePath: 'build/reports/jasmine/',
                useDotNotation: true,
                consolidate: true
            }

        }
        });

    // Load tasks
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-bg-shell');

    // Register tasks.
    grunt.registerTask('test', ['jasmine_node']);
    grunt.registerTask('cover', ['bgShell:coverage', 'open']);


};
