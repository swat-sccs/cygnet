#!/bin/bash

service mysql start
echo "create database cygnet" | mysql
python manage.py migrate