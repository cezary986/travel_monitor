import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OfferRoutingModule } from './offer-routing.module';
import { MatCardModule } from '@angular/material/card';
import { OfferListElementComponent } from './offer-list-element/offer-list-element.component';

@NgModule({
  declarations: [OffersListComponent, OfferListElementComponent],
  imports: [
    CommonModule,
    OfferRoutingModule,
    MatCardModule
  ]
})
export class OfferModule { }
