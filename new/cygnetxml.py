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
# - directory_file 		String pointing to file to parse for directory information
# - field_order 		List of names of fields, in the order they are in the file
# - class_years 		List of class years to include
from config import *

import cgi
import types
import xml.dom
import re
import logging

LOG_FILENAME = 'cygnet_errors.log'

class Record:
    """
    Record handles reading and parsing a line from the directory
    file into a more handy format for searching. It also provides
    a boolean filter() function, which tells whether the given
    requirements are matched by the Record.
    """

    def __init__(self, line):
        """
        Parse the line from the file
        """
        self.orig = line
        
        split_fields = line.split('\t')

        self.fields = {}
        num = min(len(field_order), len(split_fields)) 
        
        for i in range(num):
            self.fields[field_order[i]] = split_fields[i].strip()

        for f in field_order:
            if f not in self.fields:
                self.fields[f] = ''

    def filter(self, s_field, s_val):
        """
        returns true if the value in 'term' appears
        in *any* field in this record
        """
        
        if s_field == 'bare':
            for field in field_order:
                if s_val.lower() in self.fields[field].lower():
                    return True
        else:
            if s_val.lower() in self.fields[s_field].lower():
                return True

        return False


    def toXMLNode(self, xml_document):
        """
        returns an XML-node representing this person. xml_document
        must be a valid DOMImplementation, like that returned by
        xml.dom.minidom.getDOMImplementation(...)
        """
        
        node = xml_document.createElement("person")
        
        for field in field_order:
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
        dict[key] = [value]

def terms_to_dict(terms):
    """
    the online cygnet accepts input in the form "field:value" to allow for specific searches
    this method takes a string of terms
    this method returns a dictionary of the form {field: value}
    if there are no specific fields, a dictionary is returned only one key, "bare"
    """
    bare_re = re.compile(r'(\w*:\w*)|(\w*:"[\w ]*")|(\w+)')

    matches = bare_re.findall(terms)
    
    d = {}
    for match in matches:
        if not match[0] == '':
            toks = match[0].split(':')
            if toks[0] in field_order:
                dict_add(d, toks[0], toks[1])
        elif not match[1] == '':
            toks = match[1].split(':')
            if toks[0] in field_order:
                dict_add(d, toks[0], toks[1].strip('"'))
        elif not match[2] == '':
            for s in match[2].split():
                dict_add(d, 'bare', s)
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

    logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)
    logging.debug('Running cygnetxml.py.')

    if terms is not None:

        #
        ###### INSERT TRY/CATCH STATEMENT HERE 
        #
        fp = file(directory_file, 'r') 

        results = []

        for line in fp:
            line = line.strip()
            if len(line) == 0:
                continue
    
            r = Record(line)
            included = True
            for term in terms.keys():
                # included is true only as long as all terms filter
                # to true
                for val in terms[term]:
                    included = included and r.filter(term,val)
                    if included == False:
                        break
                if included == False:
                    break
                
            if included:
                results.append(r)

        # results.sort()

        for result in results:
            document_elm.appendChild(result.toXMLNode(xml_document))

        fp.close()
        logging.debug("Number of results %i" % len(results))

    return xml_document

def parse_form():
    """
    returns a list of separated search terms, or None if nothing
    is entered
    """
    form = cgi.FieldStorage()

    if 'terms' in form:
        terms = terms_to_dict(form.getfirst('terms'))

        return terms
    else:
        return None

if __name__ == "__main__":
   """
   do our CGI thing
   """

   

   terms = parse_form()
    

   print "Content-Type: text/xml\n"
    
   xml_doc = get_matches(terms)
   print xml_doc.toxml()
    # xml.dom.ext.PrettyPrint(xml_doc) # no longer exists


