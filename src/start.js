/**
 * Created by arun.bakthavatchalam on 12/21/13.
 */
require('./nndb_webserver.js');
require('./nndb.js');
require('./nndb_runner.js');

var child_process = require('child_process');
nndb = new Nndb(child_process);
var nndbRuner = new NndbRunner(nndb);
var nndbWebServer = new NndbWebServer(nndbRuner);
nndbWebServer.initServer();