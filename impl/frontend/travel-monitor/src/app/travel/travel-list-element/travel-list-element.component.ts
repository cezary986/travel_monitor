import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Travel } from 'src/app/common/models/travel';
import { TravelService } from 'src/app/common/services/travel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimationsFactory } from 'src/app/common/animations';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { REMOVE_TRAVEL, UPDATE_TRAVEL } from 'src/app/common/store/travels/actions';

@Component({
  selector: 'app-travel-list-element',
  templateUrl: './travel-list-element.component.html',
  styleUrls: ['./travel-list-element.component.scss'],
  animations: [
    AnimationsFactory.makeEnterLeaveAnimation(
      'listElement',
      AnimationsFactory.animations.enter.fadeIn,
      AnimationsFactory.animations.leave.fadeOut
    )
  ]
})
export class TravelListElementComponent implements OnInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClick = new EventEmitter<Travel>();
  @Input() travel: Travel;
  @Input() embeded = false;
  @Input() actions?: { edit: boolean, delete: boolean} = { edit: true, delete: true};
  @ViewChild('titleInput', null) titleInput;

  private editing = false;
  public editiedTitle: string;

  constructor(
    private redux: NgRedux<IAppState>,
    private travelService: TravelService,
    // tslint:disable-next-line: variable-name
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
  }

  public onTravelDeleteClick() {
    this.travelService.deteleTravel(this.travel.id).subscribe((res) => {
      this.redux.dispatch({type: REMOVE_TRAVEL, payload: this.travel});
      this.snackbarService.info('Podróż zostałą usunięta');
    });
  }

  public onTravelEditClick() {
    this.editiedTitle = this.travel.title;
    this.editing = true;
    setTimeout(function() {
      this.titleInput.nativeElement.focus();
    }.bind(this), 200);
  }

  public onSaveButtonClick() {
    this.travel.title = this.editiedTitle;
    this.editing = false;
    this.travelService.update(this.travel).subscribe((res) => {
      this._snackBar.open('Zapisano zmiany');
      this.redux.dispatch({type: UPDATE_TRAVEL, payload: this.travel});
    });
  }

  public onCancelButtonClick() {
    this.editing = false;
  }
}
