from settings_base import *

TEMPLATE_DEBUG = DEBUG = True

FORCE_SCRIPT_NAME = ''
ADMIN_MEDIA_PREFIX = '/admin_media/'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'cygnet_dev.sqlite3'
    }
}

handlers = ['console']
LOGGING['loggers']['cygnet']['handlers'] = handlers
LOGGING['loggers']['django']['handlers'] = handlers

STATICFILES_DIRS = (
    BASE_PATH + '/sitestatic/',
)
