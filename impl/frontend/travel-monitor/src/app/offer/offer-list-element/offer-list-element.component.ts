import { Component, OnInit, Input } from '@angular/core';
import { Offer } from 'src/app/common/models/offer';

@Component({
  selector: 'app-offer-list-element',
  templateUrl: './offer-list-element.component.html',
  styleUrls: ['./offer-list-element.component.scss']
})
export class OfferListElementComponent implements OnInit {

  @Input() offer: Offer;

  constructor() { }

  ngOnInit() {
  }

}
