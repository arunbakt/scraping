/**
 * Created by arun.bakthavatchalam on 12/8/13.
 */
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var judgesDataString = "";
var MAX_OFFSET = -1;
var currOffset = 0;
var OFFSET_INCREMENT = 20;
var runningPhantomCount = 0;
var MAX_CONCURRENT_PHANTOM = 10;

Nndb = function(child_process) {
    this.child_process = child_process;
};


Nndb.prototype.scrapeForJudges = function( phantomScriptToRun ) {

   if(currOffset > MAX_OFFSET)
   {
       if( runningPhantomCount < MAX_CONCURRENT_PHANTOM ) {

           scrapeForJudges(phantomScriptToRun, currOffset);
           currOffset = currOffset + OFFSET_INCREMENT;

       }else {

           setTimeout(this.scrapeForJudges(phantomScriptToRun), 500);

       }

   }


}

Nndb.prototype.scrapeForJudges = function(phantomScriptToRun, offset) {

    var child =  this.child_process.spawn('phantomjs', [phantomScriptToRun, offset]);
    runningPhantomCount++;

    child.stdout.on('data',function(data){

        judgesDataString = judgesDataString  + data;
        console.log(judgesDataString);
        if(judgesDataString.indexOf('NO_MORE_RESULTS') != -1)
            MAX_OFFSET = currOffset;

    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        runningPhantomCount--;
    });


};

Nndb.prototype.scrapingComplete = function() {

    if(runningPhantomCount == 0 && MAX_OFFSET >= 0)
        return true;
    else
        return false;

};

Nndb.prototype.parseResults = function() {

   /* judgesString = judgesString.substring(0,judgesString.length-1);
    judges = judgesString.split("\n");
    console.log("AFTER"+judges);
    totalJudges = judges.length;
    printJudges(judges); */
}

Nndb.prototype.judgesData = [];

exports.Nndb = Nndb;