# Python Local Packges (Backend)

## Install Packages

```shell
  # navgiate to backend directory 
  cd backend

  # install packages
  pipenv sync
    # manually
    pipenv install django djangorestframework django-cors-headers djangorestframework-simplejwt
    
  # run shell
  pipenv shell
```

## venv commands

```shell
  # init venv
  python -m venv <folder_name>

  # activate shell
    # mac/linux
    source venv/bin/activate
    # windows
    .\venv\Scripts\activate

  # install
    # set requirements.txt
    pip freeze > requirements.txt
    # install through requirements.txt
    pip install -r requirements.txt

```

## django commands (on pipenv shell)

```shell
  # run shell
  pipenv shell

  # default
  django-admin

  # create superuser
  python manage.py createsuperuser

  # command on db updates
  python manage.py makemigrations
  python manage.py migrate

  # run server
  python manage.py runserver

```
