import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Offer } from 'src/app/common/models/offer';
import { AnimationsFactory } from 'src/app/common/animations';
import { DataStoreService } from '../data-store.service';
import { OfferService } from 'src/app/common/services/offer.service';
import { MatDialog } from '@angular/material/dialog';
import { OfferEditModalComponent } from '../offer-edit-modal/offer-edit-modal.component';
import { PricesChartModalComponent } from '../prices-chart-modal/prices-chart-modal.component';

@Component({
  selector: 'app-offer-list-element',
  templateUrl: './offer-list-element.component.html',
  styleUrls: ['./offer-list-element.component.scss'],
  animations: [
    AnimationsFactory.makeEnterLeaveAnimation(
      'listElement',
      AnimationsFactory.animations.enter.fadeIn,
      AnimationsFactory.animations.leave.fadeOut
    )
  ]
})
export class OfferListElementComponent implements OnInit {

  @Input() offer: Offer;
  @Output() onDeleteClick = new EventEmitter<Offer>();
  public retrying: boolean = false;

  constructor(
    private dataStore: DataStoreService,
    private offerService: OfferService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  public onOfferEditClick() {
    this.openEditionDialog();
  }

  public onOfferDeleteClick() {
    this.onDeleteClick.emit(this.offer);
  }

  public onRetryButtonClick() {
    this.retrying = true;
    this.offerService.updateOffer(this.offer).subscribe((offer: Offer) => {
      this.offer = offer;
      this.dataStore.updateOffer(offer);
      this.retrying = false;
    }, error => {
      this.retrying = false;
    })
  }

  openEditionDialog(): void {
    const dialogRef = this.dialog.open(OfferEditModalComponent, {
      data: this.offer
    });
  }

  openPricesChartDialog(): void {
    const dialogRef = this.dialog.open(PricesChartModalComponent, {
      data: this.offer
    });
  }
}
