#!/usr/bin/env python
"""
PLEASE DO NOT EDIT THIS FILE ON THE LIVE SERVER. USE THE GIT VERSION IN

    /Services/Git/sccs-cygnetadmin.git

AND THEN DEPLOY IT WITH THE deploy.sh SCRIPT.

------------------------------------------------------

This python script automates the hiding, showing, and replacing of pictures
in the SCCS online cygnet. Try 'cygnetadmin help' to show basic syntax and
commands. The script requires sudo to run (aka it's not executable by others)
because it modifies files in /Web/cygnet that require sudo access anyway.

NOTE: the script also has to be run from gwaihir (aka ServiceServer) because
it controls /Web/cygnet.

Initially written by Nick Felt, 1/26/11.
Modified by Alex Burka, 2/3/11, to add the email command.
Modified by Dougal Sutherland, 3/28/11, to add the emailtext command.
Modified by Dougal/Steve/Henry, 3/30/11, to add the replace-resized command.
Modified by Steve Dini 7/24/11 to check for recent picture replacement for same
                               person
Modified by Nick Felt, 7/25/11, to merge the previous two changes. Fixed
    a few bugs in both changes, and folded the replaced-resized command in
    as just an offer to resize if needed when the replace command runs.  Also,
    I put this in a git repo so we could stop listing modfiications here :)
Modified by Andrew Stromme, 7/25/11, to add the message reminding us to use git.
"""

# TODO - email_text should use first name (probably switch lookup to namedtuple
#        to easily have access to both first/last and combined names)
# TODO - better interactive flow for replace-resized
# TODO - support the new "remove" mechanism to completely hide people
# TODO - add cygnet-replace, cygnet-hide, cygnet-remove commands which
#        take a forwarded user email, replace pictures with an attachment,
#        hide their picture, or remove them completely based on guessing
#        their username from the From address or whatever

from __future__ import division

import os
import time
import subprocess
from sys import argv
import smtplib
import tempfile
from email.mime.text import MIMEText

DIRECTORY = "/usr/sccs/pub/dir/current"
CYGNET_PHOTO_ROOT = "/Web/cygnet/photos"
PHOTO_EXT = ".jpg"
HIDDEN_SUFFIX = ".hidden"
REPLACED_SUFFIX = ".replaced"
PHOTO_ALT_FILE = "./alternate.jpg"
SUPER_USER = "root"
IMAGE_X = 105
IMAGE_Y = 130
DAYS=7

def lookup(user, do_print=True):
    """
    Uses provided search term "user" to pull user info from the
    cygnet directory in the file DIRECTORY.  Assumes this format:
    
    LAST FIRST YEAR PHONE EMAIL_USERNAME ...

    Returns a tuple of (name, year, username) or None if no user found.
    """
    command = "grep -i \"%s\" %s" % (user, DIRECTORY)
    records = run(command, True)
    if not records:
        if do_print:
            print "No match found."
        return None
    elif len(records) > 1:
        if do_print:
            print "Found %d matches:" % len(records)
            for r in records:
                print " -", r
        return None
    record = records.pop().split('\t')
    name = record[1] + ' ' + record[0]
    year = int(record[3])
    username = record[5]
    info = name, year, username

    if do_print:
        print ' '.join(map(str, info))
    return info

def photo_path(info):
    '''
    Return where a photo file should be for a given year / username.
    '''
    name, year, username = info
    return CYGNET_PHOTO_ROOT + '/' + str(year) + '/' + username + PHOTO_EXT


def check(user):
    """
    Checks the photo status of the supplied user by calling lookup() and
    then printing A) whether the photo was found, B) the last-modified
    time if it was found, and C) whether the photo is anonymous (symlinked).
    Returns a tuple of (status, <info tuple from lookup>, photo file path).
    """
    print "Checking user: %s" % user
    info = lookup(user)
    if not info:
        return 'nouser', None, None
    photofile = photo_path(info)

    try:
        mtime = os.path.getmtime(photofile)
    except IOError:
        print "Photo not found at: '%s'" % photofile
        return 'notfound', info, None
    else:
        lastmod = time.asctime(time.localtime(mtime))
        if os.path.islink(photofile):
            print "Anonymous photo - hidden:", lastmod

            return 'link', info, photofile
        else:
            print "Photo last modified:", lastmod
            return 'valid', info, photofile

def check_string(user):
    import sys
    from StringIO import StringIO

    old_stdout = sys.stdout
    sys.stdout = StringIO()

    check(user)

    checked = sys.stdout.getvalue()
    sys.stdout = old_stdout

    return checked

def hide(user):
    """
    Hides the photo for the supplied user if it exists. Moves it to a file
    like '<photofile_path>.hidden#' where # is incremented so that successive
    hidings don't overwrite each other (yeah, overkill, but I was bored) and
    replaces the original file with a symbolic link to the alternate image.
    """
    (status, info, photofile) = check(user)
    if not (status == 'valid' and os.path.isfile(photofile)):
        if status == 'link':
            print "Photo is already hidden."
        return None
    hiddenfile = getlatestbackup(photofile + HIDDEN_SUFFIX, True)
    if ask_yn("Move file '%s' to '%s'?" % (photofile, hiddenfile)):
        subprocess.check_call(['sudo', 'mv', photofile, hiddenfile])
        subprocess.check_call(['sudo', 'ln', '-s', PHOTO_ALT_FILE, photofile])
        print "Photo successfully hidden."
        return True
    return None        

def restore(user):
    """
    Un-hides the photo for the supplied user by reversing hide() - deletes
    the symbolic link currently in place, and moves the most recent hidden
    photo back to the original location.
    """
    (status, info, photofile) = check(user)
    if not (status == 'link' and os.path.isfile(photofile)):
        if status == 'valid':
            print "Photo is already present."
        return None
    hiddenfile = getlatestbackup(photofile + HIDDEN_SUFFIX)
    if hiddenfile is None:
        print "No hidden file to restore."
        return None
    if ask_yn("Move file '%s' to '%s'?" % (hiddenfile, photofile)):
        subprocess.check_call(['sudo', 'rm', photofile])
        subprocess.check_call(['sudo', 'mv', hiddenfile, photofile])
        print "Photo successfully restored."
        return True
    return None        

def replace(user, newfile):
    """
    Replaces the photo for the supplied user with the file at the given
    filepath (assuming the file is valid).  Offers to resize the photo to
    the standard dimensions if needed.  Moves the original photo to a
    file like '<photofile_path>.replaced#' where # again is an incrementing
    backup number, and copies the supplied file to the location of the
    original.  Chmods the new file to mode 644 (rw-r--r--) so it is readable
    by Apache.
    """
    (status, info, photofile) = check(user)
    if not (status in ('link', 'valid') and os.path.isfile(photofile)):
        return None
    if not os.path.isfile(newfile):
        print "Not a valid replacement file."
        return None
    if recent_update(photofile, DAYS):
        msg = "The user %s had their picture changed within the last %d days.\
               \nAre you sure you want to proceed?" % (user, DAYS)
        if not ask_yn(msg):
          return None

    # resize into a tempfile
    with tempfile.NamedTemporaryFile() as tmp:
        if resize_appropriately(newfile, tmp.name):
            newfile = tmp.name
        backupfile = getlatestbackup(photofile + REPLACED_SUFFIX, True)
        type = 'link' if status == 'link' else 'file'
        if ask_yn("Non-destructively replace %s '%s' with '%s'?" % (type, photofile, newfile)):
            if type == 'link':
                subprocess.check_call(['sudo', 'rm', photofile])
            else:
                subprocess.check_call(['sudo', 'mv', photofile, backupfile])
            subprocess.check_call(['sudo', 'cp', newfile, photofile])
            subprocess.check_call(['sudo', 'chmod', '644', photofile])
            print "Photo successfully replaced."
            return True

def email_text(user, automated=False):
    '''
    Returns the text to send a user explaining how to refresh their browser
    cache and whatnot.
    '''

    info = lookup(user)
    if not automated:
        print
    text = "Dear %s,\n\n" % info[0]

    if automated:
        text += "This is a somewhat-automated email informing you that " \
                "your cygnet picture has been changed:"
    else:
        text += "I've just changed your cygnet picture:"
    text += "\nhttp://cygnet.sccs.swarthmore.edu/index.php?terms=%s" % user

    text += "\n\nYou may need to refresh your browser's cache in order to " \
            "see the changes, as it might remember the old picture in an " \
            "attempt to save bandwidth. You can see instructions on how to " \
            "do this at:\n" \
            "http://www.wikihow.com/Clear-Your-Browser's-Cache\n\n" \
            "- SCCS"

    return text


def email(user):
    """
    Email a user reassuring them that their cygnet picture has been changed
    and including a link to how to refresh your browser cache.
    """
    msg = MIMEText(email_text(user, automated=True))
    
    info = lookup(user, False)
    msg['To'] = info[2] + '@swarthmore.edu'
    msg['From'] = 'staff@sccs.swarthmore.edu'
    msg['Subject'] = 'cygnet'

    s = smtplib.SMTP()
    s.connect()
    try:
        s.sendmail(msg['From'], [msg['To']], msg.as_string())
        print 'Emailed %s' % info[0]
    except Exception, e:
        print 'Failed to email %s: %s' % (info[0], e)
        return None
    s.quit()


def get_image_file_dims(picture_file):
    '''
    Call the ImageMagick 'identify' command to get the dimensions of an image
    filename, as a list of [width, height].
    '''
    identify = subprocess.Popen(['identify', '-format', '%w %h', picture_file],
                                stdout=subprocess.PIPE)
    id_result, _ = identify.communicate()
    return map(int, id_result.split())

def resize_appropriately(source_file, target_file):
    '''
    Given an image, resize it to fit within the desired image sizes, storing
    the resulting image in target_file.  Returns True if resizing was done,
    False if it was not needed or if the user chose not to do it.
    '''
    # calculate ratios needed to resize each dimension into allowed space
    actual_x, actual_y = get_image_file_dims(source_file)
    x_ratio = IMAGE_X / actual_x
    y_ratio = IMAGE_Y / actual_y

    ratio = min(x_ratio, y_ratio, 1)
    # TODO - make sure ratio isn't too crazy
    if ratio == 1: return False  # No point in doing resizing here
    x = ratio * actual_x
    y = ratio * actual_y

    if ask_yn("Resize %dx%d image to %dx%d?" % (actual_x, actual_y, x, y)):
        # Do the actual resizing
        subprocess.check_call(['convert', '-resize', '%dx%d' % (x, y),
                               source_file, target_file])
        return True
    return False

def run(command, asList=False):
    """
    Convenience function to run a shell command using the subprocess module.
    This should be replaced by subprocess.check_output(), but it requires
    python 2.7 and I didn't want to bother to upgrade. Also, this returns
    the output as a list of lines with 'aslist=True', which is somewhat useful.
    """
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
    try:
        (stdout, stderr) = p.communicate()
    except KeyboardInterrupt:
        stdout = '';
    output = stdout.rstrip()
    if output:
        return output if not asList else output.split('\n')
    return '' if not asList else []

def getlatestbackup(photofile, increment=False):
    """
    Used to do incrementing backups of the given photofile. Normally returns
    the path corresponding to the file of form '<photofile>#' where # is the
    greatest of all paths of that form. If the optional increment argument
    is passed, it returns not the latest backup, but the path corresponding
    to the backup one greater than the latest backup. If this argument is
    not passed and there is no latest backup, it returns None.
    """
    (dirname, filename) = os.path.split(photofile)
    backups = run("ls -1 %s | grep ^%s.*$" % (dirname, filename))
    if not backups:
        if increment:
            return photofile + '1'
        return None
    suffixes = [file.replace(filename, '') for file in backups]
    maxnum = max(map(int, filter(lambda n : n.isdigit(), suffixes)))
    latestbackup = photofile + str(maxnum)
    assert os.path.isfile(latestbackup)
    return latestbackup if not increment else photofile + str(maxnum + 1)

def ask_yn(text):
    """
    Convenience function to ask a yes/no question and return True if the
    answer starts with 'y' (e.g. 'yes'), or False otherwise.
    """
    response = raw_input(text + ' [y/N] ')
    return response.lower().startswith('y')

def recent_update(filename, numdays):
  """
  Returns true if 'filename' was last modified within 'days' days.
  """
  mtime = os.path.getmtime(filename)  # Expressed in seconds since the epoch
  interval = 24 * 60 * 60 * DAYS      # Expressed in seconds
  return time.time() - mtime < interval

def require_sudo():
    """
    Function to ensure that script is always run by the super-user (at
    least for commands other than 'help'). If the effective user is not
    already the super-user, it prompts for the sudo password. If this
    authentication fails, it prints an error message and kills the script.
    """
    if run('sudo whoami') != SUPER_USER:
        print "\nYou must be super-user to run this script."
        exit()
    return

def usage():
    print """
Syntax is 'cygnetadmin command [user] [file]'.
Commands are as follows:
- help                      print this help
- check <user>              check current cygnet photo status
- hide <user>               hide a user's active photo
- restore <user>            un-hide a user's most recent hidden photo
- replace <user> <file>     replace a user's photo with the provided file
                            (via copying), with the option to resize
- email <user>              email a user, telling them their status and
                            reminding them to refresh their browser cache
- emailtext <user>          print out the text that 'email' would send to a
                            user, for copy-pasting

Notes:
* Must be run from ServiceServer in order to modify files on /Web.
* Executing any command except 'help' requires superuser privileges.
* The 'replace' command is non-destructive, i.e. it moves the current
photo to a backup location (typically 'photo.jpg.replaced#') before copying
the new file into place. Hence, you can restore old photos if necessary.
* The 'user' parameter is just a search string for the housing directory
file - so it doesn't have to be a full email username, just enough to
uniquely identify a single student (e.g. 'nfel' for 'nfelt1'). If multiple
records match, they will be displayed in a list.
"""
    exit()

def main():
    """
    Defines the list of commands, processes the arguments to the script
    to make sure they're valid, and calls the appropriate command (or
    prints usage() if the syntax is incorrect).
    """
    commands = {
        'help': 0,
        'check': 1,
        'hide': 1,
        'restore': 1,
        'replace': 2,
        'email': 1,
        'emailtext': 1,
        }

    if len(argv) < 2:
        print "Not enough arguments."
        usage()
    command = argv[1]
    if command not in commands.keys():
        print "Unrecognized command."
        usage()
    argreq = commands[command]
    if len(argv) - 2 < argreq:
        print "This command requires %d argument%s." % (argreq, '' if argreq == 1 else 's')
        usage()

    user = argv[2] if argreq >= 1 else None
    file = argv[3] if argreq >= 2 else None

    if command == 'help':
        usage()
    else:
        require_sudo()
        if command == 'check':
            check(user)
        elif command == 'hide':
            hide(user)
        elif command == 'restore':
            restore(user)
        elif command == 'replace':
            replace(user, file)
        elif command == 'email':
            email(user)
        elif command == 'emailtext':
            print email_text(user)

if __name__ == '__main__':
    main()
