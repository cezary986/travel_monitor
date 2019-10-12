import { Component, OnInit, OnDestroy } from '@angular/core';
import { OfferService } from 'src/app/common/services/offer.service';
import {  ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'src/app/common/models/offer';
import { DataStoreService } from '../data-store.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { Travel } from 'src/app/common/models/travel';
import { TravelService } from 'src/app/common/services/travel.service';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { Observable } from 'rxjs';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { SET_OFFERS_LIST, DELETE_OFFER } from '../store/actions';
import { IOffersState } from '../store/store';
import { TranslateService } from '@ngx-translate/core';
import { ROUTES } from 'src/app/app-routing.module';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit, OnDestroy {

  @select((s: IAppState) => s.offers) offersObject: Observable<IOffersState>;
  public travelId: number = null;
  public offersData: Offer[];
  public loading: Observable<boolean> = null;

  constructor(
    private dataStore: DataStoreService,
    private offerService: OfferService,
    private travelService: TravelService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService,
    private translate: TranslateService,
    private redux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.travelId = Number.parseInt(params.get('travelId'), 10);
      this.fetchOffers();
    });
  }

  ngOnDestroy(): void {}

  private fetchOffers() {
    const paginatedResponse = this.offerService.getOffers(this.travelId);
    paginatedResponse.setLimit(20);
    const infiniteScrollData = new InfiniteScrollDataProvider<Offer>(paginatedResponse);
    const data = infiniteScrollData.getDataObservable();
    this.loading = infiniteScrollData.isLoading();
    infiniteScrollData.getFirstPortion();
    data.subscribe(offers => {
      this.redux.dispatch({type: SET_OFFERS_LIST, payload: offers});
    });
    this.offersObject.subscribe((state: IOffersState) => {
      if (state.offers !== null) {
        this.offersData = Object.values(state.offers).reverse() as Offer[];
      }
    });
    infiniteScrollData.getErrorObservable().subscribe(error => {
      if (error !== null && error.status !== undefined) {
        if (error.status === 403) {
          this.snackBarService.error(this.translate.instant('offers.toasts.errors.permissions_denied'));
          this.router.navigate([ROUTES.travelsList.route]);
        }
      }
    });
  }

  private fetchTravel() {
    this.travelService.getTravel(this.travelId).subscribe((travel: Travel) => {
      this.dataStore.setTravel(travel);
    });
  }

  public onOfferDeleteClick(offer: Offer) {
    this.offerService.deleteOffer(offer.id).subscribe((res) => {
      this.redux.dispatch({type: DELETE_OFFER, payload: offer});
      this.snackBarService.info(this.translate.instant('offers.toasts.info.offer_deleted'));
    });
  }
}
