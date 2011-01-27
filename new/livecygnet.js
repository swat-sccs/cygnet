
/*
 * importXML - handle the messiness of creating the XMLHttpRequest
 * across different browser types, and insulate the user from nasty
 * errors.
 *
 * @param[in] webservice the URL of the XML document to fetch (can include query-string)
 * @param[in] callback   the function co call once the XML fetch is completed
 * @param[in] noXMLloc   a page to redirect to if the browser doesn't support XMLHttpRequests
 */ 
function requestAJAX(webservice, callback, noXMLloc) {

    var workers = [
        "MSXML2.XMLHTTP.5.0", 
        "MSXML2.XMLHTTP.4.0", 
        "MSXML2.XMLHTTP.3.0", 
        "Microsoft.XMLHTTP"
        ];
    
    var ajax = null;

    try {
        ajax = new XMLHttpRequest();
    } catch (error) {
        for (worker in workers) {
            try {
                ajax = new ActiveXObject(worker);
                break;
            } catch (ignored) { }
        }
    }

    if (ajax == null || ajax == undefined) {
        window.location = noXMLloc;
    }
            
    ajax.open("get", webservice, true);
    ajax.onreadystatechange = function() {
    	if (ajax.readyState == 4) {
    	    callback(ajax);
    	}
    };
    ajax.send(null);
}


// =======================================

var timer = null;

var starttime = 0;

var lastsearch = "";

function doSearch() {
    clearTimeout(timer);
    starttime = (new Date()).getTime();
    
    var searchterms = document.getElementById("terms").value;
    lastsearch = searchterms;
    
    updateBookmarkLink();
    
    // Ignore empty searches, instead clear the results area
    if (searchterms == "") {
        document.getElementById("results").innerHTML = "";
        sameSearch(searchterms); // to register empty search
            
    // Do search if different from search just performed
    } else if (!sameSearch(searchterms)) {
        document.getElementById("spinner").src = "spinner.gif";
        requestAJAX("cygnetxml.py?terms=" + searchterms, displayResults, "index.php");
    }
}

function updateBookmarkLink() {
    var url = 'index.php';
    if (lastsearch != "") {
        url += "?terms=" + lastsearch;
    }
    document.getElementById("bookmarkurl").href = url;
}

function displayResults(ajax) {
    if (ajax.status != 200) {
		document.write("<!-- HTTP Status: " + ajax.status + " = " + ajax.statusText + "-->");
		die();
    }

    if (ajax.responseXML == null) {
		alert("Error: xmlDoc.responseXML is null");
		alert("response text: " + xmlDoc.responseText);
		throw("Error: xmlDoc.responseXML is null");
		die();
    }

    var div = document.getElementById("results");
    var newHTML = "";
    var docElement = ajax.responseXML.documentElement;
    var textNodeType = 3;
    var resultcount = 0;

    div.innerHTML = "";
    
    
    if (!docElement.hasChildNodes()) {
        newHTML += "Search for \"" + lastsearch + "\" found no matches";
    } else {
        var node = docElement.firstChild;
        
        var people = docElement.childNodes;

        
        
        newHTML += '<table border="0" cellpadding="0" cellspacing="0">';
        
        for (var i=0; i<people.length; i++) {
            var person = people[i];

            if (person.nodeType == textNodeType) {
                continue;
            }
            
            var nodeDict = {};
            nodeDict["first"] = "";
            nodeDict["middle"] = "";
            nodeDict["last"] = "";
            nodeDict["address"] = "";
            nodeDict["phone"] = "";
            nodeDict["email"] = "";
            nodeDict["class"] = "";
            
            var fields = person.childNodes;
            
            for (var j=0; j< fields.length; j++) {
                var field = fields[j];

                if (field.nodeType == textNodeType) {
                    continue;
                }

                nodeDict[field.nodeName] = field.firstChild.nodeValue;
            }

            // add leading "x " to 4-digit phone numbers
            if (nodeDict["phone"] && nodeDict["phone"].length == 4) {
                nodeDict["phone"] = "x " + nodeDict["phone"];
            }
            
            var col = resultcount % 4;
            if (col == 0) {
                newHTML += "</tr><tr>";
            }

            newHTML += "<td>";
            newHTML += '<img src="photos/' + nodeDict["class"] + '/' + nodeDict["email"] +
                       '.jpg" alt="' + nodeDict["first"] + " " + nodeDict["last"] + '"/><br/>';
            newHTML += nodeDict["first"] + " " + nodeDict["middle"] + " " + nodeDict["last"] + "<br/>";
            newHTML += '<span style="font-size:smaller">';
            newHTML += nodeDict["address"] + " (" + nodeDict["phone"] + ")<br/>";
            newHTML += nodeDict["class"] + " / " + nodeDict["email"] + "<br/>";
            newHTML += "</span></td>";
            
            resultcount ++;   
        }
        
        // Fill out the rest of the bottom of the table
        var col = (resultcount % 4);
        if (col != 0 && resultcount > 4) {
            for (var i=0; i<(4 - col); i++) {
                newHTML += "<td>&nbsp;</td>";
            }
        }

        newHTML += "</tr></table>";
        
        div.innerHTML = "Search for \"" + lastsearch + "\" returned " + resultcount + " results.<br/><br/>" + newHTML;
        
    } else {
        div.innerHTML = "Search for \"" + lastsearch + "\" found no matches";

    }

    // now clear the message
    document.getElementById("spinner").src = "spinner-stopped.gif";
    
    var endtime = (new Date()).getTime();
    var timediff = endtime - starttime;
    document.getElementById("timevalue").innerHTML = timediff + " ms";
}

var TYPEDELAY = 300; // In milliseconds.

function callSearch(noDelay) {
    if (timer != null) {
        clearTimeout(timer);
    }
    var delay = noDelay ? 0 : TYPEDELAY;
    timer = setTimeout(doSearch, delay);
}

var sameSearch = (function() {
    var lastsearch = '';
    return function(newsearch) {
        //alert("newsearch: " + newsearch + "  lastsearch: " + lastsearch); 
        var isSame = (newsearch == lastsearch);
        lastsearch = newsearch;
        return isSame;
    }
})();

