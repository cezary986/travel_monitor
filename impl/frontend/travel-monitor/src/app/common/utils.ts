import { environment } from 'src/environments/environment';

export function getImageSrc(relativeUrl: string): string {
    return environment.fileServerAddress + relativeUrl;
}
