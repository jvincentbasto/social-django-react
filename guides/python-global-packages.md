# Python Global Packges (OPTIONAL)

## pipenv

```shell
  # install
  pip install pipenv
  
  # install package
  pipenv install package

  # run shell
  pipenv shell

```

## pipdeptree

```shell
  # install
  pip install pipdeptree
  
  # check all packages
  pipdeptree

  # check a package 
  pipdeptree -p <package_name>

```

## pip-review

```shell
  # reviews package versions like "ncu" in npm 
  
  # install
  pip install pip-review

  # usage
  pip-review --local
  pip-review --interactive

  # python default
  pip list --outdated --format=columns
  pip show <package_name>

```
