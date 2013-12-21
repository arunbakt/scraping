/**
 * Created by arun.bakthavatchalam on 12/15/13.
 */
var async = require('async');
var nndb = require('./nndb.js');
var child_process = require('child_process');
var nndb = new Nndb(child_process);

async.series([

    function(nextStep){
        console.log("scrape for judges called");
        nndb.scrapeForJudges('./src/scrape_nndb_judges.js', nextStep);

     },
    function(nextStep) {
        console.log("parse results called");
        nndb.parseResults(nextStep);
    },
    function(nextStep){
        console.log("Collect additional information");
        nndb.scrapeAdditionalInfo('./src/retrieve_judge_info.js',nextStep);
    },
    function(nextStep){
        console.log("Printing the final results");
        nextStep(null,nndb.judgesData);
    }
 ], function(err, judgesData){
    console.log(judgesData);
});
