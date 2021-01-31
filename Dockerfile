# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.7-buster

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /cygnet
COPY . /cygnet

# Install ldap dev packages and utils + mysql client
RUN apt-get update && apt-get install -y \
    libsasl2-dev \
    libldap2-dev \
    libssl-dev \
    ldap-utils \
    python3-dev \
    default-mysql-server \
    default-mysql-client \
    default-libmysqlclient-dev \
    build-essential

# Install pip requirements
RUN python -m pip install -r requirements_docker.txt

# Set up mysql config
#RUN echo "[mysqld]\nsocket=/var/lib/mysql/mysql.sock\n\
#[client]\nsocket=/var/lib/mysql/mysql.sock" >> /etc/mysql/my.cnf
RUN echo "[mysqld]\nsocket=/var/run/mysqld/mysqld.sock\n\
[client]\nsocket=/var/run/mysqld/mysqld.sock" >> /etc/mysql/my.cnf
RUN touch /var/lib/mysql/mysql.sock && chown mysql:mysql /var/lib/mysql/mysql.sock
RUN mkdir /var/run/mysqld && touch /var/run/mysqld/mysqld.sock
RUN chown -R mysql:mysql /var/run/mysqld

# Switching to a non-root user, please refer to https://aka.ms/vscode-docker-python-user-rights
RUN useradd cygnet && chown -R cygnet:cygnet /cygnet
USER cygnet

# Rename django.wsgi to wsgi.py so that gunicorn can detect it
RUN mv django.wsgi wsgi.py

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
# File wsgi.py was not found in subfolder: 'cygnet'. Please enter the Python path to wsgi file.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi"]
USER root
