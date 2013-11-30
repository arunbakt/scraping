var spawn=require('child_process').spawn;
var StringDecoder = require('string_decoder').StringDecoder;
var async = require('async');

i=0;

var totalJudges = 0;
judges = [];
judges2 =[];
var decoder = new StringDecoder('utf8');
var judgesString = "";

var maxPhantomJsProcess = 20;
var runningPhantom =0;

while (i<564) {

    var child=spawn('phantomjs', ['openbrowser.js', i]);
    child.stdout.on('data',function(data){
        judgesString = judgesString + decoder.write(data);

    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

    i=i+20;

}

setTimeout(function(){
    console.log("About to print the judges")
    console.log("BEOFRE:====\n"+judgesString);

    judgesString = judgesString.substring(0,judgesString.length-1);
    judges = judgesString.split("\n");
    console.log("AFTER"+judges);
    totalJudges = judges.length;
    printJudges(judges);

}, 20000);


setTimeout(function() {
   getMoreInfo();
},40000);

printJudges(judges2);


function lineupWork(judge){
    if(runningPhantom <= maxPhantomJsProcess)
    {
     //   console.log("runnnigphantom "+runningPhantom+" compared to "+maxPhantomJsProcess);
        visitPage('retrive_judge_info.js', judge);
    }else
    {
       // console.log("Lineup work");
        setTimeout(function(){lineupWork(judge);
        }, 500)
    }
}

var getMoreInfo = function() {

    console.log("The size of the array is "+judges.length);
    var y = 0;
    while(y<totalJudges){
        console.log("RETRIEVE for "+judges[y]);
        lineupWork(judges[y]);
        y++;

    }

}

var visitPage = function(script, judge) {

    var child=spawn('phantomjs', [script, judge]);
    runningPhantom++;
    var judgesString = "";

    child.stdout.on('data',function(data){
        judgesString = judgesString + decoder.write(data);
    });

    child.stderr.on('data', function (data) {
       // console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        runningPhantom--;
        if(judgesString.split('\n')[2] == undefined)
            judges2.push(judgesString.split('\n'));
        else
            judges2.push(judgesString.split('\n')[2]);
    });


}

function printJudges(judgesArray) {

    console.log("Length of judgesArray "+judgesArray.length+" count "+totalJudges)

    if(judgesArray.length == totalJudges) {
        clearTimeout();
        console.log("Length of judgesArray "+judgesArray.length+" count "+totalJudges)
        var x = 0;
        while(x<judgesArray.length) {
            console.log(judgesArray[x]);
            x++;
        }
    }else if(judgesArray.length  < totalJudges)
    {
        setTimeout(function(){printJudges(judgesArray);},5000);
    }


}