from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import urllib.request
import requests
import urllib.request
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec

from scrappers.common.common import BaseScrapper, Offer

TIMEOUT = 20

"""
Scaper class for page Wakacje.pl
"""
class WakacjePlScrapper(BaseScrapper):

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
            driver = self.one_page_app_load(url)
            try:
                offer.price = self.extract_offer_price(driver)
                offer.title = self.extract_offer_title(driver)
                offer.photo_url = self.extract_offer_photo_url(driver)
            except TimeoutError:
                print("Timeout")
            finally:
                driver.quit()
        return offers

    def extract_offer_price(self, driver):
        domElement = WebDriverWait(driver, TIMEOUT).until(ec.visibility_of_element_located((By.CSS_SELECTOR, '#variantsList > ul > li > div.firstRow.clearfix > b')))
        return int(domElement.text[:-2].replace(' ', ''))

    def extract_offer_title(self, driver):
        domElement = WebDriverWait(driver, TIMEOUT).until(ec.visibility_of_element_located((By.ID, 'js-offerName')))
        return domElement.text

    def extract_offer_photo_url(self, driver):
        domElement = WebDriverWait(driver, TIMEOUT).until(ec.visibility_of_element_located((By.CSS_SELECTOR, '#mainPhotoCont > img.photo')))
        return domElement.get_attribute("src")
