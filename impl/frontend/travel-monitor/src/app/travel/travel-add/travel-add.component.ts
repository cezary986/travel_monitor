import { Component, OnInit, ViewChild } from '@angular/core';
import { TravelService } from 'src/app/common/services/travel.service';
import { DataStoreService } from '../data-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

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
    private dataStore: DataStoreService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  public onAddButtonClick() {
    this.collapsed =false;
    setTimeout(function () {
      this.titleInput.nativeElement.focus();
    }.bind(this), 200)
  }



  public onSaveButtonClick() {
    this.travelService.createTravel(this.travelName).subscribe((travel) => {
      this.dataStore.addTravel(travel);
      this.clearForm();
      this._snackBar.open("Dodano nową podróż!", null, { duration: environment.snackBarDuration })
    }, (error) => {
      this.clearForm();
    })
  }

  private clearForm() {
    this.collapsed = true;
    this.travelName = '';
  }

}
