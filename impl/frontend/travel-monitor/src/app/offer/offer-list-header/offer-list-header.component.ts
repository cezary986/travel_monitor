import { Component, OnInit, Input } from '@angular/core';
import { DataStoreService } from '../data-store.service';
import { Travel } from 'src/app/common/models/travel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-offer-list-header',
  templateUrl: './offer-list-header.component.html',
  styleUrls: ['./offer-list-header.component.scss']
})
export class OfferListHeaderComponent {

  @Input() travelId: number;
}
