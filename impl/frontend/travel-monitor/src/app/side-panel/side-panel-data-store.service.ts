import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidePanelDataStoreService {

  private data: any = {};

  constructor() { }

  public getData(key: string): any {
    return this.data[key];
  }

  public putData(key: string, data: any) {
    this.data[key] = data;
  }

  public clear() {
    this.data = {};
  }
}
