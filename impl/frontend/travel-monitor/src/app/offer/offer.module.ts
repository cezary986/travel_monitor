import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OfferRoutingModule } from './offer-routing.module';
import { MatCardModule } from '@angular/material/card';
import { OfferListElementComponent } from './offer-list-element/offer-list-element.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpandableButtonModule } from '../common/components/expandable-button/expandable-button.module';
import { OfferAddComponent } from './offer-add/offer-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [OffersListComponent, OfferListElementComponent, OfferAddComponent],
  imports: [
    CommonModule,
    OfferRoutingModule,
    ExpandableButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OfferModule { }
