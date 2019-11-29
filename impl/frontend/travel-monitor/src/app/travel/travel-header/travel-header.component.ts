import { Component, OnInit, Input } from '@angular/core';
import { AnimationsFactory } from 'src/app/common/animations';
import { Travel } from 'src/app/common/models/travel';
import { TravelService } from 'src/app/common/services/travel.service';
import { User } from 'src/app/common/models/user';
import { TravelShareComponent } from '../travel-share/travel-share.component';
import { MatDialog } from '@angular/material/dialog';
import { IAppState } from 'src/app/store';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { SET_OFFERS_TRAVEL_USERS, SET_OFFERS_TRAVEL } from 'src/app/common/store/offers/actions';

@Component({
  selector: 'app-travel-header',
  templateUrl: './travel-header.component.html',
  styleUrls: ['./travel-header.component.scss'],
  animations: [
    AnimationsFactory.makeEnterLeaveAnimation(
      'listElement',
      AnimationsFactory.animations.enter.fadeIn,
      AnimationsFactory.animations.leave.fadeOut
    )
  ]
})
export class TravelHeaderComponent implements OnInit {

  public travel: Travel = null;
  /** Users with persmissions for travel */
  @select((s: IAppState) => s.offers.travelData.users) users: Observable<User[]>;
  @Input() set travelId(travelId: number) {
    if (travelId !== undefined && travelId !== null) {
      this.fetchTravel(travelId);
      this.getUsersForTravel(travelId);
    }
  }

  constructor(
    private travelService: TravelService,
    public dialog: MatDialog,
    private redux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
  }

  private fetchTravel(travelId: number) {
    this.travelService.getTravel(travelId).subscribe(travel => {
      this.travel = travel;
      this.redux.dispatch({type: SET_OFFERS_TRAVEL, payload: travel});
    });
  }

  private getUsersForTravel(travelId: number) {
    this.travelService.getUsersWithPermissionsForTravel(travelId).subscribe(users => {
      this.redux.dispatch({type: SET_OFFERS_TRAVEL_USERS, payload: users});
    });
  }

  public onTravelShareButtonClick() {
    this.dialog.open(TravelShareComponent, {
      data: { travelId: this.travel.id, travelUsers: this.users },
    });
  }

  public onTravelEditClick() {
    // TODO
  }
}
