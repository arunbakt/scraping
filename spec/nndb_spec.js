/**
 * Created by arun.bakthavatchalam on 12/8/13.
 */
require('../src/nndb.js');
var util = require('util');
var events = require('events');
var EventEmitter = require('events').EventEmitter;

describe("scrape for judges ", function() {


    var child_process;
    var stdout;
    var nndb;
    var nextStep;
    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));

    beforeEach(function() {

        var StdOut = function() {};
        util.inherits(StdOut, EventEmitter);

        StdOut.prototype.logToStdout = function(eventType) {
            var args = Array.prototype.slice.call(arguments, 1);
            this.emit(eventType, args);
        }

        stdout = new StdOut();

        var stderr = {
            on: function() {}
        }

        var ChildProcess =  function(){};
        util.inherits(ChildProcess, EventEmitter);
        ChildProcess.prototype.stdout = stdout;
        ChildProcess.prototype.stderr = stderr;
        ChildProcess.prototype.spawn = function() {return this};

        child_process = new ChildProcess();
        nndb = new Nndb(child_process);
        nextStep = function() {}; // callback to aid in async series steps

    });


    it("spawns child process", function() {

        spyOn(child_process,"spawn").andReturn(child_process);
        nndb.scrapeForJudges('../src/scrape_nndb_judges.js', nextStep);
        expect(child_process.spawn).toHaveBeenCalledWith( './node_modules/phantomjs/bin/phantomjs',['../src/scrape_nndb_judges.js', jasmine.any(Number)]);
        stdout.logToStdout('data', 'NO_MORE_RESULTS\n');
        child_process.emit('exit');

    });

    it("produces json data of array length one when child processes's stdout prints single line of scraped data", function(){


        nndb.scrapeForJudges('../src/scrape_nndb_judges.js', nextStep);
        stdout.logToStdout('data', '{"name":"Judge Joe Brown","next_page":');
        stdout.logToStdout('data', '"http://www.nndb.com/people/595/000110265/"}\n');
        stdout.logToStdout('data', 'NO_MORE_RESULTS\n');
        stdout.logToStdout('data', 'NO_MORE_RESULTS\n');

        expect(nndb.scrapingForJudgesComplete()).toBeFalsy();
        child_process.emit('exit');
        expect(nndb.scrapingForJudgesComplete()).toBeTruthy();

        nndb.parseResults(nextStep);
        expect(nndb.judgesData.length).toBe(1);


    });


    it("produces empty judges array when no judges are found", function(){

        nndb.scrapeForJudges('../src/scrape_nndb_judges.js',nextStep);
        stdout.logToStdout('data', 'NO_MORE_RESULTS\n');
        nndb.parseResults(nextStep);
        expect(nndb.judgesData.length).toBe(0);
        child_process.emit('exit');
    });


    describe("Scrape for additional information for judges", function(){

        beforeEach(function() {
            nndb.judgesData = ['{"name":"Judge Joe Brown","next_page":"http://www.nndb.com/people/595/000110265/"}'];
            nndb.scrapeAdditionalInfo('../src/retrieve_judge_info.js',nextStep);
            stdout.logToStdout('data', '*** WARNING: Method userSpaceScaleFactor in.\n ');
            stdout.logToStdout('data', 'javascript error\n');
            stdout.logToStdout('data', '{"name":"Judge Joe Brown","next_page":');
            stdout.logToStdout('data', '"http://www.nndb.com/people/595/000110265/');
            stdout.logToStdout('data', '","birthplace":"Queens, NY');
            stdout.logToStdout('data', '", "militaryService":"true"}\n');
            stdout.logToStdout('data', ' \n');
            child_process.emit('exit');

        });


        it("produces birthplace and military service information", function(){

            expect(nndb.judgesData[0].birthplace).toBeDefined();
            expect(nndb.judgesData[0].birthplace).toBe("Queens, NY");

        });

        it("military service is true when scraping finds military service information", function(){

            expect(nndb.judgesData[0].militaryService).toBeTruthy();

        });


    });



    describe("When additional info element are not present in the page", function(){


        beforeEach(function() {
            nndb.judgesData = ['{"name":"Judge Joe Brown","next_page":"http://www.nndb.com/people/595/000110265/"}'];
            nndb.scrapeAdditionalInfo('../src/retrieve_judge_info.js',nextStep);
            stdout.logToStdout('data', '*** WARNING: Method userSpaceScaleFactor in.\n ');
            stdout.logToStdout('data', 'javascript error\n');
            stdout.logToStdout('data', '{"name":"Judge Joe Brown","next_page":');
            stdout.logToStdout('data', '"http://www.nndb.com/people/595/000110265/');
            stdout.logToStdout('data', '"}\n');
            stdout.logToStdout('data', ' \n');
            child_process.emit('exit');

        });

        it("birthplace is marked as 'Not Available'", function(){

            expect(nndb.judgesData[0].birthplace).toBe("Not Available");

        });

        it("military service is undefined", function(){

            expect(nndb.judgesData[0].militaryService).toBeUndefined();

        });

    });

});

