import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class SocketConnection<T> {

    public url: string;
    private socket: WebSocket;
    private data: Subject<T>;
    private opened: boolean = false;
    private state: Subject<string>;

    constructor(url: string) {
        this.url = url;
        this.data = new Subject();
        this.state = new Subject();
    }

    public connect(callback?: () => void): Observable<string> {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        return this.state;
    }

    private onOpen(event) {
        this.opened = true;
        this.state.next('opened');
    }

    private onError(event) {
        this.state.next('opened');
        console.error('Socket communication error occured');
    }

    private onClose(event) {
        this.opened = false;
        this.state.next('closed');
        console.error('Socket closed unexpectedly');
        setTimeout(() => {this.connect();}, 1000);
    }

    private onMessage(event) {
        this.data.next(<T> JSON.parse(event.data));
    }

    public isOpened() {
        return this.opened;
    }

    public getData(): Observable<T> {
        return this.data;
    }
}
