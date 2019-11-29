import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Class handling paginated data served by API
 */
export class PaginatedResponse<T> {

    protected static readonly DEFAULT_LIMIT = 20;
    protected data: BehaviorSubject<T[]>;
    protected errors: BehaviorSubject<any>;
    protected loading: Subject<boolean>;
    protected url: string;
    protected limit: number;
    protected http: HttpClient;
    protected totalCount: number;
    protected additionalParams: {name: string, value: string | number}[]

    protected nextPageUrl: string;
    protected previousPageUrl: string;
    protected currentPageUrl: string;
    protected onDiscardListener: () => void;

    /**
     * @param http http client for fetching data
     * @param url endpoint url serving paginated data
     * @param limit optionally default limit (page size)
     * @param additionalParams array of objects containing name and value of params. Those params
     * are added to each GET request
     */
    constructor(
        http: HttpClient,
        url: string,
        limit: number = PaginatedResponse.DEFAULT_LIMIT, 
        additionalParams: {name: string, value: string | number}[] = []
    ) {
        this.url = url;
        this.http = http;
        this.limit = limit;
        this.additionalParams = additionalParams;
        this.data = new BehaviorSubject<T[]>([]);
        this.errors = new BehaviorSubject<any>(null);
        this.loading = new Subject();
    }

    /**
     * Method setting additional request params. For example some filters.
     *
     * @param additionalParams tablica z dodatkowymi parametrami
     */
    public setAdditionalParams(additionalParams: {name: string, value: string | number}[] = []) {
        this.additionalParams = additionalParams;
    }

    private constructUrl(offset: number, limit: number): string {
        if (this.url.includes('?')) {
            this.url += '&';
        } else {
            this.url += '?';
        }
        let constructedUrl =  this.url + 'limit=' + limit + '&offset=' + offset;
        for(let i = 0; i < this.additionalParams.length; i++) {
            constructedUrl += '&' + this.additionalParams[i].name + '=' + this.additionalParams[i].value;
        }
        return constructedUrl;
    }

    /**
     * Returns observable which could be used to access data
     */
    public getDataObservable(): Observable<T[]> {
        return this.data;
    }

    /**
     * Fetch page accordingly to passed parameters
     * 
     * @param offset page offset (counted in elements)
     * @param limit page limit (size)
     */
    public getPaginatedData(offset: number, limit: number) {
        const _limit = limit != undefined ? limit : this.limit;
        const url = this.constructUrl(offset, _limit);
        this.fetchPage(url);
    }

    /**
     * Returns observable to listen to erros while fetching data
     */
    public getErrorsObservable(): Observable<any> {
        return this.errors;
    }

    /**
     * Simple method to fetch first page (offset = 0)
     */
    public firstPage() {
        this.getPaginatedData(0, this.limit);
    }

    /**
     * Fetch next page accordingly to the previously fetched page. Note that this 
     * method can only be called after fetching some other page
     */
    public nextPage(): boolean {
        if (this.nextPageUrl === undefined) {
            throw Error('Cannot fetch next page if no page was fetched before');
        }
        if (this.nextPageUrl != null) {
            this.loading.next(true);
            this.fetchPage(this.nextPageUrl);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Fetch next previous accordingly to the previously fetched page. Note that this 
     * method can only be called after fetching some other page
     */
    public previousPage(): boolean {
        if (this.previousPageUrl === undefined) {
            throw Error('Cannot fetch previous page if no page was fetched before');
        }
        if (this.previousPageUrl != null) {
            this.loading.next(true);
            this.fetchPage(this.previousPageUrl);
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param number numbe of page
     */
    public fetchPageByNumber(number: number) {
        if (number * this.limit < this.totalCount) {
            this.loading.next(true);
            this.getPaginatedData(number * this.limit, this.limit);
        }
    }

    private fetchPage(url: string) {
        this.currentPageUrl = url;
        this.http.get<T[]>(url).subscribe((res: any) => {
            this.nextPageUrl = this.rewriteUrl(res.next);
            this.previousPageUrl = this.rewriteUrl(res.previous);
            this.totalCount = res.count;
            this.data.next(res.results);
            this.loading.next(false);
        }, error => {
            this.errors.next(error);
        });
    }

    public setOnDiscardListener(listener: () => void) {
        this.onDiscardListener = listener;
    }

    public discard() {
        this.http = null;
        if (this.onDiscardListener !== undefined) {
            this.onDiscardListener();
        }
    }

    public getLimit(): number {
        return this.limit;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public setLimit(limit: number) {
        this.limit = limit;
    }

    private rewriteUrl(url: string): string {
        if (environment.production || url == null) {
            return url;
        } else {
            return url.replace('http://127.0.0.1:8080/api/', environment.apiAddress);
        }
    }

    public isLoading(): Observable<boolean> {
        return this.loading;
    }
}

/**
 * This class extends PaginateReponse class allowing manually changing
 * its internal data.
 */
export class MutablePaginatedResponse<T> extends PaginatedResponse<T> {

    public _updateRecord(record: T, uniqueField: string = 'id') {
        const values = this.data.value;
        const elementIndex = values.findIndex(el => { 
            return el[uniqueField] === record[uniqueField];
        });
        if (elementIndex >= 0) {
            values[elementIndex] = record;
            this.data.next(values);
        }
    }

    public _add_record(record: T) {
        const values = this.data.value;
        values.unshift(record);
        if (values.length > this.limit) {
            values.splice(values.length - 1, values.length - this.limit);
        }
        this.totalCount++;
        
        this.data.next(values);
    }
}
