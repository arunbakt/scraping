var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

Nndb = function(child_process) {
    this.child_process = child_process;
};

Nndb.prototype.invokePhantomProcess = function( phantomScriptToRun, offSet) {

    var child =  this.child_process.spawn('phantomjs', [phantomScriptToRun, offSet]);
    debugger;


    child.stdout.on('data',function(data){

        console.log(decoder.write(data));

    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

    return 0;

};

exports.Nndb = Nndb;