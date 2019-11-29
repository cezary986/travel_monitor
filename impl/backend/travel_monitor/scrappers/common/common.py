from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import urllib.request 
import requests  
import urllib.request  
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.firefox.options import Options as FirefoxOptions

FIREFOX_DRIVER_PATH = r"C:/Users/cezar/OneDrive/Dokumenty/Rasberry/Projects/travel_monitor/impl/backend/drivers/geckodriver.exe"
FIREFOX_BINARY_PATH = r"C:/Program Files/Mozilla Firefox/firefox.exe"

"""
Class for single travel offer data
"""
class Offer:
    title = None
    price = None
    photo_url = None
    date_from = None
    date_to = None

"""
Base class for website scrapper
"""
class BaseScrapper:

    def scrap(self, urls): raise NotImplementedError

    def one_page_app_load(self, url):
        options = webdriver.ChromeOptions()
        options.headless = True
        options.binary = FIREFOX_BINARY_PATH
        options = FirefoxOptions()
        options.add_argument("--headless")
        binary = FirefoxBinary(FIREFOX_BINARY_PATH)
        driver = webdriver.Firefox(options=options, executable_path=FIREFOX_DRIVER_PATH, firefox_binary=binary)
        driver.get(url)
        return driver

    def getSoup(self, url):
        return  BeautifulSoup(self.simple_get(url), 'html.parser') 

    def simple_get(self, url):
        """
        Attempts to get the content at `url` by making an HTTP GET request.
        If the content-type of response is some kind of HTML/XML, return the
        text content, otherwise return None.
        """
        try:
            with closing(get(url, stream=True)) as resp:
                if self.is_good_response(resp):
                    return resp.content
                else:
                    return None

        except RequestException as e:
            self.log_error('Error during requests to {0} : {1}'.format(url, str(e)))
            return None

    def is_good_response(self, resp):
        """
        Returns True if the response seems to be HTML, False otherwise.
        """
        content_type = resp.headers['Content-Type'].lower()
        return (resp.status_code == 200 
                and content_type is not None 
                and content_type.find('html') > -1)


    def log_error(self, e):
        """
        It is always a good idea to log errors. 
        This function just prints them, but you can
        make it do anything.
        """
        print(e)