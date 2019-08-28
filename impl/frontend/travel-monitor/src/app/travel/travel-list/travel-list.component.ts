import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../common/services/travel.service';
import { Travel } from '../../common/models/travel';
import { DataStoreService } from '../data-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../app-routing.module';
import { AnimationsFactory } from 'src/app/common/animations';
import { PaginatedResponse } from 'src/app/common/paginated-response';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit {

  public travels: Observable<Travel[]> = null;
  public loading: boolean = true;

  private paginatedResponse: PaginatedResponse<Travel> = null;

  constructor(
    private travelService: TravelService,
    private dataStore: DataStoreService,
    private offersDataStore: DataStoreService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.paginatedResponse = this.travelService.getTravels();
    const paginationData = this.paginatedResponse.getDataObservable();
    this.paginatedResponse.firstPage();
    
    paginationData.subscribe((travels: Travel[]) => {
      this.dataStore.setTravels(travels);
      this.travels = this.dataStore.getTravels();
      this.loading = false;
    });
  }

  onTravelClick(travel: Travel) {
    this.router.navigate([ROUTES.travelDetails.url(travel.id)], { state: { travel: travel}});
  }
}
