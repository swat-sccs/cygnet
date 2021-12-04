#!/usr/bin/env python
# -*- coding: latin-1 -*-

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
import datetime

import time
import traceback

#08/25/2014, defa: try and fix IO error in pil
#06/11/2015, tino: library error from pil
from PIL import Image, ImageChops
import filecmp
import MySQLdb


class Student_Record(object):

    def __init__(self, db_conn, row, updating):

        ##logging.warning("CYG:: Beginning of constructor")  

        # initalize user data from row
        #self.last = row[0].decode(‘latin-1').encode('utf-8')
        #self.first = row[1].decode(‘latin-1').encode('utf-8')
        self.last = row[0]
        self.first = row[1]
	# middle name is ommitted
        self.year = row[3]
        self.phone = row[4]
        self.email = row[5]

        self.dorm = row[6]
        self.dorm_room = row[7]
        if self.email in settings.ROOM_HIDDEN:	
                self.dorm = ""
                self.dorm_room = ""

        # initialize vars for later use 
        self.updating = updating
        self.db = db_conn
        self.address = ''
        self.photo = ''

        # set user attributes
        self.photo_hidden = (self.email in settings.PHOTO_HIDDEN)
        self.on_leave = False
        self.off_campus = False
        ##logging.warning("CYG:: End of constructor.")


    def set_student_vars(self):
        self.off_campus = (self.dorm_room == None and self.dorm == None and not self.updating)
        self.on_leave = (self.dorm == 'On Leave')

        if not self.year:
            self.year = 'N/A'

        if self.off_campus:
            self.address = 'Off Campus'
            self.phone = ''
        else:
            if self.dorm == None:
                self.dorm = ''
            if self.dorm_room == None:
                self.dorm_room = ''

            self.address = self.dorm + " " + self.dorm_room

        if self.phone == None:
            self.phone = ''

        return


    def set_student_photo(self):
        
        ## TODO: Add real exception handling and logging when manipulating
        # the database

        alternate_path = settings.ASSET_DIR + 'its_alternate.jpg'

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
                #query = "SELECT PHOTO FROM student_data WHERE USER_ID= %s ;"
                query = "SELECT PHOTO FROM student_data WHERE USER_ID='{0}' ;".format( self.email )
                #img_rset = img_cur.execute(query, (self.email))
                img_rset = img_cur.execute(query)
                raw_img = img_cur.fetchone()[0]

                with open(tmp_photo_path, "wb") as output_file:
                    output_file.write(raw_img)
                    output_file.close()

                size = 105, 130
                try:
                    im = Image.open(tmp_photo_path)
                    im.thumbnail(size, Image.ANTIALIAS)
                    im.save(vanilla_photo_abs_path, "JPEG")
                # defa, 8/25:
                # we really need more exception handling in this whole codebase :P
                except:
                    self.photo = 'media' + alternate_path
                    img_cur.close()
                    logging.info("user %s picture is screwed" %tmp_photo_path)
                    return

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
        
        ##logging.warning("CYG:: In as_dict function")

        # check student status and set vars
        self.set_student_vars()
        if self.on_leave or self.off_campus:
             ##logging.warning("CYG:: Student is on leave or off campus.")
             return {}
        
        ##logging.warning("CYG:: Constructing json dict")
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

        ##logging.warning("CYG:: Returning dict of length: %i" % len(json_dict) )
        return json_dict




def terms_to_dict(terms):
    """
    the online cygnet accepts input in the form 'field:value' to allow for specific searches
    this method takes a string of terms
    this method returns a dictionary of the form {field: value}
    if there are no specific fields, a dictionary is returned with only one key, None
    """
    
    ## Hacky way to prevent SQL Injection attacks - 
    ## Only accept alphanumeric characters, colons, quotation marks
    for ch in terms:
        if ch.isalpha() or ch.isdigit() or ch in [' '] : 
            continue
        return {}
    # return early on Unicode chars
    try:
        terms.encode('ascii')
    except UnicodeEncodeError:
        return {}
    DORMS = {
        "ap" : "Alice Paul Hall",
        "dk" : "David Kemp Hall",
        "ml" : "Mary Lyon"
    }

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

    #fix for multi part dorm names
    if "dorm" in list(term_dict.keys()):
        if term_dict["dorm"][0].lower() in DORMS.keys():
            new = DORMS[term_dict["dorm"][0].lower()]
            term_dict["dorm"][0] = new
            
    logging.info("Search terms are: " + repr(term_dict))
    return term_dict


def is_updating(db):
    """
    returns whether ITS is updating their database
    takes in the MySQLDb db instance
    """
    # when ITS does that they set all DORM and DORM_ROOM to null
    # so we check if all of them are set to null
    query = '''SELECT FIRST_NAME FROM student_data WHERE DORM IS NOT NULL AND DORM_ROOM IS NOT NULL LIMIT 1'''
    # run query
    with db.cursor() as cur:
        cur.execute(query)
        rset = cur.fetchall()
    return (len(rset) <= 0)  # ITS is updating their database if no results are returned


def get_matches(terms):
    """
    returns a list of matches (list of Record objects)
    that match the query represented by the search terms
    now querying the ITS housing db
    """
    # TODO REMOVE
    #DBGMessage = "CYG:: Got " + str(len(rset)) + " results from query." 
    #logging.warning( DBGMessage )

    if not terms:
        return []

    if None in terms.keys() and len(terms.keys()) > 1:
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
    query, qterms = generate_SQL_Query(terms, db)

    # pass in the literal sql query plus format tuple
    # this automatically escapes the qterms
    cur.execute(query, qterms)

    results = []
    rset = cur.fetchall()
    
    updating = False
    if False not in (row[6] is None and row[7] is None for row in rset):
        # generator to make it faster
        # dorm and dorm_room are None for all
        # check if ITS is updating their database
        updating = is_updating(db)
    
    ##DBGMessage = "CYG:: Got " + str(len(rset)) + " results from query." 
    ##logging.warning( DBGMessage )

    for row in rset:

        # TODO: Check fields based on FIELD_ORDER outlined in settings
        # to make all this more pluggable

        # Check for Excluded Users
        if row[5] in settings.EXCLUDED_USERS:
            ##logging.warning("CYG:: Excluding result because user is excluded.")
            continue
        else:
            student = Student_Record(db, row, updating).as_dict()
            if student:
                results.append(student)

    ##logging.warning("CYG:: Found %i results." % len(results) )
    
    logging.info("Found %i results." % len(results))

    cur.close()
    db.close()

    recordtime("Reading and searching directory file")
    
    return results


def recordtime(taskname=None):
    """
    Logs the amount of time used since the last time this function was
    called, using 'taskname' as the name of the task. If taskname is None,
    it just stores the time value.  Returns the total elapsed time since
    this function was first called.
    """
    now = time.time()
    if not hasattr(recordtime, 'first_mark'):
        recordtime.first_mark = now
        recordtime.last_mark = now
    elapsedtime = now - recordtime.last_mark
    recordtime.last_mark = now
    if taskname is not None:
        logging.debug("%s took %f seconds." % (taskname, elapsedtime))
    return now - recordtime.first_mark


def generate_SQL_Query(terms_dict, db):
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
    query_prot += "DORM_ROOM FROM student_data WHERE (GRAD_YEAR >= %s) and  \n" 
    
    term_query = "((FIRST_NAME LIKE %s ) or (LAST_NAME LIKE %s ) or (GRAD_YEAR LIKE %s ) or "
    term_query += " (USER_ID LIKE %s ) or (DORM LIKE %s ) or (DORM_ROOM LIKE %s ) )\n"
    

    term_dict_thesaurus  = {
        'first': " FIRST_NAME LIKE {0} ",
        'last': "  LAST_NAME LIKE {0} ",
        'year': " GRAD_YEAR LIKE {0} ",
        'email': " USER_ID LIKE {0} ",
        'dorm_room': " DORM_ROOM LIKE {0} ",
        'dorm': " DORM LIKE {0} ",
    }

    # if no specific terms are present:
    if len(terms_dict) and not list(terms_dict.keys())[0]:
        terms = terms_dict[None]
        # find next graduation year
        cur_datetime = datetime.datetime.now()
        if cur_datetime.month <= 5:
            next_grad_year = cur_datetime.year
        else:
            next_grad_year = cur_datetime.year + 1

        ## Ben - I think that what follows allows for partial search
        ## matches.
        ## TODO - see if this is vulnerable to SQL injection attacks
        ## TODO - integrate this with specific searches too
        i = 0
        j = len(terms)-1
        search_string += query_prot + '('

        for term in terms :
            search_string += term_query.format( term ) 
            if ( i != j ) :
                search_string += "AND\n"
            i += 1

        search_string += " ); "
        
        for t in terms :
            
            string = "%%%s%%" % (t)
            qt.append( [string, string, string, string, string, string] )
        qterms = tuple([next_grad_year] + [t for subl in qt for t in subl])

        return search_string, qterms

    else:
        dict_keys = list(terms_dict.keys())
        i = 0
        j = len(dict_keys)-1
        for key in dict_keys:
            if terms_dict[key]:
                term = db.escape_string(terms_dict[key][0]) 
                search_string += term_dict_thesaurus[key].format(term)
                if i!=j:
                    search_string += " AND\n"
                i+=1

        raise Exception(search_string)
        return search_string, ()

    return "", ()
