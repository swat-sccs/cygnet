# Cygnet

The Cygnet is a Django web app that allows students to look up students before they meet them. It does this by pulling from the ITS student directory. The idea is to make it easier to put names to faces and make first-time-meetings less awkward.

We also use the Cygnet to host April Fools jokes.

## Table of Contents
* [Development Setup](#development-setup)
  * [Using Docker](#using-docker)
  * [Unix](#unix)
  * [Windows](#windows)
* [LDAP Mock Database](#ldap-mock-database)

## Development Setup
The "dev" branch is the default branch for this project. You will write new features for the Cygnet here by making feature branches off of this one. The following will get you set up with running the Cygnet on your computer.

### Using Docker
Install docker and docker-compose onto your machine and run the following:
```bash
# 1. Clone the repo
git clone https://github.com/swat-sccs/cygnet.git
cd cygnet

# 2. Set up containers
docker-compose up
# In a separate shell
docker exec -it cygnet-db sh -c 'mysql -u root -p < /scripts/mock_its_db_setup.sql'

# 3. Visit localhost:8000
```

Comment out the Docker specific configs in <code>settings_server.py</code> and <code>settings.py</code> and uncomment the Local configs if you are not using Docker.
### Unix
```bash
# Bash

# 1. Clone the repo and set up the virtual environment
git clone https://github.com/swat-sccs/cygnet.git
cd cygnet && virtualenv venv

# 2. Activate the virtual environment and install the required packages
. ./venv/bin/activate
pip install -r requirements.txt

# 3. Build the static files folder and migrate tables
python manage.py collectstatic
python manage.py migrate

# 4. Run ldap_setup.sh in Debian instance
sudo ./ldap_setup.sh

# 5a. Change default profile picture path
...
# In scripts/mock_its_db_setup.sql
SET @profile_path = "/PATH/TO/media/its_photos/profile.jpg";
...

# 5b. Run mock_its_db_setup.sql
mysql -u root -p < "/PATH/TO/scripts/mock_its_db_setup.sql"
Enter password: # No passwd

# 6. Run dev server
python manage.py runserver
```
### Windows
You will need to install the [python-ldap windows binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/) and [XAMPP](https://www.apachefriends.org/download.html) and set up [Debian on WSL2](https://wiki.debian.org/InstallingDebianOn/Microsoft/Windows/SubsystemForLinux). 
```powershell
# PowerShell

# 1. Clone the repo and set up the virtual environment
git clone https://github.com/swat-sccs/cygnet.git
cd cygnet
virtualenv venv

# 2. Activate the virtual environment and install the required packages
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
. ./venv/bin/activate
pip install [path-to-python-ldap-windows-binary]
pip install -r requirements.txt

# 3. Activate Apache and MySql XAMPP services

# 4. Build the static files folder and migrate tables
python manage.py collectstatic
python manage.py migrate

# 5. Run ldap_setup.sh in Debian instance
sudo ./ldap_setup.sh

# 6a. Change default profile picture path
...
# In scripts/mock_its_db_setup.sql
SET @profile_path = "/PATH/TO/media/its_photos/profile.jpg";
...

# 6b. Run mock_its_db_setup.sql in XAMPP shell
mysql -u root -p < "/PATH/TO/scripts/mock_its_db_setup.sql"
Enter password: # No passwd

# 7. Run dev server
python manage.py runserver
```

## LDAP Mock Database

The ldif directory contains data that will be loaded into the LDAP mock database. It comes with two users, alice and bob. Their passwords are both "password."

If you want to add more users, it may be easier to edit the ldif file and rebuild the cygnet-ldap image than to use the command line within the container.

