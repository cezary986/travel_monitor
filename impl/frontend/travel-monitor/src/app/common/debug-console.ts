import { environment } from "src/environments/environment";

export class console {
    static log(message: any) {
        if (!environment.production) {
            window.console.log(message);
        }
    }
    static error(message: any) {
        if (!environment.production) {
            window.console.error(message);
        }
    }
    static debug(message: any) {
        if (!environment.production) {
            window.console.debug(message);
        }
    }
}
