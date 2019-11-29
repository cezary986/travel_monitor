from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import urllib.request
import requests
import urllib.request
import datetime
import sys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.common.exceptions import TimeoutException
sys.path.append("..")
from scrappers.common.common import BaseScrapper, Offer

TIMEOUT = 60

"""
Scaper class for test page
"""
class TestScrapper(BaseScrapper):

    """
    Scrap url and extract offer data from it
    """
    def scrap(self, urls):
        offers = []
        if urls == None:
            self.log_error(Exception('urls for scrapping were None'))
            return
        for url in urls:
            offer = Offer()
            offers.append(offer)
            soup = self.getSoup(url)
            try:
                offer.price = self.extract_offer_price(soup)
                print(offer.price)
                offer.title = self.extract_offer_title(soup)
                print(offer.title)
                offer.photo_url = self.extract_offer_photo_url(soup)
                print(offer.photo_url)
                date_from, date_to = self.extract_offer_dates(soup)
                print(date_from)
                offer.date_from = date_from
                offer.date_to = date_to
            except Exception as e:
                print(str(e))
                raise e
        return offers

    def extract_offer_price(self, soup):
        domElement = soup.find_all(class_="offer-price")[0]
        return int(domElement.contents[0].replace('zł', ''))


    def extract_offer_title(self, soup):
        domElement = soup.find_all(class_="offer-title")[0]
        return domElement.contents[0]

    def extract_offer_photo_url(self, soup):
        domElement = soup.find_all(class_="offer-photo")[0]
        return domElement["src"]


    def extract_offer_dates(self, soup):
        domElement = soup.find_all(class_="offer-dates")[0]
        dates = domElement.contents[0].split(' - ')
        print(dates)
        date_from = datetime.datetime.strptime(dates[0],"%d.%m.%Y")
        date_to = datetime.datetime.strptime(dates[1],"%d.%m.%Y")
        return date_from, date_to
