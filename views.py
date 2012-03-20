from django.shortcuts import render,redirect
from django.http import Http404
from django.contrib import auth
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'home.html', {})
