import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Travel } from 'src/app/common/models/travel';
import { DataStoreService } from '../data-store.service';
import { TravelService } from 'src/app/common/services/travel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimationsFactory } from 'src/app/common/animations';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';

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

  @Output() onClick = new EventEmitter<Travel>();
  @Input() travel: Travel;
  @Input() embeded?: boolean = false;
  @ViewChild('titleInput', null) titleInput; 

  private editing: boolean = false;
  public editiedTitle: string;

  constructor(
    private dataStore: DataStoreService,
    private travelService: TravelService,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
  }

  public onTravelDeleteClick() {
    this.travelService.deteleTravel(this.travel.id).subscribe((res) => {
      this.dataStore.removeTravel(this.travel);
      //this._snackBar.open('Podróż zostałą usunięta');
      this.snackbarService.info('Podróż zostałą usunięta');
    })
  }

  public onTravelEditClick() {
    this.editiedTitle = this.travel.title;
    this.editing = true;
    setTimeout(function() {
      this.titleInput.nativeElement.focus();
    }.bind(this), 200)
  }

  public onSaveButtonClick() {
    this.travel.title = this.editiedTitle;
    this.editing = false;
    this.travelService.update(this.travel).subscribe((res) => {
      this._snackBar.open('Zapisano zmiany');
    });
  }

  public onCancelButtonClick() {
    this.editing = false;
  }
}
