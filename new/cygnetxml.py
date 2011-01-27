#!/usr/bin/env python

### ========================
###      cygnetxml.py
### ========================
###
### This is the main python code that parses the housing directory file
### into a Python data structure.  The data can then be filtered based on the
### search terms entered by the user, and the results are returned via
### AJAX as an XML document.
###

# Import configuration information, variables defined include:
# - DIRECTORY_FILE 		String pointing to file to parse for directory information
# - FIELD_ORDER 		List of names of fields, in the order they are in the file
# - CLASS_YEARS 		List of class years to include
# - DELIMITING_CHAR             Character used to delimit fields in DIRECTORY_FILE
# - LOG_FILENAME                Path to error log file
from config import *

import cgi
import types
import xml.dom
import re
import logging
import time

class Record:
    """
    Record handles reading and parsing a line from the directory
    file into a more handy format for searching. It also provides
    a boolean filter() function, which tells whether the given
    requirements are matched by the Record.
    """

    def __init__(self, line):
        """
        Parse the delimited line from the file
        """
        self.orig = line
        split_fields = line.split(DELIMITING_CHAR)
        self.fields = {}
        
        for i in range(min(len(FIELD_ORDER), len(split_fields))):
            self.fields[FIELD_ORDER[i]] = split_fields[i].strip()

        for f in FIELD_ORDER:
            if f not in self.fields:
                self.fields[f] = ''

    def filter(self, search_field, search_val):
        """
        Returns true if the search value appears in the corresponding
        search field, or if the search value appears in ANY field if
        the search field is 'bare'.
        """
        
        if search_field == None:
#            if search_val.lower() in self.fields.itervalues.lower():
#                return True
            
            for field in FIELD_ORDER:
                if search_val.lower() in self.fields[field].lower():
                    return True

        else:
            if search_val.lower() in self.fields[search_field].lower():
                return True

        return False


    def toXMLNode(self, xml_document):
        """
        returns an XML-node representing this person. xml_document
        must be a valid DOMImplementation, like that returned by
        xml.dom.minidom.getDOMImplementation(...)
        """
        
        node = xml_document.createElement("person")
        
        for field in FIELD_ORDER:
            if len(self.fields[field].strip()) == 0:
                continue
                
            text = xml_document.createTextNode(self.fields[field])
            wrapper = xml_document.createElement(field)
            wrapper.appendChild(text)
            node.appendChild(wrapper)
        
        return node

def dict_add(dict, key, value):
    if dict.has_key(key):
        dict[key].append(value)
    else:
#        dict[key] = [value]
        dict[key] = value

def terms_to_dict(terms):
    """
    the online cygnet accepts input in the form 'field:value' to allow for specific searches
    this method takes a string of terms
    this method returns a dictionary of the form {field: value}
    if there are no specific fields, a dictionary is returned only one key, None
    """
    bare_re = re.compile(r'(\w*:\w*)|(\w*:"[\w ]*")|(\w+)')

    matches = bare_re.findall(terms)
    
    d = {}
    for match in matches:
        if not match[0] == '':
            toks = match[0].split(':')
            if toks[0] in FIELD_ORDER:
                dict_add(d, toks[0], toks[1])
        elif not match[1] == '':
            toks = match[1].split(':')
            if toks[0] in FIELD_ORDER:
                dict_add(d, toks[0], toks[1].strip('"'))
        elif not match[2] == '':
            for s in match[2].split():
                dict_add(d, None, s)
                
    logging.info("Search terms are: " + repr(d))
    
    if d == {}:
        return None
    else:
        return d

def get_matches(terms):
    """
    returns a list of matches (list of Record objects)
    that match the query represented by the search terms
    """

    xml_impl = xml.dom.getDOMImplementation()
    xml_document = xml_impl.createDocument(None, "records", None)
    document_elm = xml_document.documentElement

    document_elm.setAttribute("xmlns", "http://www.sccs.swarthmore.edu/cygnet")
    document_elm.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema-instance")
    document_elm.setAttribute("xsd:schemaLocation", "http://www.sccs.swarthmore.edu/cygnet cygnet.xsd")

    results = []

    if terms is not None:

        recordtime()

        #
        ###### INSERT TRY/CATCH STATEMENT HERE 
        #
        try:
            dirfile = open(DIRECTORY_FILE, 'r') 
        except IOError:
            logging.error("Cygnet file not found!")
            exit
        
        for line in dirfile:
            line = line.strip()
            if len(line) == 0:
                continue
            r = Record(line)

            # included is true only as long as all terms filter to true
            included = True
            for term, value in terms.iteritems():
                    if not r.filter(term, value):
                        included = False
                        break
            if included:
#                results.append(r.orig)
                results.append(r)

        for result in results:
            document_elm.appendChild(result.toXMLNode(xml_document))

        dirfile.close()
        logging.info("Found %i results." % len(results))

    return xml_document

def parse_form():
    """
    Returns a list of separated search terms, or None if nothing
    is entered
    """
    form = cgi.FieldStorage()

    if 'terms' in form:
        terms = terms_to_dict(form.getfirst('terms'))
        return terms
    else:
        return None


def recordtime(taskname = None):
    """
    Logs the amount of time used since the last time this function was called, using
    'taskname' as the name of the task. If taskname is None, it just stores the time value.
    """
    now = time.clock()
    if taskname is not None:
        try:
            elapsedtime = now - recordtime.timemark
        except NameError:
            elapsedtime = now        
        logging.debug("%s took %f seconds." % (taskname, elapsedtime))
    recordtime.timemark = now


if __name__ == "__main__":
    """
    do our CGI thing
    """
    
    starttime = time.clock()
    
    format = "%(asctime)s - %(levelname)s - %(message)s"
    logging.basicConfig(filename=LOG_FILENAME, level=logging.DEBUG, format=format)
    logging.debug("=== Running cygnetxml.py. ===")

    recordtime()
    terms = parse_form()
    recordtime("Form parsing")

    print "Content-Type: text/xml\n"
    
    xml_doc = get_matches(terms)

    recordtime()
    xmltext = xml_doc.toxml()    
    recordtime("Generating XML text")
    
    logging.debug("Size of XML document returned: %i chars or %g KB." % (len(xmltext), len(xmltext) / 512.0))
    
    print xmltext
    # xml.dom.ext.PrettyPrint(xml_doc) # no longer exists

    logging.debug("Total time elapsed in cygnetxml.py: %.3g seconds" % (time.clock() - starttime))


