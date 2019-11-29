import { Component, OnInit, Input, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TravelService } from 'src/app/common/services/travel.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/common/models/user';
import { UserService } from 'src/app/common/services/user.service';
import { PaginatedResponse } from 'src/app/pagination/paginated-response';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { ADD_TRAVEL_USER, REMOVE_TRAVEL_USER } from 'src/app/common/store/offers/actions';

export interface ListElement {
  user: User;
  isAdded: boolean;
}

@Component({
  selector: 'app-travel-share',
  templateUrl: './travel-share.component.html',
  styleUrls: ['./travel-share.component.scss']
})
export class TravelShareComponent implements OnInit {

  private travelId: number;
  @select((s: IAppState) => s.offers.travelData.users) travelUsers: Observable<User[]>;
  private travelUsersHashMap = {};
  public loading: Observable<boolean> = null;
  private paginatedResponse: PaginatedResponse<User>;
  private infiniteScrollData: InfiniteScrollDataProvider<User>;
  private subscription: Subscription = null;
  public users: ListElement[] = null;
  public currentUserId: number;

  constructor(
    public dialogRef: MatDialogRef<TravelShareComponent>,
    private travelService: TravelService,
    private userService: UserService,
    private redux: NgRedux<IAppState>,
    private translate: TranslateService,
    private snackBarService: SnackbarService,
  ) { }

  ngOnInit() {
    const travelData = this.redux.getState().offers.travelData;
    this.travelId = travelData.travel.id;
    this.travelUsers.subscribe((users) => {
      for (const user of users) {
        this.travelUsersHashMap[user.id] = true;
      }
      this.fetchUsers();
    });
  }

  public onUserAdd(element: ListElement) {
    this.travelService.grantUserAccessForTravel(this.travelId, element.user).subscribe((res) => {
      element.isAdded = true;
      this.travelUsersHashMap[element.user.id] = true;
      this.redux.dispatch({type: ADD_TRAVEL_USER, payload: element.user});
      this.snackBarService.info(this.translate.instant('travels.toasts.success.access_granted'));
    }, error => {
      this.snackBarService.error(this.translate.instant('travels.toasts.errors.unknown'));
    });
  }

  public onUserRemove(element: ListElement) {
    this.travelService.removeUserAccessForTravel(this.travelId, element.user).subscribe((res) => {
      element.isAdded = false;
      delete this.travelUsersHashMap[element.user.id];
      this.redux.dispatch({type: REMOVE_TRAVEL_USER, payload: element.user});
      this.snackBarService.info(this.translate.instant('travels.toasts.success.access_removed'));
    }, error => {
      this.snackBarService.error(this.translate.instant('travels.toasts.errors.unknown'));
    });
  }

  private fetchUsers(query: string = null) {
    if (query === '') { query = null; }
    this.currentUserId = this.redux.getState().user.profile.id;
    this.paginatedResponse = this.userService.getUsersList(query);
    this.paginatedResponse.setLimit(20);
    this.infiniteScrollData = new InfiniteScrollDataProvider<User>(this.paginatedResponse);
    this.subscription = this.infiniteScrollData.getDataObservable().subscribe((el) => {
      this.users = el.map((user) => {
        return {
          user: user,
          isAdded: this.travelUsersHashMap[user.id]
        };
      });
    });
    this.loading = this.infiniteScrollData.isLoading();
    this.infiniteScrollData.getFirstPortion();
  }

  public onListScrollBottom() {
    this.infiniteScrollData.next();
  }

  public onSearchQueryChange(query: string) {
    if (this.infiniteScrollData !== undefined) {
      this.infiniteScrollData.discard();
      this.subscription.unsubscribe();
    }
    this.fetchUsers(query);
  }
}
