import os
import sys

# Activate your virtual env
activator = "/srv/services/cygnet/bin/activate_this.py"
with open(activator) as fp:
    exec(fp.read(), {"__file__": activator})

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

application = get_wsgi_application()
