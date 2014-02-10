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
from django.conf import settings

from dorms import readable_dorms

from collections import namedtuple
import codecs
import json
import logging
import logging.handlers
import os
import os.path
import re
import sys
import time
import traceback

class Record(namedtuple('RawRecord', settings.FIELD_ORDER)):
    """
    Record handles reading and parsing a line from the directory
    file into a more handy format for searching. It also provides
    a boolean filter() function, which tells whether the given
    requirements are matched by the Record.
    """

    @classmethod
    def FromLine(cls, line):
        fields = line.split(settings.DELIMITING_CHAR)
        if len(fields) > len(settings.FIELD_ORDER):
            fields = fields[:len(settings.FIELD_ORDER)]
        elif len(fields) < len(settings.FIELD_ORDER):
            fields += [''] * (len(settings.FIELD_ORDER) - len(fields))

        try:
            index = settings.FIELD_ORDER.index('address')
            dorm, room = fields[index].split(' ', 1)
            fields[index] = ' '.join([readable_dorms[dorm], room])
        except ValueError:
            pass
        except KeyError:
            pass

        return cls(*fields)

    @classmethod
    def FromJSON(cls, json_obj):
        raise NotImplementedError

    def __init__(self, *args, **kwargs):
        super(Record, self).__init__(*args, **kwargs)
        self.excluded = self.email.lower() in settings.EXCLUDED_USERS

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
            open(settings.PHOTO_DIRECTORY + "/" + location)
            return location
        except IOError:
            return settings.ALTERNATE_PHOTO

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
    term_re = re.compile(r'(\w+:\w+)|'
                         r'(\w+:["\'][\w ]+["\'])|'
                         r'(\w+)|'
                         r'(["\'][\w ]+["\'])')
    matches = term_re.findall(terms)
    logging.debug("Matches: %s" % matches)
    
    term_dict = {}
    dict_add = lambda key, value: term_dict.setdefault(key, []).append(value)
    for match in matches:
        if match[0]:
            key, value = match[0].split(':')
            if key in settings.FIELD_ORDER:
                dict_add(key, value)
        elif match[1]:
            key, value = match[1].split(':')
            if key in settings.FIELD_ORDER:
                dict_add(key, value.strip('"\''))
        elif match[2]:
            dict_add(None, match[2])
        elif match[3]:
            dict_add(None, match[3].strip('"\''))

    logging.info("Search terms are: " + repr(term_dict))
    return term_dict


def get_matches(terms):
    """
    returns a list of matches (list of Record objects)
    that match the query represented by the search terms
    """
    if not terms:
        return []

    recordtime()

    ##### HACKYHACKYYYY  ######

    import MySQLdb
    db = MySQLdb.connect(host="redbay.swarthmore.edu", # your host, usually localhost
                     user="cygnet", # your username
                      passwd="JovTaFlyds", # your password
                      db="user_directory_data") # name of the data base

    # you must create a Cursor object. It will let
    #  you execute all the query you need
    cur = db.cursor() 

    q = generate_SQL_Query(terms[None])

    # Use all the SQL you like
    cur.execute(q)

    results = []
    rset = cur.fetchall()

    for row in rset:
        d = {}
        d['last'] = row[0]
        d['first'] = row[1]
        
        if row[2] == None:
            d['middle'] = ''
        else:
            d['middle'] = row[2]
        
        d['year'] = row[3]
        d['phone'] = row[4]
        d['email'] = row [5]
        if row[6] != None and row[7] != None:
            d['address'] = row[6]+ " " + row[7]
        else:
            d['address'] = "None"
        results.append(d)
        
    logging.info("Found %i results." % len(results))

    recordtime("Reading and searching directory file")
    return results

def recordtime(taskname=None):
    """
    Logs the amount of time used since the last time this function was
    called, using 'taskname' as the name of the task. If taskname is None,
    it just stores the time value.  Returns the total elapsed time since
    this function was first called.
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

def generate_SQL_Query(terms):

    search_string = ""
    query = ""

    query_prot = "SELECT LAST_NAME, FIRST_NAME, MIDDLE_NAME, GRAD_YEAR, PHONE, USER_ID, DORM, DORM_ROOM FROM student_data WHERE\n" 
    term_query = "((FIRST_NAME LIKE '%{0}%') or (LAST_NAME LIKE '%{0}%') or (GRAD_YEAR LIKE '%{0}%') or "
    term_query += "(DORM LIKE '%{0}%') or (DORM_ROOM LIKE '%{0}%') or (USER_ID LIKE '%{0}%'))\n"
    
    i = 0
    j = len(terms)-1
    for term in terms:
        search_string += term_query.format(term)
        if i != j:
            search_string += "AND\n"
        i+=1

    query = query_prot + "(" + search_string + ");"

    return query