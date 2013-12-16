/**
 * Created by arun.bakthavatchalam on 12/8/13.
 */
require('../src/nndb.js');
var util = require('util');
var events = require('events');
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');

describe("scrape for judges ", function() {



    var StdOut = function() {
        this.callbacks = {};
    };
    util.inherits(StdOut, EventEmitter);
    StdOut.prototype.on = function(eventType, callback){
        this.callbacks[eventType] = callback;
    }

    StdOut.prototype.logToStdout = function(eventType) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (this.callbacks[eventType]) {
            this.callbacks[eventType].apply(this, args);
        }
    }
    var stdout = new StdOut();
    var stderr = {
        on: function() {}
    }

    var child_process = {
        stderr: stderr,
        stdout: stdout,
        spawn: function(){return this;},
        on: function(){}
    };

    it("spawns child process", function() {


        spyOn(child_process,"spawn").andReturn(child_process);

        var nndb = new Nndb(child_process);
        nndb.scrapeForJudges('../src/scrape_nndb_judges.js',0);
        expect(child_process.spawn).toHaveBeenCalledWith( 'phantomjs',['../src/scrape_nndb_judges.js', 0]);

    });


    it("produces json data array of length one", function(){

        var nndb = new Nndb(child_process);
        nndb.scrapeForJudges('../src/scrape_nndb_judges.js',0);
        stdout.logToStdout('data', '{"name":"Judge Joe Brown","next_page":');
        stdout.logToStdout('data', '"http://www.nndb.com/people/595/000110265/"}\n');
        stdout.logToStdout('data', 'NO_MORE_RESULTS\n');

        expect(nndb.scrapingComplete()).toBeFalsy();
        nndb.parseResults();
        expect(nndb.judgesData.length).toBe(0);

    });


});

