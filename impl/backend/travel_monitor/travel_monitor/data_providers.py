
import sys
# Some dirty hack to import my own damn package!
sys.path.append("..")
from scrappers.wakacje_pl import WakacjePlScrapper

DATA_PROVIDERS = {
    'wakacje_pl': {
        'name': 'wakacje_pl',
        'label': 'Wakacje.pl',
        'domains': ['wakacje.pl', 'm.wakacje.pl'],
        'replace_in_url': [('wakacje.pl/', 'm.wakacje.pl/')],
        'scrapper_instance': WakacjePlScrapper()
    },
}

DATA_PROVIDERS_LABELS = [
    (DATA_PROVIDERS['wakacje_pl']['name'], DATA_PROVIDERS['wakacje_pl']['label']),
]
