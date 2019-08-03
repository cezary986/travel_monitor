import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Travel } from 'src/app/common/models/travel';
import { DataStoreService } from '../data-store.service';

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
    private dataStore: DataStoreService
  ) { }

  ngOnInit() {
  }

  public onTravelDeleteClick() {
    this.dataStore.removeTravel(this.travel);

  }

  public onTravelEditClick() {
    this.editiedTitle = this.travel.title;
    this.editing = true;
    setTimeout(function() {
      this.titleInput.nativeElement.focus();
    }.bind(this), 200)
  }

  public onSaveButtonClick() {
    console.log('werer');
    
    this.travel.title = this.editiedTitle;
    // TODO zapisac w API
    this.editing = false;
  }

  public onCancelButtonClick() {
    this.editing = false;
  }
}
