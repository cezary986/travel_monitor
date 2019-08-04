import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Travel } from 'src/app/common/models/travel';
import { DataStoreService } from '../data-store.service';
import { TravelService } from 'src/app/common/services/travel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-travel-list-element',
  templateUrl: './travel-list-element.component.html',
  styleUrls: ['./travel-list-element.component.scss']
})
export class TravelListElementComponent implements OnInit {

  @Output() onClick = new EventEmitter<Travel>();
  @Input() travel: Travel;
  @ViewChild('titleInput', null) titleInput; 

  private editing: boolean = false;
  public editiedTitle: string;

  constructor(
    private dataStore: DataStoreService,
    private travelService: TravelService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  public onTravelDeleteClick() {
    this.travelService.deteleTravel(this.travel.id).subscribe((res) => {
      this.dataStore.removeTravel(this.travel);
      this._snackBar.open('Podróż zostałą usunięta');
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
