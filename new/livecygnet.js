var timer = null;

var searchedFor = "";

function doImport() {
    timer = null;
    
    var search = document.getElementById("terms").value;
    
    updateBookmarkLink();
    
    
    // don't do empty searches, but instead clear the results area
    if (search == "") {
        document.getElementById("results").innerHTML = "";    
    
        return;
    }
                    
    document.getElementById("spinner").src = "spinner.gif";
    importXML("cygnetxml.py?terms=" + search, displayResults, "index.php");
}


function updateBookmarkLink() {
    var url = 'http://cygnet.sccs.swarthmore.edu/index.php';
    if (lastsearch != "") {
        url += "?terms=" + lastsearch;
    }
    document.getElementById("bookmarkurl").href = url;
}

function displayResults(xmlDoc) {

    if (xmlDoc.responseXML == null) {
	alert("Error: xmlDoc.responseXML is null");
	alert("response text: " + xmlDoc.responseText);
	throw("Error: xmlDoc.responseXML is null");
	die();
    }

    var div = document.getElementById("results");
    var newHTML = "";
    var docElement = xmlDoc.responseXML.documentElement;
    var textNodeType = 3;
    var results = 0;

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
            
            var col = results % 4;
            if (col == 0) {
                if (results > 0) {
                    newHTML += "</tr>";
                }
                newHTML += "<tr>";
            }

            newHTML += "<td>";
            newHTML += '<img src="photos/' + nodeDict["class"] + '/' + nodeDict["email"] +
                       '.jpg" alt="' + nodeDict["first"] + " " + nodeDict["last"] + '"/><br/>';
            newHTML += nodeDict["first"] + " " + nodeDict["middle"] + " " + nodeDict["last"] + "<br/>";
            newHTML += '<span style="font-size:smaller">';
            newHTML += nodeDict["address"] + " (" + nodeDict["phone"] + ")<br/>";
            newHTML += nodeDict["class"] + " / " + nodeDict["email"] + "<br/>";
            newHTML += "</span></td>";
            
            results ++;
        }

        var col = (results % 4);
        if (col != 0 && results > 4) {
            for (var i=0; i<(4 - col); i++) {
                newHTML += "<td>&nbsp;</td>";
            }
        }

        newHTML += "</table>";
    }
    
    div.innerHTML = "Search for \"" + lastsearch + "\" returned " + results + " results.<br/><br/>" + newHTML;

    // now clear the message
    document.getElementById("spinner").src = "spinner-stopped.gif";
}

var lastsearch = "";

function waitSomeTime(delay) {
    var thissearch = document.getElementById("terms").value;

    if (thissearch == lastsearch)
        return;
    
    lastsearch = thissearch;
    
    if (timer != null) {
        clearTimeout(timer);
    }
    timer = setTimeout(doImport, delay);
}
