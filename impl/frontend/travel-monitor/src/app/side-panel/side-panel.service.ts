import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ElementRef } from '@angular/core';
import { SidePanelDataStoreService } from './side-panel-data-store.service';

@Injectable({
  providedIn: 'root'
})
export class SidePanelService {

  private sidePanel: any;
  private container: ElementRef;
  private isOpened: boolean = false;
  private componentRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private dataStore: SidePanelDataStoreService
  ) { }

  public setPanel(sidePanel, container: ElementRef) {
    this.sidePanel = sidePanel;
    this.container = container;
  }

  public toogle() {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      this.sidePanel.show();
    } else {
      this.sidePanel.hide();
    }
  }

  public show(component: any, data: {key: string, value: any}[]) {
    for(let i = 0; i < data.length; i++) {
      this.dataStore.putData(data[i].key, data[i].value);
    }
    if (this.isOpened) {
      this.clearComponent();
      this.dataStore.clear();
    }
    this.isOpened = true;
    this.sidePanel.show();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.container.nativeElement.appendChild(domElem);
    console.log(this.dataStore);
    
    this.componentRef = componentRef;
  }

  public hide() {
    this.isOpened = false;
    this.sidePanel.hide();
    this.clearComponent();
  }

  private clearComponent() {
    this.dataStore.clear();
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }
}
