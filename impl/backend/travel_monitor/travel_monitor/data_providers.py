
from scrappers.wakacje_pl import WakacjePlScrapper
from scrappers.test_page import TestScrapper

import sys
# Some dirty hack to import my own damn package!
sys.path.append("..")

DATA_PROVIDERS = {
    'wakacje_pl': {
        'name': 'wakacje_pl',
        'label': 'Wakacje.pl',
        'domains': ['wakacje.pl', 'm.wakacje.pl'],
        'replace_in_url': [('/wakacje.pl/', '/m.wakacje.pl/')],
        'scrapper_instance': WakacjePlScrapper()
    },
    'test': {
        'name': 'test',
        'label': 'Strona testowa',
        'domains': ['localhost:90'],
        'replace_in_url': [],
        'scrapper_instance': TestScrapper()
    },
}

DATA_PROVIDERS_LABELS = [
    (DATA_PROVIDERS['wakacje_pl']['name'], DATA_PROVIDERS['wakacje_pl']['label']),
    (DATA_PROVIDERS['test']['name'], DATA_PROVIDERS['test']['label']),
]
