import { Observable, Subject, BehaviorSubject } from 'rxjs';

export function fileToBase64(file: File): Observable<string | ArrayBuffer> {
    
    const result = new BehaviorSubject<string | ArrayBuffer>(undefined);
    var reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = function () {
        result.next(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
        result.error(error);
    };
    return result;
}