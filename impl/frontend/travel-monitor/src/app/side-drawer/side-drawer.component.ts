import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, AfterViewChecked, OnDestroy } from '@angular/core';
import { timeout } from 'q';
import { BottomNavItem } from 'ngx-bottom-nav';
import { SideDrawerService } from './service/side-drawer.service';
import { ROUTES } from '../app-routing.module';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { SIDE_DRAWER_CONFIG } from './side-drawe-config';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { Observable } from 'rxjs';
import { User } from '../common/models/user';

@Component({
  selector: 'app-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss']
})
export class SideDrawerComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() contentContainer: any;
  @ViewChild('sideDrawerContainer', null) sideDrawerContainer: ElementRef;
  @ViewChild('curtainDown', null) curtainDown: ElementRef;
  @ViewChild('curtainUpper', null) curtainUpper: ElementRef;
  private opened = false;
  private selectedElementIndex: number = null;
  private collapsedWidth = '72px';
  private expandedWidth = '250px';

  public elements: any[] = SIDE_DRAWER_CONFIG;

  constructor(
    private renderer: Renderer2,
    private sideDrawerService: SideDrawerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sideDrawerService.isOpened().subscribe((isOpened) => {
      if (isOpened !== null && isOpened != this.opened) {
        this.toogle();
      }
    });
    this.subscribeToRouteChanges();
    // setTimeout(function () {
    //   if (this.opened) {
    //     this.opened = false;
    //     this.toogle();
    //   } else {
    //     this.opened = true;
    //     this.toogle();
    //   }
    //   this.onItemSelect(this.selectedElementIndex);
    //   this.onItemSelect(this.tryToMatchElementToRoute());
    // }.bind(this), 0);
  }

  ngOnDestroy(): void {
    if (this.contentContainer.length !== undefined) {
      for (let i = 0; i < this.contentContainer.length; i++) {
        this.contentContainer[i].style.marginLeft = 0;
      }
    } else {
      this.contentContainer.style.marginLeft = 0;
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.markElementFromUrl(this.router.url);
      if (this.opened) {
        this.opened = false;
        this.toogle();
      } else {
        this.opened = true;
        this.toogle();
      }
    }, 500);
  }

  public toogle() {
    this.setupContainer();
    if (this.opened) {
      this.collapse();
    } else {
      this.open();
    }
    this.opened = !this.opened;
  }

  private open() {
    this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'collapsed')
    this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'opened')
    this.setContainerMargin();
    if (this.collapsedWidth === undefined) {
      this.collapsedWidth = this.contentContainer.style.marginLeft
    }
  }

  private collapse() {
    this.renderer.removeClass(this.sideDrawerContainer.nativeElement, 'opened')
    this.renderer.addClass(this.sideDrawerContainer.nativeElement, 'collapsed')
    this.setContainerMargin();
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
        this.markElementFromUrl(event.url);
      }
      if (event instanceof NavigationEnd) {
        this.markElementFromUrl(event.url);
      }
      if (event instanceof NavigationError) {
        this.deselectCurrentElement();
      }
    });
  }

  private markElementFromUrl(url: string) {
    if (this.selectedElementIndex == null) {
      const index = this.tryToMatchElementToRoute(url);
      if (this.selectedElementIndex != index) {
        this.markItemAsSelected(index);
      }
    }
  }
}
