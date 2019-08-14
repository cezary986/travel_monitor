import { ValidatorFn, AbstractControl } from '@angular/forms';
import { getUrlDomainIfSupported } from '../utils';

/**
 * Check if given url match any of supported domain names
 * 
 * @param supportedDomains list of all supported domains names
 */
export function supportedDomainValidator(supportedDomains: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const url = control.value;
        const domain = getUrlDomainIfSupported(supportedDomains, url);
        return (domain != null) ? null : { 'unsupportedDomain': { value: control.value } };
    };
}