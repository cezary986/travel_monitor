import { Component, OnInit, OnDestroy } from '@angular/core';
import { OfferService } from 'src/app/common/services/offer.service';
import {  ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'src/app/common/models/offer';
import { DataStoreService } from '../data-store.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { Travel } from 'src/app/common/models/travel';
import { TravelService } from 'src/app/common/services/travel.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit, OnDestroy {

  private travelId: number;
  public offers: Offer[];
  public loading: boolean = true;

  constructor(
    private dataStore: DataStoreService,
    private offerService: OfferService,
    private travelService: TravelService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.travelId = Number.parseInt(params.get("travelId"));
      this.fetchOffers();
      this.fetchTravel();
    })
  }

  ngOnDestroy(): void {
    this.dataStore.stopListeningToOffersChanges();
  }

  private fetchOffers() {
    this.offerService.getOffers(this.travelId).subscribe((offers: Offer[]) => { 
      this.dataStore.setOffers(offers);
      this.dataStore.getOffers().subscribe((offers: Offer[]) => {
        this.offers = offers;
        this.loading = false;
      })
      this.dataStore.startListeningToOffersChanges();
    })
  }

  private fetchTravel() {
    this.travelService.getTravel(this.travelId).subscribe((travel: Travel) => {
      this.dataStore.setTravel(travel);
    })
  }

  public onOfferDeleteClick(offer: Offer) {
    this.offerService.deleteOffer(offer.id).subscribe((res) => {
      this.dataStore.removeOffer(offer);
      this.snackBarService.info('Offerta została usunięta');
    });
  }
}
