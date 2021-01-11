# Cygnet

The Cygnet is a Django a web app that allows students to look student up before they meet them. It does this by pulling from the ITS student directory. The idea is to make it easier to put names to faces and make first-time-meetings less awkward.

We also use the Cygnet to host April Fools jokes.

## Development Setup
The default branch is the "main" branch which is also where you will write new features for the Cygnet. The following will get you set up with running the Cygnet on your computer.

### Unix
```bash
# 1. Clone the repo and set up the virtual environment
> git clone https://github.com/swat-sccs/cygnet.git
> cd cygnet && virtualenv venv
# 2. Activate the virtual environment and install the required packages
> . ./venv/bin/activate
> pip install -r requirements.txt
# Build the static files folder and migrate tables
> python manage.py collectstatic
> python manage.py migrate
```
### Windows
You will need to install the [python-ldap windows binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/) and [XAMPP](https://www.apachefriends.org/download.html) and set up [Debian on WSL2](https://wiki.debian.org/InstallingDebianOn/Microsoft/Windows/SubsystemForLinux). 
```powershell
# 1. Clone the repo and set up the virtual environment
> git clone https://github.com/swat-sccs/cygnet.git
> cd cygnet && virtualenv venv
# 2. Activate the virtual environment and install the required packages
> . ./venv/bin/activate
> pip install [path-to-python-ldap-windows-binary]
> pip install -r requirements.txt
# 3. Activate Apache and MySql XAMPP services
# 4. Build the static files folder and migrate tables
> python manage.py collectstatic
> python manage.py migrate
# 5. Run ldap_setup.sh in Debian instance
> sudo ./ldap_setup.sh
# 6. Run mock_its_db_setup.sql in XAMPP shell
> mysql -u root -p < "path/to/mock_its_db_setup.sql"
Enter password: # No passwd
```