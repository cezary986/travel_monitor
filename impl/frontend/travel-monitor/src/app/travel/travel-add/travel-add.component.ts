import { Component, OnInit, ViewChild } from '@angular/core';
import { TravelService } from 'src/app/common/services/travel.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { ADD_TRAVEL } from 'src/app/common/store/travels/actions';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

@Component({
  selector: 'app-travel-add',
  templateUrl: './travel-add.component.html',
  styleUrls: ['./travel-add.component.scss']
})
export class TravelAddComponent implements OnInit {

  public collapsed: boolean = true;
  @ViewChild('container', null) containerElement;

  public travelName: string = '';

  @ViewChild('titleInput', null) titleInput;

  constructor(
    private travelService: TravelService,
    private redux: NgRedux<IAppState>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
  }

  public onAddButtonClick() {
    this.collapsed = false;
    setTimeout(function () {
      this.titleInput.nativeElement.focus();
    }.bind(this), 100)
  }

  public onSaveButtonClick() {
    this.travelService.createTravel(this.travelName).subscribe((travel) => {
      this.redux.dispatch({ type: ADD_TRAVEL, payload: travel });
      this.clearForm();
      this.snackbarService.info("Dodano nową podróż!");
    }, (error) => {
      this.clearForm();
    });
  }

  private clearForm() {
    this.collapsed = true;
    this.travelName = '';
  }

}
