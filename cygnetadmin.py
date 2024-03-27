#!/usr/bin/env python

"""

Code that allows for easier management of the Cygnet system under its new Banner based
code.
Written by: Ben Marks '16 (bmarks1)
Code Copied Shamelessly From: Nick Felt '13 (nfelt1)'s original cygnetadmin script
                              and Daniel-Elia Feist-Alexandrov's Cygnet DB interface
                              code.
Edited by:  Daniel-Elia Feist-Alexandrov '15
            Riley Collins  '16
            Clare Hanlon '18
            Gregory Lee '21
date of last revision: 4/18/19
"""

import codecs
import json
import os
import os.path
import re
import sys
import time
import traceback
import subprocess
import smtplib
import tempfile
from email.mime.text import MIMEText


import MySQLdb

ITS_DB_DATA = {
    'host':'130.58.64.142',
    'port':'3306',
    'db':'user_directory_data',
    'user':'sccscygnet',
    'passwd':'xLIM-eadQYijoRvW', #'JovTaFlyds',
    'table':'student_data',
    }

# For now, don't futz with the actual file
SETTINGS_FILE = "./student_settings/student_settings.txt"
#SETTINGS_FILE = "settings.py"
MOD_DIR = "/srv/services/cygnet/media/photos/mod/"
VANILLA_DIR = "/srv/services/cygnet/media/photos/vanilla/"

IMAGE_X = 105.0
IMAGE_Y = 130.0

# For constructing a summary e-mail at the end
changesMade = []

def is_int( num ) :
    """
    Checks if a given string is an integer.
    """
    try :
        int( num )
        return True
    except ValueError:
        return False


def get_answer_between( low, hi ) :
    """
    Keeps asking for a choice until the user enters in something in the
    range low, hi inclusive.
    """
    answer = input("Choose a number [" + str(low) + ", " + str(hi) + "] : ")
    while ( not is_int( answer ) or int( answer ) not in list(range( low, hi + 1)) ) :
        answer = input("Choose a number [" + str(low) + ", " + str(hi) + "] : ")
    return int(answer)

def choose_user_from_results( results ) :
    """
    Given a list of user results from the DB query, get the single
    user we want, and format it in a dictionary
    """
    tupToFormat = -1

    if ( len( results ) == 0 ) :
        print("Error: No matching people found")
        exit(1)
    if ( len( results ) == 1 ) :
        print(results[0])
        tupToFormat = results[0]
    else :
        print("Multiple matches found. Choose the person to modify")
        for i in range(len(results) ) :
            print(str(i) + ": " + str(results[i]))
        tupToFormat = results [ get_answer_between( 0, len(results) - 1 ) ]

    ## Reformat the tuple as a dictionary, to make it easier to mainpulate
    toRet = {}
    toRet['last'] = tupToFormat[0]
    toRet['first'] = tupToFormat[1]
    if tupToFormat[2] == None :
        toRet['year'] = ""
    else :
        toRet['year'] = tupToFormat[2]
    toRet['id'] = tupToFormat[3]


    return toRet

def get_matches(terms):
    """
    returns a list of matches
    that match the query represented by the search terms
    now querying the ITS housing db
    """
    if not terms:
        return []


    # get credentials from settings file
    its_dbc = ITS_DB_DATA

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

    cur.close()
    db.close()

    return rset


def generate_SQL_Query( terms ) :

    search_string = ""
    qt = []

    query_prot = "SELECT LAST_NAME, FIRST_NAME, GRAD_YEAR, USER_ID \n"
    query_prot += "FROM student_data \n"
    query_prot += " WHERE "

    term_query = "( (FIRST_NAME LIKE %s ) or (LAST_NAME LIKE %s ) or "
    term_query += " (USER_ID LIKE %s ) )\n"

    search_string += query_prot + "( "
    i = 0
    j = len(terms) - 1
    for term in terms :
        search_string += term_query.format( term )
        if ( i != j ) :
            search_string += "AND\n"
        i += 1

    search_string += " ); "

    # undo this to debug the search string
    # print search_string

    # return the qterms to main for formatting the sql query
    # qt step is needed since for every term we need to format
    # three placeholders (see term_query) with the term.
    for e in terms :
        string = "%%%s%%" % (e)
        qt.append( [string, string, string] )
    #qt = [[e, e, e] for e in terms]
    qterms = tuple([e for subl in qt for e in subl])

    return search_string, qterms



def hidePhoto( username, year="None" ) :
    """
    Modify settings.py and hide the photo associated with Swarthmore ID
    username
    """
    start = 0
    end = 0

    fd = open( SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of PHOTO_HIDDEN section
    for i in range( len( lines ) ) :
        if lines[i].find( 'PHOTO_HIDDEN' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            print("Looks like that user's picture is already hidden!")
            return

        if lines[j].find( ']' ) != -1 :
            end = j
            break

    toAdd = "'" + username + "', #" + year

    newLines = lines[:end]
    newLines.append( toAdd )
    newLines.extend(lines[end:])
    newLines.extend(["", "", ""])

    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    # Remove view permissions
    remove_photo_view_permissions( username )

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)

    print("\n\nCygnet photo for ", username, " hidden successfully.\n")
    changesMade.append("Your Cygnet photo was hidden.")

def unHidePhoto( username ) :
    """
    Modify settings.py and unhide the photo associated with Swat ID
    username
    """
    toRemove = -1

    fd = open(SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of PHOTO_HIDDEN section
    for i in range( len( lines ) ) :
        if lines[i].find( 'PHOTO_HIDDEN' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            toRemove = j
            break

        if lines[j].find( ']' ) != -1 :
            print("Looks like that username's photo isn't hidden!")
            return


    newLines = lines[:toRemove]
    newLines.extend(lines[toRemove + 1:])
    newLines.extend(["", "", ""])


    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    # Restore view permissions
    restore_photo_view_permissions( username )

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)

    print("\n\nCygnet photo for ", username, " unhidden successfully.\n")
    changesMade.append("Your Cygnet photo was un-hidden.")

def excludeUser( username, year="None" ) :
    """
    Modify settings.py and exclude the user username from the Cygnet
    """

    start = 0
    end = 0

    fd = open(SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of EXCLUDED USERS section
    for i in range( len( lines ) ) :
        if lines[i].find( 'EXCLUDED_USERS' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            print("Looks like that user is already excluded!")
            return

        if lines[j].find( ']' ) != -1 :
            end = j
            break

    toAdd = "'" + username + "', #" + year

    newLines = lines[:end]
    newLines.append( toAdd )
    newLines.extend(lines[end:])
    newLines.extend(["", "", ""])


    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    # Remove view permissions
    remove_photo_view_permissions( username )

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)


    print("\n\nCygnet profile for ", username, " excluded successfully.\n")
    changesMade.append("You were removed from the Cygnet.")

def unExcludeUser( username ) :
    """
    Modify settings.py to remove <username> from the excluded users list
    """

    toRemove = -1

    fd = open(SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of EXCLUDED USERS section
    for i in range( len( lines ) ) :
        if lines[i].find( 'EXCLUDED_USERS' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            toRemove = j
            break

        if lines[j].find( ']' ) != -1 :
            print("Looks like that username's photo isn't hidden!")
            return


    newLines = lines[:toRemove]
    newLines.extend(lines[toRemove + 1:])
    newLines.extend(["", "", ""])

    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    # Restore view permissions
    restore_photo_view_permissions( username )

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)


    print("\n\nCygnet profile for ", username, " restored successfully.\n")
    changesMade.append("You were un-removed from the Cygnet.")

    return

def remove_photo_view_permissions(swatID):
    '''
    Prevent Apache from displaying photos of people who want their
    photo hidden or are removed from the Cygnet
    Param:
        swatID - swat ID/email username
    '''

    photo_van = VANILLA_DIR + swatID + "_c.jpg"
    photo_mod = MOD_DIR + swatID + "_m.jpg"

    # Remove view permissions for vanilla and mod
    if os.path.isfile( photo_van ) :
        cmd = "sudo chmod 000 " + photo_van
        print(cmd)
        os.system(cmd)
    else:
        print("user " + swatID + " does not have a vanilla photo.")

    if  os.path.isfile( photo_mod ) :
        cmd = "sudo chmod 000 " + photo_mod
        print(cmd)
        os.system(cmd)
    else:
        print("user " + swatID + " does not have a modified photo.")

def restore_photo_view_permissions(swatID):
    '''
    Allow Apache to display photos of people who want their
    photo hidden or are removed from the Cygnet
    Param:
        swatID - swat ID/email username
    '''

    photo_van = VANILLA_DIR + swatID + "_c.jpg"
    photo_mod = MOD_DIR + swatID + "_m.jpg"

    # Restore view permissions for vanilla and mod
    if os.path.isfile( photo_van ) :
        cmd = "sudo chmod 644 " + photo_van
        print(cmd)
        os.system(cmd)
    else:
        print("user " + swatID + " does not have a vanilla photo.")

    if  os.path.isfile( photo_mod ) :
        cmd = "sudo chmod 644 " + photo_mod
        print(cmd)
        os.system(cmd)
    else:
        print("user " + swatID + " does not have a modified photo.")


def email_text(name) :
    '''
    Returns the text to send a user explaining how to refresh their browser
    cache and whatnot.
    '''

    #text = "Dear %s,\n\n" % name
    text = "Hi,\n\n"

    text += "\tThis is an email letting you know that the following " \
        "changes were made with regards to your Cygnet Profile: \n"

    for change in changesMade :
        text += "\t\t=> "
        text += change
        text += "\n"

    text += "\n\nYou may need to refresh your browser's cache in order to " \
            "see the changes, as it might remember the old picture in an " \
            "attempt to save bandwidth. You can see instructions on how to " \
            "do this at:\n" \
            "http://www.wikihow.com/Clear-Your-Browser's-Cache\n\n" \
            "\n\nPlease let us know if anything seems incorrect or we can" \
            " assist in any other way.\n\n" \
            "- SCCS"

    return text


def email(user):
    """
    Email a user reassuring them that their cygnet picture has been changed
    and including a link to how to refresh your browser cache.
    """
    text = email_text( user['first'] )
    print(text)

    if ( ask_yn("Send email above? ") ) :
        msg = MIMEText(text)

        msg['To'] = user['id'] + '@swarthmore.edu'
        msg['From'] = 'staff@sccs.swarthmore.edu'
        msg['Subject'] = 'Your Cygnet Profile'
        msg['Cc'] = 'staff@sccs.swarthmore.edu'
        # Added above line so that staff receives email. -CH18

        s = smtplib.SMTP('smtp.sccs.swarthmore.edu')
        s.set_debuglevel(1)
        s.starttls()
        try:
            s.sendmail(msg['From'], [msg['To']]+[msg['Cc']], msg.as_string())
            print('Emailed %s' % user['id'])
        except Exception as e:
            print('Failed to email %s: %s' % (user['id'], e))
            return None
        s.quit()

    return

def ask_yn(text):
    """
    Convenience function to ask a yes/no question and return True if the
    answer starts with 'y' (e.g. 'yes'), or False otherwise.
    """
    response = input(text + ' [y/N] ')
    return response.lower().startswith('y')


def require_sudo():
    """
    Function to ensure that script is always run by the super-user (at
    least for commands other than 'help'). If the effective user is not
    already the super-user, it prompts for the sudo password. If this
    authentication fails, it prints an error message and kills the script.
    """
    if os.geteuid() != 0 :
        print("\nYou must be super-user to run this script.")
        exit()
    return

def get_image_file_dims(picture_file):
    '''
    Call the ImageMagick 'identify' command to get the dimensions of an image
    filename, as a list of [width, height].
    '''
    identify = subprocess.Popen(['identify', '-format', '%w %h', picture_file],
                                stdout=subprocess.PIPE)
    id_result, _ = identify.communicate()
    return list(map(int, id_result.split()))

def resize_appropriately(source_file, target_file):
    '''
    Given an image, resize it to fit within the desired image sizes, storing
    the resulting image in target_file.  Returns True if resizing was done,
    False if it was not needed or if the user chose not to do it.
    '''
    # calculate ratios needed to resize each dimension into allowed space
    print("Got here 1")
    actual_x, actual_y = get_image_file_dims(source_file)
    x_ratio = IMAGE_X / actual_x
    y_ratio = IMAGE_Y / actual_y

    ratio = min(x_ratio, y_ratio, 1)
    # TODO - make sure ratio isn't too crazy
    if ratio == 1:
        pass
        #return False  # No point in doing resizing here
    x = ratio * actual_x
    y = ratio * actual_y

    # Resize

    print("Resizing command: ", end=' ')
    print(' '.join( ['convert', '-resize', '%dx%d' % (x, y),
                           source_file, target_file] ))

    subprocess.check_call(['convert', '-resize', '%dx%d' % (x, y),
                           source_file, target_file])
    return True


def replacePhoto( swatID ) :
    """
    Replace <swatID>'s photo with a new one that is input, resizing as
    needed.
    """
    photoName = input("Enter path to replacement photo for " + swatID + ": ")

    if not os.path.isfile( photoName ) :
        print("Error: File does not exist")
        exit(1)

    print("Resizing photo to appropriate size.")
    with tempfile.NamedTemporaryFile() as tmp :

        print("Calling resize_appropriately")
        resize_appropriately( photoName, tmp.name )

        cmd = "sudo cp " + tmp.name + " /srv/services/cygnet/media/photos/mod/"
        cmd += swatID + "_m.jpg"
        print(cmd)
        os.system( cmd )

        cmd = "sudo chmod 644 /srv/services/cygnet/media/photos/mod/" + swatID + "_m.jpg"
        print(cmd)
        os.system( cmd )

    changesMade.append("Your Cygnet photo was replaced")


def hideRoom( username, year="None" ) :
    """
    Modify settings.py and hide the photo associated with Swarthmore ID
    username
    """
    start = 0
    end = 0

    fd = open( SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of ROOM_HIDDEN section
    for i in range( len( lines ) ) :
        if lines[i].find( 'ROOM_HIDDEN' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            print("Looks like that user's room is already hidden!")
            return

        if lines[j].find( ']' ) != -1 :
            end = j
            break

    toAdd = "'" + username + "', #" + year

    newLines = lines[:end]
    newLines.append( toAdd )
    newLines.extend(lines[end:])
    newLines.extend(["", "", ""])

    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)

    print("\n\nCygnet room for ", username, " hidden successfully.\n")
    changesMade.append("Your Cygnet dorm room was hidden.")

def unHideRoom( username ) :
    """
    Modify settings.py and unhide the photo associated with Swat ID
    username
    """
    toRemove = -1

    fd = open(SETTINGS_FILE, 'r')
    lines = fd.readlines()
    fd.close()

    for i in range(len(lines)) :
        lines[i] = lines[i].strip()

    # Find beginning of ROOM_HIDDEN section
    for i in range( len( lines ) ) :
        if lines[i].find( 'ROOM_HIDDEN' ) != -1 :
            start = i;
            break;

    curStr = "'"+username+"'"

    for j in range( start, len(lines) ) :
        if lines[j].find( curStr ) != -1 :
            toRemove = j
            break

        if lines[j].find( ']' ) != -1 :
            print("Looks like that username's room isn't hidden!")
            return


    newLines = lines[:toRemove]
    newLines.extend(lines[toRemove + 1:])
    newLines.extend(["", "", ""])


    fd = open(SETTINGS_FILE, 'w')
    fd.write( '\n'.join( newLines ) )
    fd.close()

    print("\nRestarting apache")
    cmd = "sudo apache2ctl graceful"
    print(cmd)
    os.system(cmd)

    print("\n\nCygnet room for ", username, " unhidden successfully.\n")
    changesMade.append("Your Cygnet room was un-hidden.")
def main() :

    print("CygnetAdmin v 2.1")

    print("Before we go any further, I need to check that you're authorized")
    require_sudo()

    print("Backing up settings.py, just in case something goes awry.")
    cmd = "sudo cp " + SETTINGS_FILE + "  " + SETTINGS_FILE + ".bak"
    print(cmd)
    os.system(cmd)


    options = [
        "Replace a User's Photo",       #0
        "Hide a User's Photo",          #1
        "Un-Hide a User's Photo",       #2
        "Exclude a User ",              #3
        "Un-Exclude a User" ,           #4
        "Hide a User's Room Number",    #5
        "Un-Hide a User's Room Number", #6
        "Finished"                      #7
        ]


    print("Alrighty. Let's look up the user you want.")
    matches = get_matches( input("Enter search terms: ").split() )

    match = choose_user_from_results( matches )

    while ( 1 ) :
        for i in range(len(options)):
            print(str(i) + ": " + options[i])
        choice = get_answer_between(0, len(options) - 1)

        if choice == 0 :
            replacePhoto( match['id'] )
        elif choice == 1 :
            hidePhoto( match['id'], match['year'] )
        elif choice == 2 :
            unHidePhoto( match['id'] )
        elif choice == 3 :
            excludeUser( match['id'], match['year'] )
        elif choice == 4 :
            unExcludeUser( match['id'] )
        elif choice == 5 :
            hideRoom( match['id'], match['year'] )
        elif choice == 6 :
            unHideRoom( match['id'] )
        elif choice == 7 :
            break


    if ask_yn("Send an e-mail to " + match['id'] + "? ") :
        email( match )

    print("Have a nice day!")



main()