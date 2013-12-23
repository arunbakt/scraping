/**
 * Created by arun.bakthavatchalam on 12/15/13.
 */
var async = require('async');
require('./nndb.js');
var child_process = require('child_process');

NndbRunner =  function(nndb) {

    this.nndb = nndb;

}

NndbRunner.prototype.scrapeNndb = function (){

    var nndb = this.nndb;

    async.series([

        function(nextStep){
            console.log("scrape for judges");
            nndb.scrapeForJudges('./src/scrape_nndb_judges.js', nextStep);

        },
        function(nextStep) {
            console.log("parse results");
            nndb.parseResults(nextStep);
        },
        function(nextStep){
            console.log("Collect additional information");
            nndb.scrapeAdditionalInfo('./src/retrieve_judge_info.js',nextStep);
        },
        function(nextStep){
            console.log("Printing the final results");
            child_process.spawn('open',[('http://localhost:3000/')]);
        },

    ], function(err, judgesData){
    });


}

