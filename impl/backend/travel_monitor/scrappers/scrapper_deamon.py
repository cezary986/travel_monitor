import time
import subprocess
import os
from datetime import datetime

"""
Simple deamon process to periodically trigger offers webscraping and updating
It generally call a django management command that do the real webscraping
"""

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# CALL_EVERY = 2 * 60 * 60 # 2h
CALL_EVERY = 5 # seconds
PATH_TO_MANAGE_FILE = CURRENT_DIR + '\..\manage.py'

def updateTravelsData():
    # Run django management command
    os.system('python ' + PATH_TO_MANAGE_FILE + ' update_travels')

print('Starting Travel Monitor webscraper deamon')
while True:
    updateTravelsData()