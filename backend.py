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

import Image
import MySQLdb



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

        # If not excluded populate user dict
        d = {}
        d['last'] = row[0]
        d['first'] = row[1]
        
        if row[2] == None:
            d['middle'] = ''
        else:
            d['middle'] = row[2]
        
        d['year'] = row[3]
        d['phone'] = row[4]
        d['email'] = row[5]
        if row[6] != None and row[7] != None:
            d['address'] = row[6]+ " " + row[7]
        else:
            d['address'] = ""


        abs_path = os.path.dirname(os.path.abspath(__file__))

        rel_path_to_photo = "/media/photos/{0}.jpg".format(row[5])
        rel_path_to_mod_photo = "/media/photos/{0}_m.jpg".format(row[5])
        rel_path_to_clean_photo = "/media/photos/{0}_c.jpg".format(row[5])
        rel_path_to_alt_photo = "/media/alternate.jpg"


        ## Build Image paths
        abs_path_to_photo = abs_path + rel_path_to_photo
        abs_path_to_clean_photo = abs_path + rel_path_to_clean_photo
        abs_path_to_mod_photo = abs_path + rel_path_to_mod_photo
        abs_rel_path_to_alt_photo = abs_path + rel_path_to_alt_photo


        if d['email'] not in settings.PICTURE_HIDDEN:
            ## If no local image  exists
            if not os.path.isfile(abs_path_to_clean_photo):
                
                # And if we don't have a modified image
                if not os.path.isfile(abs_path_to_mod_photo):
                    #get the raw image
                    img_cur = db.cursor()
                    img_rset = img_cur.execute(generate_SQL_Photo_Query(d['email']))
                    raw_img = img_cur.fetchone()[0]


                    with open(abs_path_to_photo, "wb") as output_file:
                        output_file.write(raw_img)
                        output_file.close()

                    size = 105, 130
                    im = Image.open(abs_path_to_photo)
                    im.thumbnail(size, Image.ANTIALIAS)
                    im.save(abs_path_to_clean_photo, "JPEG")

                    img_cur.close()
                    
                    os.system("rm {0}".format(abs_path_to_photo))

                    d['photo'] = rel_path_to_clean_photo
                
                # Else there is a modified picture and we want to show that
                else:
                    d['photo'] = rel_path_to_mod_photo


            # We have a clean copy in our image folder
            else:
                d['photo'] = rel_path_to_clean_photo
        else:
            d['photo'] = rel_path_to_alt_photo

        results.append(d)

        
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

    search_string = ""
    query = ""

    query_prot = "SELECT LAST_NAME, FIRST_NAME, MIDDLE_NAME, GRAD_YEAR, PHONE, USER_ID, DORM, DORM_ROOM, PHOTO FROM student_data WHERE\n" 
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

def generate_SQL_Photo_Query(uname):

    search_string = ""
    query = ""

    query += "SELECT PHOTO FROM student_data WHERE " 
    query += "USER_ID='{0}';".format(uname)

    return query
