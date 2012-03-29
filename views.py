from __future__ import absolute_import

from django.conf import settings
from django.shortcuts import render,redirect
from django.http import Http404, HttpResponse
from django.contrib import auth
from django.contrib.auth       import REDIRECT_FIELD_NAME
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth.decorators import login_required
from django.utils.decorators   import available_attrs

from backend import recordtime, terms_to_dict, get_matches
import sys, json, logging, traceback

import urlparse
from functools import wraps


################################################################################
### Helpers for authentication

def user_authenticated(request):
    '''
    Checks that the user is allowed to see this page, i.e. one of the following:
        - They're on campus (so have an acceptable IP)
        - They're logged in and have the proper permissions
    '''
    # check the IP address
    if 'HTTP_X_FORWARDED_FOR' in request.META:
        if request.META['HTTP_X_FORWARDED_FOR'].startswith(settings.CAMPUS_IPS):
            return True
    elif 'REMOTE_ADDR' in request.META:
        if request.META['REMOTE_ADDR'].startswith(settings.CAMPUS_IPS):
            return True

    # check user permissions
    if request.user.is_authenticated():
        return True

    # nope!
    return False

def redirect_to_login_and_back(request, login_url=None,
                               redirect_field_name=REDIRECT_FIELD_NAME):
    path = request.build_absolute_uri()
    if not login_url:
        login_url = settings.LOGIN_URL

    # If the login url is the same scheme and net location then just
    # use the path as the "next" url.
    login_scheme, login_netloc = urlparse.urlparse(login_url)[:2]
    current_scheme, current_netloc = urlparse.urlparse(path)[:2]
    if ((not login_scheme or login_scheme == current_scheme) and
        (not login_netloc or login_netloc == current_netloc)):
        path = request.get_full_path()
    return redirect_to_login(path, login_url, redirect_field_name)


def checks_user_auth(function=None, redirect_field_name=REDIRECT_FIELD_NAME):
    '''
    Decorator for views that checks that the user is properly authenticated
    using user_authenticated(), redirecting to the log-in page if necessary.
    '''
    # based on django.contrib.auth.decorators.user_passes_test
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            if not user_authenticated(request):
                return redirect_to_login_and_back(request)
            return view_func(request, *args, **kwargs)
        return _wrapped_view

    if function:
        return decorator(function)
    return decorator


### regular stuff

@checks_user_auth
def home(request):
    params = {}
    if request.GET.get('debug', None):
        params['cygnet_debug'] = True

    params['search_terms'] = request.GET.get('terms', '')
    return render(request, 'home.html', params)

def backend(request):
    if not user_authenticated(request):
        response = HttpResponse('you must be logged in to access the backend.', content_type='text/plain')
        response.status_code=403
        return response

    recordtime()
    terms = terms_to_dict(request.GET.get('terms', ''))
    payload = {'data': get_matches(terms)}

    output = json.dumps(payload)
    logging.debug("Size of data returned: %i chars or %g KB." %
                  (len(output), len(output) / 1024.0))
    logging.debug("Total time elapsed in backend.py: %.3g seconds" %
                  recordtime())

    return HttpResponse(output, content_type='application/json')

from django.contrib.auth.views import login as native_login
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login

@csrf_exempt
def login(request, *args, **kwargs):
    print request.method, request.GET
    if request.method == 'GET' and 'csrf' in request.GET:
        csrf_token = csrf(request)['csrf_token']
        return HttpResponse(csrf_token, content_type='text/plain')

    if request.method == 'POST' and 'api' in request.POST:
        print "using api login"
        user = authenticate(username=request.POST.get('username', ''), password=request.POST.get('password', ''))
        if user is not None and user.is_active:
            auth_login(request, user)
            return HttpResponse('authenticated', content_type='text/plain')
        else:
            return HttpResponse('not authenticated', content_type='text/plain', status_code=403)

    return native_login(request, *args, **kwargs)

