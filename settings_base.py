## settings_base.py
##
## This file defines the default configuration and it's imported by
## settings_dev.py and settings_server.py.  The actual deployed Cygnet should
## use a settings.py file with any private information (such as the list of
## excluded users) stored outside of Git.
#
# Installs should make a settings.py that imports from one of
# those (or this file) and sets (some of):
#   SECRET_KEY
#   DATABASES['default']['PASSWORD']
#   email settings

import os
BASE_PATH = os.path.abspath(os.path.dirname(__file__))

LOGIN_REDIRECT_URL="/"

ADMINS = MANAGERS = (
    ('SCCS Staff', 'staff@sccs.swarthmore.edu'),
)

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# TIME_ZONE = 'America/New_York'
TIME_ZONE=None # use system time zone

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = BASE_PATH + '/media'


# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = BASE_PATH + '/static'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    BASE_PATH + '/sitestatic',
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)


# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.contrib.messages.context_processors.messages",
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    BASE_PATH + '/templates',
)

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.flatpages',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',

    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

# Logging configuration.
# 1. send an email to the site admins on every HTTP 500 error.
# 2. setup logger for cygnet
# 3. logging handlers defined in settings_dev, settings_server
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'null': {
            'level':'DEBUG',
            'class':'django.utils.log.NullHandler',
        },
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
            'formatter': 'simple'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django': {
            'handlers': [],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'cygnet': {
            'handlers': [],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}

#### CYGNET Specific Settings ####


# This is the field order in that file.
FIELD_ORDER = ['last','first','middle','year','phone','email','dorm', 'dorm_room']

# A list of email usernames of students who have asked to be entirely
# removed from the Cygnet.
#   Ex: EXCLUDED_USERS = ['nfelt1']
EXCLUDED_USERS = []

# A list of email usernames of students who have asked to have their
# pictures hidden on the cygnet
#   Ex: PHOTO_HIDDEN = ['dfeista1']
PHOTO_HIDDEN = []


# Leaf directories NEED to have a trailing slash.

# The directory where photos are stored.
VANILLA_PHOTO_DIR =  '/photos/vanilla/'

# The directory where modified pictures of users are stored.
MOD_PHOTO_DIR =  '/photos/mod/'

# The path to the photo file to use for students with no photo (or a
# hidden photo).  Should be relative to PHOTO_DIRECTORY.
ALTERNATE_PHOTO = 'alternate.jpg'

# The postfix for modified pictures.
MOD_PHOTO_POSTFIX = '_m'

# The postfix for vanilla pictures (i.e. from ITS DB)
VANILLA_PHOTO_POSTFIX = '_c'

# temporary directory for picture processing
TMP_DIR = '/tmp/'

# directory for useful assets
ASSET_DIR = '/assets/'


CAMPUS_IPS="130.58."
