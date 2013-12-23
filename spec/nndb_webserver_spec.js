/**
 * Created by arun.bakthavatchalam on 12/21/13.
 */

require('../src/nndb_webserver.js');
var http = require('http');

describe("Given an array of judges data", function(){

    var judgesData;
    var nndb;
    var nndbRunner;
    var nndbWebServer;

    beforeEach(function(){

        judgesData = [ { name: 'Judge Joe Brown',
            next_page: 'http://www.nndb.com/people/595/000110265/',
            birthplace: 'Washington, DC' },
            { name: 'James Robertson',
                next_page: 'http://www.nndb.com/people/302/000109972/',
                birthplace: 'Cleveland, OH',
                militaryService: 'true' },
            { name: 'Colleen Kollar-Kotelly',
                next_page: 'http://www.nndb.com/people/102/000112763/',
                birthplace: 'New York City' },
            { name: 'Eugene F. Pigott, Jr.',
                next_page: 'http://www.nndb.com/people/050/000167546/',
                birthplace: 'Rochester, NY',
                militaryService: 'true' },
            { name: 'Lewis A. Kaplan',
                next_page: 'http://www.nndb.com/people/210/000369100/',
                birthplace: 'Staten Island, NY' },
            { name: 'Carmen Beauchamp Ciparick',
                next_page: 'http://www.nndb.com/people/044/000167540/',
                birthplace: 'New York City' },
            { name: 'Dale R. Cathell',
                next_page: 'http://www.nndb.com/people/112/000167608/',
                birthplace: 'Berlin, MD',
                militaryService: 'true' },
            { name: 'Frank Lucchino',
                next_page: 'http://www.nndb.com/people/613/000170103/',
                birthplace: 'Pittsburgh, PA' },
            { name: 'Lynne A. Battaglia',
                next_page: 'http://www.nndb.com/people/109/000167605/',
                birthplace: 'Buffalo, NY' },
            { name: 'Joel West Flood',
                next_page: 'http://www.nndb.com/people/220/000167716/',
                birthplace: 'Appomattox, VA',
                militaryService: 'true' },
            { name: 'Judith S. Kaye',
                next_page: 'http://www.nndb.com/people/934/000167433/',
                birthplace: 'Monticello, NY' },
            { name: 'Joseph F. Murphy, Jr.',
                next_page: 'http://www.nndb.com/people/111/000167607/',
                birthplace: 'Fitchburg, MA' },
            { name: 'Anna Diggs Taylor',
                next_page: 'http://www.nndb.com/people/851/000118497/',
                birthplace: 'Washington, DC' },
            { name: 'Glenn T. Harrell, Jr.',
                next_page: 'http://www.nndb.com/people/108/000167604/',
                birthplace: 'Ashland, KY' },
            { name: 'Ellen Huvelle',
                next_page: 'http://www.nndb.com/people/335/000253573/',
                birthplace: 'Boston, MA' },
            { name: 'Susan P. Read',
                next_page: 'http://www.nndb.com/people/049/000167545/',
                birthplace: 'Gallipolis, OH' },
            { name: 'Clayton Greene, Jr.',
                next_page: 'http://www.nndb.com/people/110/000167606/',
                birthplace: 'Glen Burnie, MD' },
            { name: 'John M. Facciola',
                next_page: 'http://www.nndb.com/people/395/000163903/',
                birthplace: 'Not Available' },
            { name: 'Alex Kozinski',
                next_page: 'http://www.nndb.com/people/310/000167806/',
                birthplace: 'Bucharest, Romania' },
            { name: 'Alton B. Parker',
                next_page: 'http://www.nndb.com/people/272/000206651/',
                birthplace: 'Cortland, NY' },
            { name: 'Theodore T. Jones',
                next_page: 'http://www.nndb.com/people/048/000167544/',
                birthplace: 'Brooklyn, NY',
                militaryService: 'true' },
            { name: 'Gabrielle K. McDonald',
                next_page: 'http://www.nndb.com/people/021/000170508/',
                birthplace: 'St. Paul, MN' },
            { name: 'Irma S. Raker',
                next_page: 'http://www.nndb.com/people/107/000167603/',
                birthplace: 'Not Available' },
            { name: 'John D. Bates',
                next_page: 'http://www.nndb.com/people/096/000171580/',
                militaryService: 'true',
                birthplace: 'Not Available' },
            { name: 'John M. Roll',
                next_page: 'http://www.nndb.com/people/863/000265068/',
                birthplace: 'Pittsburgh, PA' },
            { name: 'Robert S. Smith',
                next_page: 'http://www.nndb.com/people/047/000167543/',
                birthplace: 'New York City' }];

        nndb = {judgesData: judgesData};
        nndbRunner = new NndbRunner(nndb);
        nndbWebServer = new NndbWebServer(nndbRunner);
        nndbWebServer.judgesData = judgesData;

    });

    it("an object with judges data grouped by state exists", function(){
        var judgesByState = {};
        nndbWebServer.groupByState(judgesByState);
        expect(judgesByState).toBeDefined();
        expect(judgesByState["NY"].length).toBeGreaterThan(1);
        expect(judgesByState["Not Available"].length).toBeGreaterThan(1);

    });





});