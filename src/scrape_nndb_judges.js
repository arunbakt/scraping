/**
 * Created by arun.bakthavatchalam on 11/30/13.
 */
var webpage = require('webpage')
var system = require('system');
var page = webpage.create();
var offset;

try
{
    offset = system.args[1];
    if(offset == undefined || isNaN(offset))
     throw new Error("Invalid offset value");
}
catch(err)
{
    console.error("invalid arguement passed for offset value "+err);
    phantom.exit();
}

page.onConsoleMessage = function(msg) {

    console.log(msg);
}


page.open('http://search.nndb.com/search/nndb.cgi?n=judge&omenu=unspecified&offset='+offset,function(status) {

    if(status === "success") {

        page.evaluate(function(){

            if(document.getElementsByTagName('body')[0].textContent.indexOf('No more results')!=-1) {
                console.log("NO_MORE_RESULTS");
                return;

            }

            var element = document.getElementsByTagName('table')[3]; //Retrieve table containing the persons data
            var elements = element.getElementsByTagName('tr');
            for(var i=0; i<elements.length; i++)
            {
                var judge = {};
                var personNameElement = elements[i].getElementsByTagName("td")[0];
                var hrefElement = personNameElement.getElementsByTagName("a")[0];
                var occupationElement = elements[i].getElementsByTagName("td")[1];
                if(occupationElement.textContent == 'Judge')
                {
                      judge.name = personNameElement.textContent.trim();
                      judge.next_page = hrefElement.href;
                      console.log(JSON.stringify(judge));
                }
            }


        });


    }
    phantom.exit(0);

});






