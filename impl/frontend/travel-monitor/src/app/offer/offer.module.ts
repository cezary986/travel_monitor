import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OfferRoutingModule } from './offer-routing.module';

@NgModule({
  declarations: [OffersListComponent],
  imports: [
    CommonModule,
    OfferRoutingModule
  ]
})
export class OfferModule { }
