#!/usr/bin/env python

### ========================
###       backend.py
### ========================
###
### Revision 4.0 Alpha, February 2014:
### This is the backend that queries the ITS housing data database and parses it
### into a Python data structure.  The data can then be filtered based on the
### search terms entered by the user, and the results are returned via
### AJAX as a tab-delimited document.
###
###

# Import configuration information, variables defined include:
# - FIELD_ORDER        List of names of fields, in the order they are in the file
# - CLASS_YEARS        List of class years to include (Obsolote due to ITS maintaining data)
# - EXCLUDED_USERS     List of users to completely exclude from the Cygnet
# - PHOTO_DIRECTORY    The path to the directory that stores all the photos
# - ALTERNATE_PHOTO    The path to the alternate photo if one is missing
# - PHOTO_HIDDEN       List of users that requested to have their photo hidden

from django.conf import settings

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

import Image
import MySQLdb


class Student_Record(object):

    def __init__(self, db_conn, row):
        
        # initalize user data from row
        self.last = row[0]
        self.first = row[1]
        # middle name is ommitted
        self.year = row[3]
        self.phone = row[4]
        self.email = row[5]
        self.dorm = row[6]
        self.dorm_room = row[7]

        # initialize vars for later use 
        self.address = ''
        self.photo = ''

        # set user attributes
        self.photo_hidden = (self.email in settings.PHOTO_HIDDEN)
        self.on_leave = False
        self.off_campus = False

    def set_student_address(self):
        self.off_campus = (self.dorm_room and self.dorm == None)
        self.on_leave = (self.dorm == 'On Leave')

        if self.off_campus:
            self.address = 'Off Campus'
            self.phone = ''
        else:
            self.address = self.dorm + " " + self.dorm_room

        if self.phone == None:
            self.phone = ''


    def set_student_photo(self):
        path_to_vanilla = settings.PHOTO_DIRECTORY + self.email
        path_to_vanilla += settings.VANILLA_PHOTO_POSTFIX + '.jpg'

        path_to_mod = settings.MOD_PHOTO_DIRECTORY + self.email
        path_to_mod += settings.MOD_PHOTO_POSTFIX + '.jpg'

        path_to_tmp = settings.TEMP_DIR + self.email + '.jpg'

        if self.photo_hidden:
            self.photo = settings.MEDIA_ROOT + setting.ALTERNATE_PHOTO
        else:
            if not os.path.isfile(path_to_vanilla):
                # And if we don't have a modified image
                if not os.path.isfile(path_to_mod):
                    #get the raw image
                    img_cur = db_conn.cursor()
                    img_rset = img_cur.execute(generate_SQL_Photo_Query(self.email))
                    raw_img = img_cur.fetchone()[0]

                    with open(path_to_tmp, "wb") as output_file:
                        output_file.write(raw_img)
                        output_file.close()

                    size = 105, 130
                    im = Image.open(path_to_tmp)
                    im.thumbnail(size, Image.ANTIALIAS)
                    im.save(path_to_vanilla, "JPEG")

                    img_cur.close()
                    
                    os.system("rm {0}".format(path_to_tmp))

                    self.photo = rel_path_to_clean_photo
                
                # Else there is a modified picture and we want to show that
                else:
                    self.photo = path_to_mod

            # We have a clean copy in our image folder
            else:
                self.photo = path_to_vanilla


    def generate_SQL_Photo_Query(self):
    """
    Simple helper function that given a swat username builds
    a query to the SQL db for the field that contains that 
    user's ID photo.
    """
        search_string = ""
        query = ""

        query += "SELECT PHOTO FROM student_data WHERE " 
        query += "USER_ID='{0}';".format(uname)

        return query


    def as_dict(self):
        self.set_student_address()
        self.set_student_photo()

        ajax_dict = {
            'first':self.first,
            'middle':'',
            'last':self.last,
            'year':self.year,
            'phone':self.phone,
            'email':self.email,
            'address':self.address,
            'photo':self.photo_path,
        }

        return ajax_dict




def terms_to_dict(terms):
    """
    the online cygnet accepts input in the form 'field:value' to allow for specific searches
    this method takes a string of terms
    this method returns a dictionary of the form {field: value}
    if there are no specific fields, a dictionary is returned with only one key, None
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
    now querying the ITS housing db
    """
    if not terms:
        return []

    recordtime()

    # get credentials from settings file
    its_dbc = settings.ITS_DB_DATA

    # establish a MySQLdb
    db = MySQLdb.connect(host=its_dbc['host'], 
                     user=its_dbc['user'], 
                      passwd=its_dbc['passwd'],
                      db=its_dbc['db'],) 


    ### TODO: Advanced Filtering

    # construct cursor, query, then poll db
    cur = db.cursor() 
    q = generate_SQL_Query(terms[None])
    cur.execute(q)

    results = []
    rset = cur.fetchall()

    for row in rset:

        # TODO Check fields based on FIELD_ORDER outlined in settings

        # Check for Excluded Users
        if row[5] in settings.EXCLUDED_USERS:
            continue
        else:
            results.append(Student_Record(db, row).as_dict())

        
    logging.info("Found %i results." % len(results))

    db.close()
    cur.close()

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
    """
    Generates a SQL Query string from a list of terms that all must 
    be present in the row (as substrings of different fields), by 
    ANDing SQL LIKE statements together.
    This is used since ITS's MariaDB doesn't support Fulltext search.
    """

    search_string = ""
    query = ""

    query_prot =  "SELECT LAST_NAME, FIRST_NAME, MIDDLE_NAME, GRAD_YEAR, PHONE, USER_ID, DORM, "
    query_prot += "DORM_ROOM, PHOTO FROM student_data WHERE\n" 

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


