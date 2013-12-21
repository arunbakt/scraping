var http = require('http');
var spawn=require('child_process').spawn;
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var off_set=0;
var totalJudges = 0;

var judges = [];
var judges2 =[];
var judgesByState = {};

var judgesString = "";

var maxPhantomJsProcess = 20;
var runningPhantom =0;
var max_offset = -1;

initiateScrapeForJudges();

function initServer() {
    var server = http.createServer(function(req, res){
        if ('/' == req.url) {
            switch (req.method) {
                case 'GET':
                    show(res);
                    break;

                default:
                    badRequest(res);
            }
        } else {
            notFound(res);
        }
    });

    server.listen(3000);
}

function show(res) {

    groupByState(judges2);
    var content = '<table><tr><td><b>State</b></td><td><b>Military Service</b></td></tr><tr><td>';

    var keys = [];
    for(var key in judgesByState){
        keys.push(key);
    }
    keys.sort();
    keys.forEach(function(key){

        if (judgesByState.hasOwnProperty(key)) {
            console.log(key + " -> " + judgesByState[key]);
            content = content + '<table><tr><td><b>' + key+ '</b></td></tr>';
            var judges = judgesByState[key];

            judges.sort(function(a,b){
                return (a.militaryService > b.militaryService)?1:((b.militaryService> a.militaryService)?-1:0);
            });

            judges.forEach(function(judge){
                var mS = (judge.militaryService==undefined)?'No':'Yes';
                content = content + '<tr><td>'+ judge.name +'</td><td>'+ mS +'</td></tr>'
            });
            content =  content + '</table>';
        }

    });



    content = content + '</td></tr></table>'
    var html = '<html><head><title>Judges from NNDB.com</title></head>' +
        '<body>Judges from NNDB.com' +
        '' +content+''+
        '</body></html>';

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

function initiateScrapeForJudges() {

    if (off_set > max_offset) {
        console.log("OFFSET "+off_set+" max_offset "+max_offset);
        if(runningPhantom <= maxPhantomJsProcess)
        {
            scrapeForJudges(off_set);
            off_set = off_set + 20;
        }
        setTimeout(initiateScrapeForJudges,500);
    }else {
        parseResults();
        getMoreInfo();
        printJudges(judges2);
        initServer();


    }


}

function scrapeForJudges(offSet) {

    console.log("SPAWN");
    var child=spawn('phantomjs', ['scrape_nndb_judges.js', off_set]);
    runningPhantom++;

    child.stdout.on('data',function(data){

        judgesString = judgesString + decoder.write(data);
        if(judgesString.indexOf("NO_MORE_RESULTS") !== -1)
        {
            console.log("MATCH "+decoder.write(data));
            max_offset = off_set;
        }
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        runningPhantom--;
    });


}

function parseResults() {
    console.log("About to print the judges")
    console.log("BEOFRE:====\n"+judgesString);

    judgesString = judgesString.substring(0,judgesString.length-1);
    judges = judgesString.split("\n");
    console.log("AFTER"+judges);
    totalJudges = judges.length;
    printJudges(judges);

}

function lineupWork(judge){
    if(runningPhantom <= maxPhantomJsProcess)
    {
     //   console.log("runnnigphantom "+runningPhantom+" compared to "+maxPhantomJsProcess);
        visitPage('retrieve_judge_info.js', judge);
    }else
    {
       // console.log("Lineup work");
        setTimeout(function(){lineupWork(judge);
        }, 500)
    }
}

function getMoreInfo() {

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
    //    console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        runningPhantom--;
       try {
           if(judgesString.split('\n')[2] == undefined)
           {    judges2.push(JSON.parse(judgesString.split('\n')[0] || {}));
           }
           else
               judges2.push(JSON.parse(judgesString.split('\n')[2] || {}));

       }catch(err) {

       }
    });


}

function printJudges(judgesArray) {


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

function groupByState(judges2) {

    judges2.forEach(function(judge){
        console.log("GROUP BY STATE "+judge+' judge.name '+judge.name+' '+judge['name']);
        if(judge.birthplace == undefined)
            insertJudgeForState("Birthplace Not Available",judge)
        else if(judge.birthplace.split(',')[1] == undefined)
            insertJudgeForState(judge.birthplace.split(',')[0], judge);
        else
            insertJudgeForState(judge.birthplace.split(',')[1].trim(), judge);
    });




}

function insertJudgeForState(state, judge) {

    if(judgesByState[state] == undefined)
        judgesByState[state] = [];

    judgesByState[state].push(judge);
}