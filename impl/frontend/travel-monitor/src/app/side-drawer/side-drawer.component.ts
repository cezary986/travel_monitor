import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { timeout } from 'q';
import {BottomNavItem} from 'ngx-bottom-nav';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit {

  @Input() contentContainer: any;
  @ViewChild('sideDrawerContainer', null) sideDrawerContainer: ElementRef;
  @ViewChild('curtainDown', null) curtainDown: ElementRef;
  @ViewChild('curtainUpper', null) curtainUpper: ElementRef;
  private opened: boolean = true;
  private selectedElementIndex: number = 0;

  public elements: BottomNavItem[] = [
    {icon: 'home', label: 'Home', routerLink: ''},
    {icon: 'home', label: 'Home', routerLink: ''},
    {icon: 'home', label: 'Home', routerLink: ''},
    {icon: 'home', label: 'Home', routerLink: ''},
  ]

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    setTimeout(function(){ this.onItemSelect(this.selectedElementIndex); }.bind(this), 10);
  }

  public toogle() {
    if (this.opened) {
      this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'opened')
      this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'collapsed')
      this.contentContainer.style.marginLeft = this.sideDrawerContainer.nativeElement.offsetWidth;;
    } else {
      this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'collapsed')
      this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'opened')
      this.contentContainer.style.marginLeft = this.sideDrawerContainer.nativeElement.offsetWidth;;
    }
    this.setupCurtains();
    setTimeout(function(){ this.setupCurtains(); }.bind(this), 120);
    this.opened = !this.opened;
  }

  private getListElementByIndex(index: number): any {
    const listElements = this.sideDrawerContainer.nativeElement.querySelectorAll('li.side-drawer-element');
    return listElements[index];
  }

  private setupCurtains(clickedElement?: any) {
    if (clickedElement === undefined) {
      clickedElement =  this.getListElementByIndex(this.selectedElementIndex);
    }
    const listElementHeight = clickedElement.offsetHeight;
    const listElementOffsetTop = clickedElement.offsetTop;
    let tmp2;
    let tmp = listElementOffsetTop + listElementHeight;
    if (this.opened) {
      tmp2 = listElementOffsetTop - 2* listElementHeight + 4;
    } else {
      tmp2 = listElementOffsetTop - 1.1 * listElementHeight - 2;
      tmp = tmp + 3;
    }
  
    this.curtainDown.nativeElement.style.transform = 'translateY(' + tmp + 'px)'
    this.curtainUpper.nativeElement.style.transform = 'translateY(' + tmp2  +'px)'
  }

  public onItemSelect(index: number) {
    const lastSelectedItem = this.getListElementByIndex(this.selectedElementIndex);
    this.selectedElementIndex = index;
    const clickedElement = this.getListElementByIndex(index);
    this.setupCurtains(clickedElement);
    this.renderer.removeClass(lastSelectedItem, 'active');
    this.renderer.addClass(clickedElement, 'active');
  }

}
