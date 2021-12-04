#!/bin/bash
# Used by docker to start processes
/cygnet/scripts/django_db_setup.sh
echo "yes" | python manage.py collectstatic
gunicorn --bind 0.0.0.0:8000 wsgi
