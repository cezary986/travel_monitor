import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../common/services/travel.service';
import { Travel } from '../../common/models/travel';
import { DataStoreService } from '../data-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../app-routing.module';
import { AnimationsFactory } from 'src/app/common/animations';
import { PaginatedResponse } from 'src/app/pagination/paginated-response';
import { Observable } from 'rxjs';
import { ScrollService } from 'src/app/scroll/scroll.service';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { console } from 'src/app/common/debug-console';
 
@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit {

  public travels: Observable<Travel[]> = null;
  public loading: Observable<boolean> = null;

  constructor(
    private travelService: TravelService,
    private dataStore: DataStoreService,
    private offersDataStore: DataStoreService,
    private scrollService: ScrollService,
    private router: Router,
  ) { }

  ngOnInit() {
    const paginatedResponse = this.travelService.getTravels();
    paginatedResponse.setLimit(15);
    const infiniteScrollData = new InfiniteScrollDataProvider<Travel>(paginatedResponse);
    const travelsData = infiniteScrollData.getDataObservable();
    this.loading = infiniteScrollData.isLoading();
    infiniteScrollData.getFirstPortion();
    
    travelsData.subscribe((travels: Travel[]) => {
      this.dataStore.setTravels(travels);
      this.travels = this.dataStore.getTravels();
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
