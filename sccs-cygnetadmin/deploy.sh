#!/bin/bash

# Deploys the cygnet admin script to the appropriate location
# and installs a symlink to that file in a folder on the PATH.

SCRIPTNAME=cygnetadmin.py
CYGNETDIR=/Web/cygnet/
CYGNETPATH=$CYGNETDIR$SCRIPTNAME

CMDNAME=$(basename $SCRIPTNAME .py)
CMDDIR=/usr/sccs/bin/
CMDPATH=$CMDDIR$CMDNAME

sudo cp ./$SCRIPTNAME $CYGNETPATH
sudo chmod ug+x $CYGNETPATH
ln -sf $CYGNETPATH $CMDPATH
