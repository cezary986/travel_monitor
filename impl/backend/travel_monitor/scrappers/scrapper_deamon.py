import time
import subprocess
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# CALL_EVERY = 2 * 60 * 60 # 2h
CALL_EVERY = 2
PATH_TO_MANAGE_FILE = CURRENT_DIR + '/../travello/manage.py'

print(PATH_TO_MANAGE_FILE)
def updateTravelsData():\
    # Run django management command
    subprocess.Popen(['python', PATH_TO_MANAGE_FILE,'update_travels', '{\"test\": \"Hello\", \"years\": [25, 29]}'])
    time.sleep(CALL_EVERY)

print('Starting Travel Monitor webscraper deamon')
while True:
    updateTravelsData()