from settings_base import *

DEBUG = TEMPLATE_DEBUG = True

URL = 'https://cygnet.sccs.swarthmore.edu'
FORCE_SCRIPT_NAME = '' # for mod_wsgi
STATIC_URL = '/static/'

from django.urls import set_script_prefix

# this gets overriden by the wsgi handler, but this fixes it from manage.py
set_script_prefix('/')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME':   'cygnet',
        'USER':   'root',
        'HOST':   'localhost',
        'PORT':   '3306'
    } # set 'PASSWORD' in settings.py
}

LOGGING['handlers']['cygnet'] = {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'formatter': 'verbose',
            'filename': './log/cygnet.log',
}
LOGGING['handlers']['cygnet_debug'] = {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'formatter': 'verbose',
            'filename': './log/cygnet.log.debug',
}


handlers = ['cygnet', 'cygnet_debug']

LOGGING['loggers']['cygnet']['handlers'] = handlers
LOGGING['loggers']['django']['handlers'] = handlers

# LDAP authentication stuff
import ldap
from django_auth_ldap.config import LDAPSearch, PosixGroupType

AUTHENTICATION_BACKENDS = (
        'django_auth_ldap.backend.LDAPBackend',
        'django.contrib.auth.backends.ModelBackend',
)

# Local
# AUTH_LDAP_SERVER_URI = 'ldap://127.0.0.1:389'
# Docker
AUTH_LDAP_SERVER_URI = 'ldap://ldap:389'
BASEDN = 'dc=localdomain'

AUTH_LDAP_BIND_DN = 'cn=admin,dc=localdomain'
AUTH_LDAP_BIND_PASSWORD = 'admin'
AUTH_LDAP_USER_SEARCH = LDAPSearch('ou=People,%s' % BASEDN, ldap.SCOPE_SUBTREE,
                                           '(uid=%(user)s)')
AUTH_LDAP_GROUP_SEARCH = LDAPSearch('ou=Group,%s' % BASEDN, ldap.SCOPE_SUBTREE,
                                            '(objectClass=posixGroup)')
AUTH_LDAP_GROUP_TYPE = PosixGroupType()
AUTH_LDAP_USER_ATTR_MAP = {'email': 'swatmail'}
AUTH_LDAP_USER_FLAGS_BY_GROUP = {
        'is_staff': 'cn=staff,ou=Group,%s' % BASEDN,
        'is_superuser': 'cn=staff,ou=Group,%s' % BASEDN
}
