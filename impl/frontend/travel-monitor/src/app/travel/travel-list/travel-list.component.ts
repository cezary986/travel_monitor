import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../common/services/travel.service';
import { Travel } from '../../common/models/travel';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../app-routing.module';
import { AnimationsFactory } from 'src/app/common/animations';
import { PaginatedResponse } from 'src/app/pagination/paginated-response';
import { Observable } from 'rxjs';
import { ScrollService } from 'src/app/scroll/scroll.service';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { console } from 'src/app/common/debug-console';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { SET_TRAVELS } from 'src/app/common/store/travels/actions';
 
@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit {

  @select((s: IAppState) => s.travels.travels) travels: Observable<Travel[]>;
  public loading: Observable<boolean> = null;

  constructor(
    private travelService: TravelService,
    private redux: NgRedux<IAppState>,
    private scrollService: ScrollService,
    private router: Router,
  ) { }

  ngOnInit() {
    const paginatedResponse = this.travelService.getTravels();
    paginatedResponse.setLimit(15);
    const infiniteScrollData = new InfiniteScrollDataProvider<Travel>(paginatedResponse);
    const data = infiniteScrollData.getDataObservable();
    this.loading = infiniteScrollData.isLoading();
    infiniteScrollData.getFirstPortion();

    data.subscribe((travels: Travel[]) => {
      this.redux.dispatch({type: SET_TRAVELS, payload: travels});
    });
    // listen to container scrolled event and fetch new data then - infinte scroll
    this.scrollService.listenToContainerScroll('mainContainer').subscribe((a) => {
      infiniteScrollData.next();
    });
  }

  onTravelClick(travel: Travel) {
    this.router.navigate([ROUTES.travelDetails.url(travel.id)], { state: { travel: travel}});
  }
}
