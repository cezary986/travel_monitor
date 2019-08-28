import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Class handling paginated data served by API
 */
export class PaginatedResponse<T> {

    private static readonly DEFAULT_LIMIT = 20;
    private data: BehaviorSubject<T[]>;
    private url: string;
    private limit: number;
    private http: HttpClient;
    private totalCount: number;
    private additionalParams: {name: string, value: string | number}[]

    private nextPageUrl: string;
    private previousPageUrl: string;
    private onDiscardListener: () => void;

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
        this.data = new BehaviorSubject<T[]>(undefined);
    }

    /**
     * Method setting additional request params. For example some filters.
     * 
     * @param additionalParams 
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
        this.getPaginatedData(number * this.limit, this.limit);
    }

    private fetchPage(url: string) {
        this.http.get<T[]>(url).subscribe((res: any) => {
            this.nextPageUrl = res.next;
            this.previousPageUrl = res.previous;
            this.totalCount = res.count;
            this.data.next(res.results);
        });
    }

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
            values.splice(0, values.length - this.limit);
        }
        this.totalCount++;
        this.data.next(values);
    }

    public setOnDiscardListener(listener: () => void) {
        this.onDiscardListener = listener;
    }

    public discard() {
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
}