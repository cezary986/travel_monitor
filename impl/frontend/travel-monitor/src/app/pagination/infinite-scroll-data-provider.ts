import { PaginatedResponse } from './paginated-response';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

export class InfiniteScrollDataProvider<T> {

    private paginatedResponse: PaginatedResponse<T>;
    private data: BehaviorSubject<T[]>;

    public constructor(paginatedResponse: PaginatedResponse<T>) {
        this.paginatedResponse = paginatedResponse;
        this.data = new BehaviorSubject([]);
        this.paginatedResponse.getDataObservable().subscribe((res: T[]) => {
            const array = this.data.value;  
            this.data.next(array.concat(res));
        });
    }

    public getFirstPortion() {
        this.paginatedResponse.firstPage();
    }

    public next(): boolean {
        return this.paginatedResponse.nextPage();
    }

    public getDataObservable(): Observable<T[]> {
        return this.data;
    }

    public isLoading(): Observable<boolean> {
        return this.paginatedResponse.isLoading();
    }
}