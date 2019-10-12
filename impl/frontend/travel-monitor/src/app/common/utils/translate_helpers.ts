import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

export function setupModuleTranslations(
    translateService: any,
    translationsKey: string,
    languages: any[][2],
    pathToi18 = './i18n/') {
    if (translateService.defaultLang != null && Object.entries(translateService.store.translations).length > 0) {
        putTranslationsToStore(translateService, pathToi18, translationsKey, languages);
    } else {
        translateService.store.onDefaultLangChange.pipe(first()).subscribe(a => {
            putTranslationsToStore(translateService, pathToi18, translationsKey, languages);
        });
    }
}

function putTranslationsToStore(
    translateService: TranslateService,
    pathToi18,
    translationsKey: string,
    languages: string[]) {

    if (translateService.store.translations[languages[0][0]][translationsKey] === undefined) {
        for (let i = 0; i < languages.length; i++) {
            const languageName = languages[i][0];
            const translations = languages[i][1];
            try {
                translateService.store.translations[languageName][translationsKey] = translations;
            } catch (error) {
                continue;
            }
        }
    }
}
