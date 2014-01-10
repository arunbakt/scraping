/**
 * Created by arun.bakthavatchalam on 12/8/13.
 */
var async = require('async');

Nndb = function(child_process) {

    this.judgesData = [];
    this.child_process = child_process;
    this.judgesDataString = "";
    this.MAX_OFFSET = -1;
    this.currOffset = 0;
    this.OFFSET_INCREMENT = 20;
    this.runningPhantomCount = 0;
    this.MAX_CONCURRENT_PHANTOM = 10;

};


var scrape = function(nndb, phantomScriptToRun, offset) {

    var child =  nndb.child_process.spawn('./node_modules/phantomjs/bin/phantomjs', [phantomScriptToRun, offset]);
    nndb.runningPhantomCount++;

    child.stdout.on('data',function(data){

        nndb.judgesDataString = nndb.judgesDataString  + data;
        if(nndb.judgesDataString.indexOf('NO_MORE_RESULTS') != -1) {
            nndb.MAX_OFFSET = nndb.currOffset;
        }

    });

    child.stderr.on('data', function (data) {
      //  console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        nndb.runningPhantomCount--;
    });


};

Nndb.prototype.scrapeForJudges = function( phantomScriptToRun, nextStep ) {

   var nndb = this;
   if(this.currOffset > this.MAX_OFFSET)
   {
       if( this.runningPhantomCount < this.MAX_CONCURRENT_PHANTOM ) {

           scrape(this, phantomScriptToRun, this.currOffset);
           this.currOffset = this.currOffset + this.OFFSET_INCREMENT;
       }

       setTimeout(function(){nndb.scrapeForJudges(phantomScriptToRun, nextStep)}, 500);

   } else{
       if(this.scrapingForJudgesComplete())
           nextStep(null, "Scraping to collect judges complete");
       else
        setTimeout(function(){nndb.scrapeForJudges(phantomScriptToRun, nextStep);}, 1000);
   }

}


Nndb.prototype.scrapingForJudgesComplete = function() {

    if(this.runningPhantomCount == 0 && this.MAX_OFFSET >= 0)
        return true;
    else
        return false;

};

Nndb.prototype.allChildProcessExited = function() {
    return this.runningPhantomCount == 0;
}

Nndb.prototype.parseResults = function(nextStep) {

    this.judgesDataString = this.judgesDataString.substring(0,this.judgesDataString.length-1);
    this.judgesData = this.judgesDataString.split("\n");
    removeNoMoreResultsToken(this.judgesData); //Remove the NO_MORE_RESULTS entry
    nextStep(null, "Parse Results after scraping for Judges complete");
}



function removeNoMoreResultsToken(judgesData){
    while(judgesData.indexOf("NO_MORE_RESULTS")!=-1)
        judgesData.splice(-1, 1);
}


Nndb.prototype.scrapeAdditionalInfo = function(phantomScriptToRun, nextStep) {

    var y = 0;
    var totalJudges = this.judgesData.length;

    while(y<totalJudges){

       throttleScraping(this,phantomScriptToRun, this.judgesData[y], y, nextStep);
       y++;

    }

}

function throttleScraping(nndb, phantomScriptToRun, judge, y, nextStep) {

    if(nndb.runningPhantomCount < nndb.MAX_CONCURRENT_PHANTOM)
        scrapeAdditionalInfoForJudge(nndb,phantomScriptToRun, judge, y, nextStep);
    else
        setTimeout(function() {
            throttleScraping(nndb,phantomScriptToRun,judge,y, nextStep)
        }, 500);

}


Nndb.prototype.scrapeAdditionalInfoComplete = false;

function scrapeAdditionalInfoForJudge(nndb, phantomScriptToRun, judge, index, nextStep) {

    //var judgesData = nndb.judgesData;
    var child = nndb.child_process.spawn('./node_modules/phantomjs/bin/phantomjs', [phantomScriptToRun, judge]);
    nndb.runningPhantomCount++;

    var judgesInfo = "";

    var scrapingAdditionInfoCompelete = function() {

        if(nndb.runningPhantomCount === 0) {
            var infoGathered = function(judge) {
                return judge.birthplace !== undefined;
            }
            if(nndb.judgesData.every(infoGathered)) {
                nextStep(null, "Scrape for Additional information on Judges complete");
            }
        }
    }


    child.stdout.on('data', function(data){
        judgesInfo = judgesInfo + data;
    });

    child.stderr.on('data', function (data) {

    });

    child.on('exit', function (code) {

        nndb.runningPhantomCount--;

        if(code === 1) {
            judge = JSON.parse(judge);
            judge['birthplace'] = "Birthplace lookup timed out";
            nndb.judgesData[index] = judge;
            scrapingAdditionInfoCompelete();

        } else {


            if(judgesInfo.split('\n')[2] == undefined)
                judge = judgesInfo.split('\n')[0] || {};
            else
                judge = judgesInfo.split('\n')[2] || {};

            try{
                judge = JSON.parse(judge); //convert string into json object
            }catch(err)
            {

            }

            if(judge.birthplace === undefined) {
                judge.birthplace = "Not Available";
            }

            nndb.judgesData[index] = judge;

            scrapingAdditionInfoCompelete();

        }

    });

}

exports.Nndb = Nndb;


