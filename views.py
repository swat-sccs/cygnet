from django.shortcuts import render,redirect
from django.http import Http404, HttpResponse
from django.contrib import auth
from django.contrib.auth.decorators import login_required

from backend import configureLogging, recordtime, terms_to_dict, get_matches
import sys, json, logging, traceback

def home(request):
    params = {}
    if request.GET.get('debug', None):
        params['cygnet_debug'] = True
    return render(request, 'home.html', params)

def backend(request):

    configureLogging()
    recordtime()
    terms = terms_to_dict(request.GET.get('terms', ''))
    payload = {'data': get_matches(terms)}

    output = json.dumps(payload)
    logging.debug("Size of data returned: %i chars or %g KB." %
                  (len(output), len(output) / 1024.0))
    logging.debug("Total time elapsed in backend.py: %.3g seconds" %
                  recordtime())

    return HttpResponse(output, content_type='application/json')
