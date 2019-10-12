import { Component, OnInit, Input } from '@angular/core';
import { AnimationsFactory } from 'src/app/common/animations';
import { Travel } from 'src/app/common/models/travel';
import { TravelService } from 'src/app/common/services/travel.service';
import { User } from 'src/app/common/models/user';

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
  public users: User[] = null;
  @Input() set travelId(travelId: number) {
    if (travelId !== undefined && travelId !== null) {
      this.fetchTravel(travelId);
      this.getUsersForTravel(travelId);
    }
  }

  constructor(
    private travelService: TravelService
  ) { }

  ngOnInit() {
  }

  private fetchTravel(travelId: number) {
    this.travelService.getTravel(travelId).subscribe(travel => {
      this.travel = travel;
    });
  }

  private getUsersForTravel(travelId: number) {
    this.travelService.getUsersWithPermissionsForTravel(travelId).subscribe(users => {
      this.users = users;
    });
  }

}
