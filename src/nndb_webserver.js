/**
 * Created by arun.bakthavatchalam on 12/20/13.
 */
require('./nndb_runner.js');
var http = require('http');

NndbWebServer = function(nndbRunner) {

    this.nndbRunner = nndbRunner;
};


NndbWebServer.prototype.initServer = function() {

    var nndbServer = this;
    console.log("Init server called");

    this.nndbRunner.scrapeNndb();

    var server = http.createServer(function(req, res){
        if ('/' == req.url) {
            switch (req.method) {
                case 'GET':
                    nndbServer.show(res);
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

NndbWebServer.prototype.show = function(res) {

    var judgesData = this.nndbRunner.nndb.judgesData;

    var keys = [];
    var judgesByState = {};

    this.groupByState(judgesByState);

     var content = '<table><tr><td>';

    for(var key in judgesByState){
        if(judgesByState.hasOwnProperty(key))
            keys.push(key);
    }

    keys.sort();
    keys.forEach(function(key) {

        if (judgesByState.hasOwnProperty(key)) {
            content = content + '<table><tr><td><b>' + key+ '</b></td></tr>';
            var judges = judgesByState[key];

            judges.sort(function(a,b){
                return (a.militaryService === b.militaryService)? 0: a.militaryService? -1: 1;
            });
			
            judges.forEach(function(judge){
                var mS = (judge.militaryService === undefined) ? '' : 'Military Service';
                content = content + '<tr><td>'+ judge.name +'</td><td>'+ mS +'</td></tr>'
            });
            content =  content + '</table>';
        }

    });



    var content = content + '</td></tr></table>';
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

NndbWebServer.prototype.groupByState = function(judgesByState) {

    var judgesData = this.nndbRunner.nndb.judgesData;
    judgesData.forEach(function(judge){
        if(judge.birthplace === undefined) {
            console.log("undefined birthplace "+judge);
            insertJudgeForState(judgesByState, "Birthplace Not Available",judge);
        } else if(judge.birthplace.split(',')[1] === undefined){
            insertJudgeForState(judgesByState, judge.birthplace.split(',')[0], judge);
        } else {
            insertJudgeForState(judgesByState, judge.birthplace.split(',')[1].trim(), judge);
        }
    });

}

function insertJudgeForState(judgesByState, state, judge) {

    if(judgesByState[state] === undefined)
        judgesByState[state] = [];

    judgesByState[state].push(judge);

}

