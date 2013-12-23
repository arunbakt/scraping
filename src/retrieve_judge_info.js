var webpage = require('webpage')
var system = require('system');
var page = webpage.create();

var judge;
try
{
   judge = JSON.parse(system.args[1]);
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

    page.settings.resourceTimeout = 1000; // 5 seconds


    page.open(judge.next_page,function(status) {
        if(status === "success") {

            page.evaluate(function(judge){
                var element = document.getElementsByTagName('table')[4];
                var elements = element.getElementsByTagName('b');
                for(var i=0; i<elements.length; i++)
                {
                    if(elements[i].textContent == 'Birthplace:')
                    {
                        judge.birthplace = elements[i].nextElementSibling.textContent;
                        if(judge.birthplace === "" || judge.birthplace === null)
                            judge.birthplace = elements[i].nextSibling.textContent;

                    }

                    if(elements[i].textContent == 'Military service:')
                    {
                        judge.militaryService = 'true';
                        break;
                    }
                }
                console.log(JSON.stringify(judge));


            }, judge);
            page.release();


        }
        phantom.exit();

    });

}
catch(e){
    console.log("Error"+e);
}

