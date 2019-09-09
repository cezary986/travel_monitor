import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { timeout } from 'q';
import { BottomNavItem } from 'ngx-bottom-nav';
import { SideDrawerService } from './service/side-drawer.service';
import { ROUTES } from '../app-routing.module';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { SIDE_DRAWER_CONFIG } from './side-drawe-config';

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
  private opened: boolean = false;
  private selectedElementIndex: number = null;
  private collapsedWidth: string = '72px';
  private expandedWidth: string = '250px';

  public elements: any[] = SIDE_DRAWER_CONFIG;

  constructor(
    private renderer: Renderer2,
    private sideDrawerService: SideDrawerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sideDrawerService.isOpened().subscribe((isOpened) => {
      if (isOpened !== null && isOpened != this.opened) {
        this.toogle();
      }
    })
    this.subscribeToRouteChanges();
    setTimeout(function () {
      if (this.opened) {
        this.opened = false;
        this.toogle();
      } else {
        this.opened = true;
        this.toogle();
      }
      this.onItemSelect(this.selectedElementIndex);
    }.bind(this), 0);
  }

  public toogle() {
    this.setupContainer();
    if (this.opened) {
      this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'opened')
      this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'collapsed')
      this.setContainerMargin();
    } else {
      this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'collapsed')
      this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'opened')
      this.setContainerMargin();
      if (this.collapsedWidth === undefined) {
        this.collapsedWidth = this.contentContainer.style.marginLeft
      }
    }
    this.opened = !this.opened;
  }

  private setupContainer() {
    if (this.contentContainer.length !== undefined) {
      for (let i = 0; i < this.contentContainer.length; i++) {
        if (this.contentContainer[i].style == undefined) {
          this.contentContainer[i] = this.contentContainer[i].elementRef.nativeElement;
        }
      }
    } else {
      if (this.contentContainer.style == undefined) {
        this.contentContainer = this.contentContainer.elementRef.nativeElement;
      }
    }
  }

  private setContainerMargin() {
    if (this.contentContainer.length !== undefined) {
      for (let i = 0; i < this.contentContainer.length; i++) {
        this.contentContainer[i].style.marginLeft = (this.opened) ? this.collapsedWidth : this.expandedWidth;
      }
    } else {
      this.contentContainer.style.marginLeft = (this.opened) ? this.collapsedWidth : this.expandedWidth;
    }
  }

  private getListElementByIndex(index: number): any {
    const listElements = this.sideDrawerContainer.nativeElement.querySelectorAll('li.side-drawer-element');
    return listElements[index];
  }


  public onItemSelect(index: number) {
    this.router.navigateByUrl(this.elements[index].routerLink);
    this.markItemAsSelected(index);
  }

  private markItemAsSelected(index: number) {
    this.deselectCurrentElement();
    this.selectedElementIndex = index;
    const clickedElement = this.getListElementByIndex(index);
    this.renderer.addClass(clickedElement, 'active');
  }

  private deselectCurrentElement() {
    if (this.selectedElementIndex != null) {
      const lastSelectedItem = this.getListElementByIndex(this.selectedElementIndex);
      this.renderer.removeClass(lastSelectedItem, 'active');
    }
  }

  private tryToMatchElementToRoute(route: string) {
    const res = this.elements.filter((element) => {
      return new RegExp(element.matchRouteRegex).test(route);
    });
    return this.elements.indexOf(res[0]);
  }

  private subscribeToRouteChanges() {
    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        const index = this.tryToMatchElementToRoute(event.url);
        if (this.selectedElementIndex != index) {
          this.markItemAsSelected(index);
        }
      }
      if (event instanceof NavigationEnd) {
        if (this.selectedElementIndex == null) {
          const index = this.tryToMatchElementToRoute(event.url);
          if (this.selectedElementIndex != index) {
            this.markItemAsSelected(index);
          }
        }

      }
      if (event instanceof NavigationError) {
        this.deselectCurrentElement();
      }
    });
  }
}
