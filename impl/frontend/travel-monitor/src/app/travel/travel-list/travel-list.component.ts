import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../common/services/travel.service';
import { Travel } from '../../common/models/travel';
import { DataStoreService } from '../data-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../app-routing.module';
import { AnimationsFactory } from 'src/app/common/animations';
 
@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit {

  public travels: Travel[] = [];
  public loading: boolean = true;

  constructor(
    private travelService: TravelService,
    private dataStore: DataStoreService,
    private offersDataStore: DataStoreService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.travelService.getTravels().subscribe((travels) => {
      this.dataStore.setTravels(travels);
      this.dataStore.getTravels().subscribe((travels: Travel[]) => {
        this.travels = travels;
        this.loading = false;
      });
    })
  }

  onTravelClick(travel: Travel) {
    this.router.navigate([ROUTES.travelDetails.url(travel.id)], { state: { travel: travel}});
  }
}
