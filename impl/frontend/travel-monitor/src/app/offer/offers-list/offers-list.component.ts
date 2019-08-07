import { Component, OnInit, OnDestroy } from '@angular/core';
import { OfferService } from 'src/app/common/services/offer.service';
import {  ActivatedRoute } from '@angular/router';
import { Offer } from 'src/app/common/models/offer';
import { DataStoreService } from '../data-store.service';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.travelId = Number.parseInt(params.get("travelId"));
      this.fetchOffers();
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

}
