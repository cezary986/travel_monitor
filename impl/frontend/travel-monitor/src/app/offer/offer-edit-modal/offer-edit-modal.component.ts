import { Component, OnInit, Inject } from '@angular/core';
import { Offer } from 'src/app/common/models/offer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataStoreService } from '../data-store.service';
import { OfferService } from 'src/app/common/services/offer.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offer-edit-modal',
  templateUrl: './offer-edit-modal.component.html',
  styleUrls: ['./offer-edit-modal.component.scss']
})
export class OfferEditModalComponent implements OnInit {

  public editForm: FormGroup;
  private offer: Offer;

  constructor(
    public dialogRef: MatDialogRef<OfferEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Offer,
    private dataStore: DataStoreService,
    private formBuilder: FormBuilder,
    private offerService: OfferService,
    private snackBarService: SnackbarService
  ) { 
    this.offer = {...this.data};
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      title: [this.offer.title, Validators.maxLength(300)],
      url: [this.offer.url, Validators.maxLength(600)]
    });
  }

  public onSubmitClick() {
    this.offer.url = this.editForm.value.url;
    this.offer.title = this.editForm.value.title;
    this.offerService.updateOffer(this.offer).subscribe((offer: Offer) => {
      this.dataStore.updateOffer(offer);
      this.snackBarService.info('Oferta została zapisana');
      this.dialogRef.close();
    }, error => {
      this.dialogRef.close();
    })
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }
}
