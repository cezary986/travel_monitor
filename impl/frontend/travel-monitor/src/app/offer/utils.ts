
export function determineUrlDataProvider(supportedDomains: string[], url: string) {
    const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    const index = supportedDomains.indexOf(domain);
    if (index < 0) {
        return null;
    } else {
        return supportedDomains[index];
    }
}