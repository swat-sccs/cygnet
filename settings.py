from settings_server import *

SECRET_KEY = "secret"

DATABASES['default']['PASSWORD'] = ''

""" 
Local dev
ITS_DB_DATA = {
    'host': 'localhost',
    'user': 'root',
    'passwd': 'password',
    'db': 'its_cygnet'
}
"""

# Docker
ITS_DB_DATA = {
    'host': 'cygnet-db',
    'user': 'root',
    'passwd': 'password',
    'db': 'its_cygnet'
}

PHOTO_HIDDEN = [

]

ROOM_HIDDEN = [
    
]