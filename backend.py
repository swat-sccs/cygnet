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
# - DIRECTORY_FILE     String pointing to file to parse for directory information
# - FIELD_ORDER        List of names of fields, in the order they are in the file
# - DELIMITING_CHAR    Character used to delimit fields in DIRECTORY_FILE
# - CLASS_YEARS        List of class years to include
# - EXCLUDED_USERS     List of users to completely exclude from the Cygnet
# - PHOTO_DIRECTORY    The path to the directory that stores all the photos
# - ALTERNATE_PHOTO    The path to the alternate photo if one is missing
# - LOGPARAMS          Container for several logging paramters used below
from settings import *

import cgi
from collections import namedtuple
import json
import logging
import logging.handlers
import os
import os.path
import re
import time

class Record(namedtuple('RawRecord', FIELD_ORDER)):
    """
    Record handles reading and parsing a line from the directory
    file into a more handy format for searching. It also provides
    a boolean filter() function, which tells whether the given
    requirements are matched by the Record.
    """

    @classmethod
    def FromLine(cls, line):
        return cls(*line.split(DELIMITING_CHAR))

    @classmethod
    def FromJSON(cls, json_obj):
        raise NotImplementedError

    def __init__(self, *args, **kwargs):
        super(Record, self).__init__(*args, **kwargs)
        self.excluded = self.email.lower() in EXCLUDED_USERS

    def _asdict(self):
        if self.excluded:
            return {}
        data = super(Record, self)._asdict()
        data['photo'] = self.photo
        return data

    @property
    def photo(self):
        location = "%s/%s.jpg" % (self.year, self.email)
        try:
            open(PHOTO_DIRECTORY + "/" + location)
            return location
        except IOError:
            return ALTERNATE_PHOTO

    def filter(self, search_field, search_val):
        """
        Returns true if the search value appears in the corresponding
        search field, or if the search value appears in ANY field if
        the search field is 'bare'.
        """
        if self.excluded:
            return False
        if search_field == None:
            return any([search_val.lower() in getattr(self, field).lower()
                        for field in self._fields])
        elif search_val.lower() in getattr(self, search_field).lower():
            return True
        return False

    def filter_by_terms(self, terms):
        return all(self.filter(term, value)
                   for term, valuelist in terms.iteritems()
                   for value in valuelist)


def terms_to_dict(terms):
    """
    the online cygnet accepts input in the form 'field:value' to allow for specific searches
    this method takes a string of terms
    this method returns a dictionary of the form {field: value}
    if there are no specific fields, a dictionary is returned only one key, None
    """
    term_re = re.compile(r'(\w+:\w+)|(\w+:"[\w ]+")|(\w+)|("[\w ]+")')
    matches = term_re.findall(terms)
    logging.debug("Matches: %s" % matches)
    
    term_dict = {}
    dict_add = lambda key, value: term_dict.setdefault(key, []).append(value)
    for match in matches:
        if match[0]:
            key, value = match[0].split(':')
            if key in FIELD_ORDER:
                dict_add(key, value)
        elif match[1]:
            key, value = match[1].split(':')
            if key in FIELD_ORDER:
                dict_add(key, value.strip('"'))
        elif match[2]:
            dict_add(None, match[2])
        elif match[3]:
            dict_add(None, match[3].strip('"'))

    logging.info("Search terms are: " + repr(term_dict))
    return term_dict
    
#     d = {}
#     for match in matches:
#         if not match[0] == '':
#             toks = match[0].split(':')
#             if toks[0] in FIELD_ORDER:
#                 dict_add(d, toks[0], toks[1])
#         elif not match[1] == '':
#             toks = match[1].split(':')
#             if toks[0] in FIELD_ORDER:
#                 dict_add(d, toks[0], toks[1].strip('"'))
#         elif not match[2] == '':
#             for s in match[2].split():
#                 dict_add(d, None, s)
                

def get_matches(terms):
    """
    returns a list of matches (list of Record objects)
    that match the query represented by the search terms
    """
    if not terms:
        return []

    recordtime()
    try:
        dirfile = open(DIRECTORY_FILE, 'r') 
    except IOError:
        logging.error("Cygnet file not found!")
        exit(1)

    results = []
    with dirfile:
        for line in dirfile:
            line = line.strip()
            if len(line) == 0:
                continue
            record = Record.FromLine(line)
            if record.filter_by_terms(terms):
                # Eventually if we use the simplejson module we can skip this
                # call to _asdict(), since it handles namedtuples nicely.
                results.append(record._asdict())

        logging.info("Found %i results." % len(results))

    recordtime("Reading and searching directory file")
    return results

def parse_form():
    """
    Returns a dictionary of search terms from the form.
    """
    form = cgi.FieldStorage()
    if 'terms' in form:
        return terms_to_dict(form.getfirst('terms'))
    return {}


def recordtime(taskname=None):
    """
    Stores the time this function was called, and if taskname is not None,
    also logs the elapsed time since the function was last called.

    Logs the amount of time used since the last time this function was called, using
    'taskname' as the name of the task. If taskname is None, it just stores the time value.
    """
    now = time.clock()
    if not hasattr(recordtime, 'first_mark'):
        recordtime.first_mark = now
        recordtime.last_mark = now
    elapsedtime = now - recordtime.last_mark
    recordtime.last_mark = now
    if taskname is not None:
        logging.debug("%s took %f seconds." % (taskname, elapsedtime))
    return now - recordtime.first_mark

def configureLogging():
    """
    Configures a rotating log file for this script based on the logging
    parameters in settings.py.
    """
    made_log_dir = False
    logdir = os.path.dirname(LOGPARAMS.FILENAME)
    if not os.path.exists(logdir):
        os.makedirs(logdir)
        made_log_dir = True

    rootlogger = logging.getLogger()
    rootlogger.setLevel(logging.DEBUG)
    roothandler = logging.handlers.RotatingFileHandler(
        LOGPARAMS.FILENAME,
        maxBytes=1024*LOGPARAMS.FILESIZE_KB,
        backupCount=LOGPARAMS.BACKUP_COUNT)
    roothandler.setFormatter(logging.Formatter(LOGPARAMS.FORMAT))
    rootlogger.addHandler(roothandler)

    if made_log_dir:
        logging.info("Made log directory at: './%s'." % logdir)


def serveResultsPage():
    """
    Run the script using terms passed in via CGI, and generate a page
    of results to return via HTTP.
    """
    configureLogging()
    logging.debug("=== Running cygnetxml.py. ===")

    starttime = time.clock()
    recordtime()
    terms = parse_form()
    recordtime("Form parsing")
    
    results = get_matches(terms)
    resultdata = json.dumps(results)
    logging.debug("Size of data returned: %i chars or %g KB." %
                  (len(resultdata), len(resultdata) / 1024.0))
    
    print "Content-type: text/html;charset=utf-8\r\n"
    print resultdata

    logging.debug("Total time elapsed in backend.py: %.3g seconds" %
                  recordtime())

if __name__ == "__main__":
    serveResultsPage()
