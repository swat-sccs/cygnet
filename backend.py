#!/usr/bin/env python

### ========================
###       backend.py
### ========================
###
### Revision 3.5 Beta, February 2014:
### This is the backend that queries the ITS housing data database and parses it
### into a Python data structure.  The data can then be filtered based on the
### search terms entered by the user, and the results are returned via
### AJAX as a tab-delimited document.
###
###

# Import configuration information, variables defined include:
# - FIELD_ORDER        List of names of fields, in the order they are in the file
# - EXCLUDED_USERS     List of users to completely exclude from the Cygnet
# - ALTERNATE_PHOTO    The path to the alternate photo if one is missing
# - PHOTO_HIDDEN       List of users that requested to have their photo hidden
# - VANILLA_PHOTO_DIR  relative path to unchanged user pictures
# - MOD_PHOTO_DIR      Relative path to modified user pictures



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


import Image, ImageChops, filecmp
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
        self.db = db_conn
        self.address = ''
        self.photo = ''

        # set user attributes
        self.photo_hidden = (self.email in settings.PHOTO_HIDDEN)
        self.on_leave = False
        self.off_campus = False

    def set_student_vars(self):
        self.off_campus = (self.dorm_room == None and self.dorm == None)
        self.on_leave = (self.dorm == 'On Leave')

        if self.off_campus:
            self.address = 'Off Campus'
            self.phone = ''
        else:
            if self.dorm == None:
                self.dorm = ''
            if self.dorm_room ==None:
                self.dorm_room = ''

            self.address = self.dorm + " " + self.dorm_room

        if self.phone == None:
            self.phone = ''

        return


    def set_student_photo(self):
        
        ## TODO: Add real exception handling and logging when manipulating
        # the database

        alternate_path = settings.ASSET_DIR + 'alternate.jpg'

        if self.photo_hidden:
            self.photo = 'media' + alternate_path


        else:

            mod_photo = self.email + settings.MOD_PHOTO_POSTFIX + '.jpg'
            mod_photo_path = settings.MOD_PHOTO_DIR + mod_photo
            mod_photo_abs_path = settings.MEDIA_ROOT + mod_photo_path

            vanilla_photo = self.email + settings.VANILLA_PHOTO_POSTFIX + '.jpg'
            vanilla_photo_path = settings.VANILLA_PHOTO_DIR + vanilla_photo
            vanilla_photo_abs_path = settings.MEDIA_ROOT + vanilla_photo_path

            its_alternate = settings.ASSET_DIR + 'its_alternate.jpg'
            its_alternate_abs_path = settings.MEDIA_ROOT +  its_alternate

            

            # make absolute tmp photo path
            tmp_photo_path = settings.MEDIA_ROOT + settings.TMP_DIR + self.email + '.jpg'

            # if we have no picture locally
            if not os.path.isfile(vanilla_photo_abs_path) and not os.path.isfile(mod_photo_abs_path):

                #get the raw image
                img_cur = self.db.cursor()              

                # queries the database while escaping the string
                query = "SELECT PHOTO FROM student_data WHERE USER_ID= %s ;"
                img_rset = img_cur.execute(query, (self.email))
                raw_img = img_cur.fetchone()[0]

                with open(tmp_photo_path, "wb") as output_file:
                    output_file.write(raw_img)
                    output_file.close()

                size = 105, 130
                im = Image.open(tmp_photo_path)
                im.thumbnail(size, Image.ANTIALIAS)
                im.save(vanilla_photo_abs_path, "JPEG")

                img_cur.close()
                
                # delete the temporary picture
                os.system("rm {0}".format(tmp_photo_path))

                self.photo = 'media' + vanilla_photo_path
            
            # Else there is a modified picture and we want to show that
            elif os.path.isfile(mod_photo_abs_path):
                # check if the pic is the ITS placeholder
                if filecmp.cmp(mod_photo_abs_path, its_alternate_abs_path ):
                    self.photo = 'media' + alternate_path
                else:
                    self.photo = 'media' + mod_photo_path
            
            # We have a clean copy in our image folder
            else:
                # check if the pic is the ITS placeholder
                if filecmp.cmp(vanilla_photo_abs_path, its_alternate_abs_path):
                    self.photo = 'media' + alternate_path
                else:
                    self.photo = 'media' + vanilla_photo_path


        return


    def as_dict(self):
        # check student status and set vars
        self.set_student_vars()
        if self.on_leave or self.off_campus:
            return {}
        
        # if student will show up set photo
        self.set_student_photo()

        json_dict = {
            'first':self.first,
            'middle':'',
            'last':self.last,
            'year':self.year,
            'phone':self.phone,
            'email':self.email,
            'address':self.address,
            'photo':self.photo,
        }

        return json_dict




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

    ## TODO: Add real exception handling and logging when manipulating
    #        the database


    # get credentials from settings file
    its_dbc = settings.ITS_DB_DATA

    # establish a MySQLdb
    db = MySQLdb.connect(host=its_dbc['host'], 
                     user=its_dbc['user'], 
                      passwd=its_dbc['passwd'],
                      db=its_dbc['db'],) 



    # construct cursor, query, then poll db
    cur = db.cursor() 

    # generate the SQL query
    query, qterms = generate_SQL_Query(terms)

    # pass in the literal sql query plus format tuple
    # this automatically escapes the qterms
    cur.execute(query, qterms)

    results = []
    rset = cur.fetchall()

    for row in rset:

        # TODO: Check fields based on FIELD_ORDER outlined in settings
        # to make all this more pluggable

        # Check for Excluded Users
        if row[5] in settings.EXCLUDED_USERS:
            continue
        else:
            student = Student_Record(db, row).as_dict()
            if student:
                results.append(student)

        
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


def generate_SQL_Query(terms_dict):
    """
    Generates a SQL Query string from a dict of terms that all must 
    be present in the row (as substrings of different fields), by 
    ANDing SQL LIKE statements together.
    This is used since ITS's MariaDB doesn't support Fulltext search.
    Also generates the format tuple that is passed in to the database
    curser execution, which automatically escapes input.
    """

    search_string = ""
    qt = []

    query_prot =  "SELECT LAST_NAME, FIRST_NAME, MIDDLE_NAME, GRAD_YEAR, PHONE, USER_ID, DORM, "
    query_prot += "DORM_ROOM FROM student_data WHERE\n" 

    term_query = "((FIRST_NAME LIKE %s ) or (LAST_NAME LIKE %s ) or (GRAD_YEAR LIKE %s ) or "
    term_query += "(DORM LIKE %s ) or (DORM_ROOM LIKE %s ) or (USER_ID LIKE %s ))\n"
    
    term_dict_thesaurus  = {
        'first': " FIRST_NAME = %s ",
        'last': "  LAST_NAME = %s ",
        'year': " GRAD_YEAR = %s ",
        'email': " USER_ID = %s ",
        'dorm_room': " DORM_ROOM = %s ",
        'dorm': " DORM = %s ",
    }

    # if no specific terms are present:
    if len(terms_dict) and not terms_dict.keys()[0]:
        terms = terms_dict[None]

        i = 0
        j = len(terms)-1
        for term in terms:
            search_string += term_query.format(term)
            if i != j:
                search_string += "AND\n"
            i+=1

        # return the qterms to main for formatting the sql query
        # qt step is needed since for every term we need to format
        # five placeholders (see term_query) with the term.
        qt = [[e, e, e, e, e, e] for e in terms]
        qterms = tuple([e for subl in qt for e in subl])



    else:
        dict_keys = terms_dict.keys()
        i = 0
        j = len(dict_keys)-1
        for key in dict_keys:
            if terms_dict[key]:
                search_string += term_dict_thesaurus[key].format(terms_dict[key][0])
                qt.append(terms_dict[key][0])
                if i!=j:
                    search_string += " AND\n"
                i+=1

        qterms = tuple(qt)


    query = query_prot + " ( " + search_string + " );"
    

    return query, qterms


