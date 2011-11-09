from settings_base import *

DIRECTORY_FILE = '/usr/sccs/pub/dir/current'

# Disable logging on the server by default.
LOGPARAMS.FILENAME = '/dev/null'
#LOGPARAMS.FILENAME = '/var/log/cygnet/cygnet.log'
LOGPARAMS.FILESIZE_KB = 1024
LOGPARAMS.BACKUP_COUNT = 10
