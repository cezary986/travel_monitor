
export function getUrlDomainIfSupported(supportedDomains: string[], url: string) {
    const domain = url.replace('http://','').replace('https://','').replace('www.', '').split(/[/?#]/)[0];
    return (supportedDomains.indexOf(domain) < 0) ? null : domain;
}