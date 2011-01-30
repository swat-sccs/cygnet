###
### ========================
###       config.py
### ========================
###
### The configuration file for the Python code behind the Cygnet.
### Defines variables that store configuration settings for cygnetxml.py.
###
### LAST MODIFIED: 1/27/11 by nfelt1
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

# Character used to delimit fields
DELIMITING_CHAR = '\t'

# Path to the error log file
LOG_FILENAME = 'cygnet_errors.log'
