/**
 * Created by arun.bakthavatchalam on 11/30/13.
 */
var webpage = require('webpage')
var system = require('system');
var page = webpage.create();
var offset = "";

try
{
    offset = JSON.parse(system.args[1]);
}
catch(err)
{
    console.log("PARSE ERROR "+err);
    console.log("JSON STRING "+system.args[1]);
    phantom.exit();
}

page.onConsoleMessage = function(msg) {

    console.log(msg);
}


try {


    page.open('http://search.nndb.com/search/nndb.cgi?n=judge&omenu=unspecified&offset='+offset,function(status) {



        if(status === "success") {

            page.evaluate(function(){


                var element = document.getElementsByTagName('table')[3];
                var elements = element.getElementsByTagName('tr');
                for(var i=0; i<elements.length; i++)
                {
                   // console.log(elements[i].getElementsByTagName("td")[1].textContent);

                    var judge = {};
                    var personNameElement = elements[i].getElementsByTagName("td")[0];
                    var hrefElement = personNameElement.getElementsByTagName("a")[0];
                    var occupationElement = elements[i].getElementsByTagName("td")[1];
                    if(occupationElement.textContent == 'Judge')
                    {
                          judge.name = personNameElement.textContent;
                          judge.href = hrefElement.href;
                          console.log(JSON.stringify(judge));
                    }
                }


            });
            page.release();


        }
        phantom.exit();

    });

}
catch(e){

}

