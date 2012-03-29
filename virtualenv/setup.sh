#!/bin/sh

DIR=`dirname $0`

## gwaihir seems to dislike the --prompt arg, so we'll just ignore it. - Andrew Stromme 7.18.2011
#virtualenv --distribute . --prompt "(sccs-guts)"
virtualenv --distribute $DIR 
## virtualenv doesn't clean up after itself - nfelt1 29 Oct 2011.
rm -f /tmp/distribute*.tar.gz
pip install --upgrade -E $DIR -r $DIR/requirements.txt $*
