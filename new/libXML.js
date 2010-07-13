var xmlReq;

/*
 * importXML - handle the messiness of creating the XMLHttpRequest
 * across different browser types, and insulate the user from nasty
 * errors.
 *
 * @param[in] webservice the URL of the XML document to fetch (can include query-string)
 * @param[in] callback   the function co call once the XML fetch is completed
 * @param[in] noXMLloc   a page to redirect to if the browser doesn't support XMLHttpRequests
 */ 
function importXML(webservice, callback, noXMLloc) {

    var workers = [
        "MSXML2.XMLHTTP.5.0", 
        "MSXML2.XMLHTTP.4.0", 
        "MSXML2.XMLHTTP.3.0", 
        "Microsoft.XMLHTTP"
        ]; 
    
    var xmlReq = null;

    try {
        xmlReq = new XMLHttpRequest();
    } catch (error) {
        for (var i=0; i<workers.length; i++) {
            try {
                xmlReq = new ActiveXObject(workers[i]);
                
                break; // exit the loop
            } catch (ignored) { }
        }
    }

    if (xmlReq == null || xmlReq == undefined) {
        window.location = noXMLloc;
    }
            
    xmlReq.open("get", webservice, true);
    xmlReq.onreadystatechange = function() {
	if (xmlReq.readyState == 4) {
	    if (xmlReq.status != 200) {
		alert("HTTP Status: " + xmlReq.status + " = " + xmlReq.statusText);
	    }
	    callback(xmlReq);

	}
    };
    xmlReq.send(null);
}
