
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
        document.getElementById("spinner").src = "media/spinner.gif";
        requestAJAX("backend.py?terms=" + searchterms, displayResults, "index.php");
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

    var results = ajax.responseText.replace(/^\s+|\s+$/g, ''); // trims whitespace    
    var div = document.getElementById("results");
    var newHTML = "";
    var resultcount = 0;

    div.innerHTML = "";

    if (results.length > 0) {
        newHTML += '<table border="0" cellpadding="0" cellspacing="0"><tr>';
   
        var resultcount = 0;

        var lines = results.split('\n');        
        for (var i = 0; i < lines.length; i++) {
            var data = lines[i].split('\t');
            var record = [];
            
            FIELDORDER = ["last","first","middle","class","phone","email","address"];
            
            for (var j = 0; j < FIELDORDER.length; j++) {
                var field = FIELDORDER[j];
                record[field] = data[j];
            }

            // Add leading "x" to 4-digit phone numbers and hyphen to 7-digit numbers
            if (record["phone"]) {
                var phone = record["phone"];
                if (phone.length == 4) {
                    record["phone"] = "x" + phone;
                } else if (phone.length == 7) {
                    record["phone"] = phone.substr(0,3) + "-" + phone.substr(3);
                }
            }
            
            var col = resultcount % 4;
            if (col == 0) {
                newHTML += "</tr><tr>";
            }

            newHTML += "<td>";
            newHTML += '<img src="photos/' + record["class"] + '/' + record["email"] +
                       '.jpg" alt="' + record["first"] + " " + record["last"] + '"/><br/>';
            newHTML += record["first"] + " " + record["middle"] + " " + record["last"] + "<br/>";
            newHTML += '<span style="font-size:smaller">';
            newHTML += record["address"] + " (" + record["phone"] + ")<br/>";
            newHTML += record["class"] + " / " + record["email"] + "<br/>";
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
        newHTML = "Search for \"" + lastsearch + "\" returned " + resultcount + " result" + (resultcount == 1 ? '' : 's') +  ".<br/><br/>" + newHTML;
    } else {
	newHTML = "Search for \"" + lastsearch + "\" returned no matches."
    }

    div.innerHTML = newHTML;

    document.getElementById("spinner").src = "media/spinner-stopped.gif";
    
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

