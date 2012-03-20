from django.shortcuts import render,redirect
from django.http import Http404, HttpResponse
from django.contrib import auth
from django.contrib.auth.decorators import login_required

from backend import configureLogging, recordtime, parse_form, get_matches
import sys, json, logging

def home(request):
    return render(request, 'home.html', {})

def backend(request):
    payload = None
    try:
        configureLogging()
        logging.debug("=== Running cygnetxml.py. ===")
        recordtime()
        terms = parse_form()
        payload = {'data': get_matches(terms)}
    except:
        exception, value = sys.exc_info()[:2]
        error_info = {
            'exception': str(exception),
            'value': str(value),
            'traceback': traceback.format_exc(),
            }
        payload = {'error': error_info}

    output = json.dumps(payload)
    logging.debug("Size of data returned: %i chars or %g KB." %
                  (len(output), len(output) / 1024.0))
    logging.debug("Total time elapsed in backend.py: %.3g seconds" %
                  recordtime())

    return HttpResponse(output, content_type='application/json')
