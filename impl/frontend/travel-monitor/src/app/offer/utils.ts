
export function getUrlDomainIfSupported(supportedDomains: string[], url: string) {
    if (url !== undefined && url !== null) {
        const domain = url.replace('http://','').replace('https://','').replace('www.', '').split(/[/?#]/)[0];
        return (supportedDomains.indexOf(domain) < 0) ? null : domain;
    }
    return null;
}