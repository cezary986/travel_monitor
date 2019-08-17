import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ElementRef } from '@angular/core';

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
    private injector: Injector
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

  public show(component: any) {
    if (this.isOpened) {
      this.clearComponent();
    }
    this.isOpened = true;
    this.sidePanel.show();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.container.nativeElement.appendChild(domElem);
  
    this.componentRef = componentRef;
  }

  public hide() {
    this.isOpened = false;
    this.sidePanel.hide();
    this.clearComponent();
  }

  private clearComponent() {
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }
}
