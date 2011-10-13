#!/usr/bin/env python

### ========================
###       backend.py
### ========================
###
### This is the main python code that parses the housing directory file
### into a Python data structure.  The data can then be filtered based on the
### search terms entered by the user, and the results are returned via
### AJAX as a tab-delimited document.
###

# Import configuration information, variables defined include:
# - DIRECTORY_FILE 		String pointing to file to parse for directory information
# - FIELD_ORDER 		List of names of fields, in the order they are in the file
# - CLASS_YEARS 		List of class years to include
# - DELIMITING_CHAR             Character used to delimit fields in DIRECTORY_FILE
# - LOGPARAMS                   Container for several logging paramters used below
from config import *

import cgi
import logging
import logging.handlers
import os
import os.path
import re
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
        if self.fields['email'].lower() in EXCLUDED_USERS:
            return False
        if search_field == None:
            for field in FIELD_ORDER:
                if search_val.lower() in self.fields[field].lower():
                    return True
        elif search_val.lower() in self.fields[search_field].lower():
            return True
        return False

def dict_add(dict, key, value):
    if dict.has_key(key):
        dict[key].append(value)
    else:
        dict[key] = [value]

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
            for term, valuelist in terms.iteritems():
                for value in valuelist:
                    if not r.filter(term, value):
                        included = False
                        break
            if included:
                results.append(r.orig)

        recordtime("Reading and searching directory file")

        dirfile.close()
        logging.info("Found %i results." % len(results))

    return results

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


def configureLogging():
    """
    Configures logging for this script, using a rotating file handler
    and the specified formatting string. Configuration parameters below.
    """
    madelogdir = False
    logdir = os.path.dirname(LOGPARAMS.FILENAME)
    if not os.path.exists(logdir):
        os.makedirs(logdir)
        madelogdir = True

    rootlogger = logging.getLogger()
    rootlogger.setLevel(logging.DEBUG)
    roothandler = logging.handlers.RotatingFileHandler(
            LOGPARAMS.FILENAME,
            maxBytes=1024*LOGPARAMS.FILESIZE_KB,
            backupCount=LOGPARAMS.BACKUP_COUNT)
    roothandler.setFormatter(logging.Formatter(LOGPARAMS.FORMAT))
    rootlogger.addHandler(roothandler)
    logging.info("Made log directory at: './%s'." % logdir)

if __name__ == "__main__":
    """
    Run the script with the provided terms, and print the results.
    """
    configureLogging()
    logging.debug("=== Running cygnetxml.py. ===")

    starttime = time.clock()
    recordtime()
    terms = parse_form()
    recordtime("Form parsing")
    
    results = get_matches(terms)
    resultdata = "\n".join(results)
    logging.debug("Size of data returned: %i chars or %g KB." % (len(resultdata), len(resultdata) / 1024.0))
    
    print "Content-type: text/html;charset=utf-8\r\n"
    print resultdata

    logging.debug("Total time elapsed in backend.py: %.3g seconds" % (time.clock() - starttime))


