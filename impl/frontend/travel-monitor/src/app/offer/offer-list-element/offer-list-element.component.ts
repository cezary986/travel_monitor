import { Component, OnInit, Input } from '@angular/core';
import { Offer } from 'src/app/common/models/offer';
import { AnimationsFactory } from 'src/app/common/animations';

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

  constructor() { }

  ngOnInit() {
  }

}
