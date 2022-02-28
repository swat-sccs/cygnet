// configure Plausible.js 
window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

window.sentAnalytics = false;

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

window.onload = function() {
    // Center the searchbar vertically
    var $window = $(window).on('resize', function(){
	var height =( ($(this).height()/2) - 
		      $('#banner').height() -  
		      $('#searchbar').height() );
	$('#top_spacer').height(height);
    }).trigger('resize'); //on page load

    // Do the search
    document.getElementById('terms').focus();
    doSearch();

    // Surpress the Enter key to make the 
    // fancy effects work
    $('#searchbar').keypress(function(event){
	if (event.keyCode == 10 || event.keyCode == 13) 
            event.preventDefault();
    });
    
}

var timer = null;

var starttime = 0;

var lastsearch = "";

function doSearch() {
    if (timer != null) {
        clearTimeout(timer);
    }
    starttime = (new Date()).getTime();
    
    var searchterms = document.getElementById("terms").value;
    lastsearch = searchterms;
    searchterms = encodeURIComponent(searchterms)
    
    
    
    updateBookmarkLink();
    
    // Ignore empty searches, instead clear the results area
    if (searchterms == "") {
        document.getElementById("results").innerHTML = "";
        sameSearch(searchterms); // to register empty search    
    // Do search if different from search just performed
    } else if (!sameSearch(searchterms)) {
        document.getElementById("spinner").style.display = "block";
        
	// Slide the searchbar up
	if ( $('#top_spacer').height() > 20 ) {
	    $('#top_spacer').animate({height:'20px'}, 500);      
	}
	
	if (!window.sentAnalytics && plausible) {
		plausible('Search', { callback: function () { window.sentAnalytics = true; } }); // send analytics event
	}

	requestAJAX("/backend/?terms=" + searchterms, displayResults, "home");
    }
}


function updateBookmarkLink() {
    var url = 'home';
    if (lastsearch != "") {
        url += "?terms=" + encodeURIComponent(lastsearch);
    }
    document.getElementById("bookmarkurl").href = url;
}

function displayResults(ajax) {
    var div = document.getElementById("results");
    var results = JSON.parse(ajax.responseText)
    var newHTML = "";
    var topdiv = document.getElementById("top_spacer");

    

    var VALID_STATUS = 200;
    if (ajax.status != VALID_STATUS || 'error' in results) {
	var error_msg = "";
	var error_diagnostics = "";
	if (ajax.status != VALID_STATUS) {
	    error_msg = "HTTP Status " + ajax.status + ": " + ajax.statusText;
	} else {
	    error_msg = results['error']['value'];
	    error_diagnostics = results['error']['traceback'];
	}
	newHTML =
	    "<em>Sorry! Results could not be retrieved (" + error_msg + ")." +
	    "<br/ >" +
	    "Please email staff@sccs.swarthmore.edu to let us know, " +
	    "and include the above message.</em>" +
	    "<!--\n" + error_diagnostics + "\n-->";
    }
    else if ('data' in results && results['data'].length > 0) {
        newHTML += '<table border="0" cellpadding="0" cellspacing="0"><tr>';
   
        var resultcount = 0;
	var data = results['data'];
	for (var i = 0; i < data.length; i++) {
	    var record = data[i];

            var col = resultcount % 4;
            if (col == 0) {
                newHTML += "</tr><tr>";
            }

            newHTML += "<td>";
            newHTML += '<img src="' + record["photo"] +
                       '" alt="' + record["first"] + " " + record["last"] + '"/><br/>';
            newHTML += record["first"] + " " + record["middle"] + " " + record["last"] + "<br/>";
            newHTML += '<span style="font-size:smaller">';
            newHTML += record["address"] + "<br/>";
            newHTML += record["year"] + " / " + record["email"] + "<br/>";
            newHTML += "</span></td>";
            
            resultcount++;
        }
        
        // Fill out the rest of the bottom of the table
        var col = (resultcount % 4);
        if (col != 0 && resultcount > 4) {
            for (var i=0; i<(4 - col); i++) {
                newHTML += "<td>&nbsp;</td>";
            }
        }

        newHTML += "</tr></table>";
        newHTML = "Search for \"" + lastsearch + "\" returned " + resultcount + " result" + (resultcount == 1 ? '' : 's') +  ".<br/><br/>" + newHTML + "<br /><br />";
    } else {
	newHTML = "Search for \"" + lastsearch + "\" returned no matches."
    }

    div.innerHTML = newHTML;

    document.getElementById("spinner").style.display = "none";
    
    var endtime = (new Date()).getTime();
    var timediff = endtime - starttime;
    document.getElementById("timevalue").innerHTML = timediff + " ms";
}

function callSearch() {
    if (timer != null) {
        clearTimeout(timer);
    }
    var DELAY = 500;  // In milliseconds.
    timer = setTimeout(doSearch, DELAY);
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


function toggleAdvanced() {
    var advanced_div = document.getElementById("advanced");
    var advanced_toggle = document.getElementById("toggle-advanced");
    if (advanced_div.style.display == "none") {
	advanced_div.style.display = "block";
	advanced_toggle.innerHTML = "click to hide";
	advanced_toggle.title = "Hide advanced search options";
    } else {
	advanced_div.style.display = "none";
	advanced_toggle.innerHTML = "click to show";
	advanced_toggle.title = "Show advanced search options";
    }
}
