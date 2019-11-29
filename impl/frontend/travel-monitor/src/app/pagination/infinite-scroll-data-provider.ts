import { PaginatedResponse } from './paginated-response';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';

export class InfiniteScrollDataProvider<T> {

    private paginatedResponse: PaginatedResponse<T>;
    private data: BehaviorSubject<T[]>;
    private subscription: Subscription = null;

    public constructor(paginatedResponse: PaginatedResponse<T>) {
        this.paginatedResponse = paginatedResponse;
        this.data = new BehaviorSubject([]);
        this.subscription = this.paginatedResponse.getDataObservable().subscribe((res: T[]) => {
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

    public getErrorObservable(): Observable<any> {
        return this.paginatedResponse.getErrorsObservable();
    }

    public isLoading(): Observable<boolean> {
        return this.paginatedResponse.isLoading();
    }

    public discard() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
        this.data.unsubscribe();
        this.paginatedResponse.discard();
    }
}
