import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataStoreService } from '../data-store.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OfferService } from 'src/app/common/services/offer.service';
import { Offer } from 'src/app/common/models/offer';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { SupportedDomainsService } from 'src/app/common/services/supported-domains.service';
import { getUrlDomainIfSupported } from '../utils';
import { supportedDomainValidator } from '../validators/supported-domain-validator';

@Component({
  selector: 'app-offer-add',
  templateUrl: './offer-add.component.html',
  styleUrls: ['./offer-add.component.scss']
})
export class OfferAddComponent implements OnInit {

  @Input() travelId: number;
  public collapsed: boolean = true;
  public offerAddForm: FormGroup;
  private supportedDomains: string[];
  @ViewChild('urlInput', null) urlInput;
  public initialized: boolean = false;

  constructor(
    private dataStore: DataStoreService,
    private offerService: OfferService,
    private supportedDomainsService: SupportedDomainsService,
    private snackBarService: SnackbarService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.supportedDomainsService.getSupportedDomains().subscribe((domains: string[]) => {
      this.supportedDomains = domains;
      this.offerAddForm = this.formBuilder.group({
        url: ['', [Validators.required, Validators.maxLength(600), supportedDomainValidator(domains)]],
      });

      this.initialized = true;
    });
  }

  public onAddButtonClick() {
    this.collapsed = false;
    setTimeout(function () {
      this.urlInput.nativeElement.focus();
    }.bind(this), 200)
  }

  public onSaveButtonClick() {
    const url = this.offerAddForm.value.url;
    const dataProvider = getUrlDomainIfSupported(this.supportedDomains, url);
    this.offerService.addOfferToTravel(
      this.travelId,
      url
    )
      .subscribe((offer: Offer) => {
        this.dataStore.addNewOffer(offer);
        this.clearForm();
        this.snackBarService.info('Zapisano nową oferte. Jej dane mogą być widoczne dopier po chwili');
      })
  }

  public clearForm() {
    this.collapsed = true;
    this.offerAddForm.reset();
  }

}
