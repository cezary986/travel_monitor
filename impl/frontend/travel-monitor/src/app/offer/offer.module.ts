import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OfferRoutingModule } from './offer-routing.module';
import { MatCardModule } from '@angular/material/card';
import { OfferListElementComponent } from './offer-list-element/offer-list-element.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpandableButtonModule } from '../common/components/expandable-button/expandable-button.module';
import { OfferAddComponent } from './offer-add/offer-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChartsModule } from 'ng2-charts';
import { OfferEditModalComponent } from './offer-edit-modal/offer-edit-modal.component';
import { OfferListHeaderComponent } from './offer-list-header/offer-list-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TravelModule } from '../travel/travel.module';
import { RouterModule } from '@angular/router';
import { PricesChartModalComponent } from './prices-chart-modal/prices-chart-modal.component';
import { OfferListFiltersComponent } from './offer-list-filters/offer-list-filters.component';

@NgModule({
  declarations: [
    OffersListComponent,
    OfferListElementComponent,
    OfferAddComponent,
    OfferEditModalComponent,
    OfferListHeaderComponent,
    PricesChartModalComponent,
    OfferListFiltersComponent
  ],
  imports: [
    CommonModule,
    OfferRoutingModule,
    ExpandableButtonModule,
    TravelModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatExpansionModule,
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  entryComponents: [
    OfferEditModalComponent,
    PricesChartModalComponent
  ]
})
export class OfferModule { }
