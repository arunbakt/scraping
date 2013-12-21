require('../src/TDDQuestion.js');

describe("Verify", function() {

    it("spawns child process", function() {


        var stdout = {
            on: function() {}
        };
        var stderr = {
            on: function() {}
        }

        var child_process = {
            stderr: stderr,
            stdout: stdout,
            spawn: function(){return this;},
            on: function(){}
        };
        debugger;
        spyOn(child_process,"spawn").andReturn(child_process);
        var nndb = new Nndb(child_process);

        nndb.scrapeForJudges('../src/TDDQuestion.js');
        expect(child_process.spawn).toHaveBeenCalledWith( 'phantomjs',['../src/TDDQuestion.js',0]);

    });


});

