###
### ========================
###       config.py
### ========================
###
### The configuration file for the Python code behind the Cygnet.
### Defines variables that store configuration settings for backend.py.
###

# This is the file (or symlink) that contains the
# tab-separated values for the housing directory.
# directory_file = '/usr/sccs/pub/dir/current'
DIRECTORY_FILE = 'directories/f10_dir.txt'

# This is the field order in that file.
FIELD_ORDER = ['last','first','middle','class','phone','email','address']

# This is a list of class years to show (should be
# the usual 4).  The order listed here is the order
# they'll show up in the page.
CLASS_YEARS = ['2011', '2012', '2013','2014']

# A list of email usernames of students who have asked to be entirely
# removed from the Cygnet.
EXCLUDED_USERS = []

# Character used to delimit fields
DELIMITING_CHAR = '\t'

# Logging parameters
class LOGPARAMS:
    FILENAME = 'logs/cygnet.log'
    FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
    FILESIZE_KB = 50
    BACKUP_COUNT = 3

