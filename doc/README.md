# Travel Monitor

Simple webscraping project to observe different travel offers from different websites. 
It is supposed to automaticaly notify users about new price or when a price go under certain level we are interested in.

## Architecture

Travel Monitor consists of four modules:
* Webscrapers - extracting data from websites and returning them in standarized form
* Django REST API - for accessing extracted data on demand and also some sockets to notify about their changes
* Angular client - for easy browsing and previewing data
* Minimalistic Android app - for listening to sockets and getting push notifications on your phone

## Instalation

All python dependencies are specified in file ```requirements.txt``` and could be installed with one command:

```bash
pip install -r .\requirements.txt
```

Webscrapers depends on ```Selenium ``` which needs Firefox webdriver to work. To make if work you need to install them yourself from [here](https://github.com/mozilla/geckodriver/releases). Then modify two constants in ```backend/scrappers/common/common.py```:

* FIREFOX_DRIVER_PATH
* FIREFOX_BINARY_PATH


All Angular dependencies are of course in ```package.json```. You can install them by running:

```bash
npm install
```