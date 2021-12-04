#!/bin/bash

# Sets up an ldap server for authentication
# Follows https://devconnected.com/how-to-setup-openldap-server-on-debian-10/

# -----------------------------------------------------------------------------
# Helper functions
#
function add_user_account_group() {
    entry="dn: ou=People,dc=localdomain
objectClass: organizationalUnit
ou: People"
    echo "$entry" >> $1
    echo "" >> $1
}

function add_user_group_group() {
    entry="dn: ou=Group,dc=localdomain
objectClass: organizationalUnit
ou: Group"
    echo "$entry" >> $1
    echo "" >> $1
}

function add_user() {
    # 1: name, 2: password, 3: uidnumber, 4: file
    add_user_account $1 $2 $3 $4
    add_user_group $1 $3 $4
}

function add_user_account() {
    local entry="dn: uid=$1,ou=People,dc=localdomain
objectClass: top
objectClass: account
objectClass: posixAccount
objectClass: shadowAccount
cn: $1
uidNumber: $3
gidNumber: $3
homeDirectory: /home/$1
userPassword: $2
loginShell: /bin/bash"

    echo "$entry" >> $4
    echo "" >> $4
}

function add_user_group() {
    local entry="dn: cn=$1,ou=Group,dc=localdomain
objectClass: posixGroup
cn: $1
gidNumber: $2"

    echo "$entry" >> $3
    echo "" >> $3
}

# -----------------------------------------------------------------------------
# Start of setup

# Require superuser
if [[ $EUID > 0 ]]; then 
    echo "Please run as root"
    exit
fi

# Install ldap and its utilities
apt-get install slapd
apt-get install ldap-utils

# Turn on ldap server
/etc/init.d/slapd start

# Add users group
FILE=/etc/ldap/slapd.d/users.ldif
if [ ! -f "$FILE" ]; then
    add_user_account_group $FILE
    add_user_group_group $FILE
else
    echo "" > $FILE
    add_user_account_group $FILE
    add_user_group_group $FILE
fi
echo "Adding $FILE to db"
ldapadd -x -D "cn=admin,dc=localdomain" -W -H ldapi:/// -f $FILE

# Add sample users
FILE=/etc/ldap/slapd.d/new_users.ldif
if [ -f "$FILE" ]; then
    echo "" > $FILE
else
    touch $FILE
fi

add_user alice password 10000 $FILE
add_user bob password 10001 $FILE
add_user_group staff 20000 $FILE

echo "Adding $FILE to db"
ldapadd -x -D "cn=admin,dc=localdomain" -W -H ldapi:/// -f $FILE