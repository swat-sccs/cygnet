## settings_base.py
##
## The Cygnet settings model borrows from the way Django app settings
## work even though it's not a Django app (as of now).  This file
## defines the default configuration for backend.py, and it's imported
## by settings_dev.py and settings_server.py.  The actual deployed
## Cygnet should use a settings.py file with any private information
## (such as the list of excluded users) stored outside of Git.

# This is the file (or symlink) that contains the tab-separated data
# for the housing directory.
#   Ex: DIRECTORY_FILE = '/usr/sccs/pub/dir/current'
DIRECTORY_FILE = ''

# This is the field order in that file.
FIELD_ORDER = ['last','first','middle','year','phone','email','address']

# Character used to delimit fields in the directory file.
DELIMITING_CHAR = '\t'

# This is a list of class years to show, as strings.  Typically the usual
# four, which means we have to update this every fall for the freshmen.
#   Ex: CLASS_YEARS = ['2011', '2012', '2013', '2014']
CLASS_YEARS = []

# A list of email usernames of students who have asked to be entirely
# removed from the Cygnet.
#   Ex: EXCLUDED_USERS = ['nfelt1']
EXCLUDED_USERS = []

# The directory where photos are stored, in folders by class year.
PHOTO_DIRECTORY = 'photos'

# The path to the photo file to use for students with no photo (or a
# hidden photo).  Should be relative to PHOTO_DIRECTORY.
ALTERNATE_PHOTO = 'alternate.jpg'

# Logging parameters
class LOGPARAMS:
    FILENAME = 'cygnet.log'
    FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
    FILESIZE_KB = 50
    BACKUP_COUNT = 1

