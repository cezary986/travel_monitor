import { Component, OnInit } from '@angular/core';
import { TravelService } from '../../common/services/travel.service';
import { Travel } from '../../common/models/travel';
import { DataStoreService } from '../data-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../app-routing.module';
 
@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss']
})
export class TravelListComponent implements OnInit {

  public travels: Travel[] = [];

  constructor(
    private travelService: TravelService,
    private dataStore: DataStoreService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.travelService.getTravels().subscribe((travels) => {
      this.dataStore.setTravels(travels);
      this.dataStore.getTravels().subscribe((travels: Travel[]) => {
        this.travels = travels;
      });
    })
  }

  onTravelClick(travel: Travel) {
    this.router.navigate([ROUTES.travelDetails.url(travel.id)]);
  }
}
