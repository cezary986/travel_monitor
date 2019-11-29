import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input() placeholder: string = null;
  @Input() withSubmit = false;
  @Output() searchQueryChange: EventEmitter<string> = new EventEmitter();
  @Output() searchButtonClick: EventEmitter<string> = new EventEmitter();
  public query: string = null;

  constructor() { }

  ngOnInit() {
  }

  public onTextQueryChange(event: Event) {
    this.searchQueryChange.emit(this.query);
  }

  public onSearchButtonClick() {
    this.searchButtonClick.emit(this.query);
  }

  public onClearButtonClick() {
    this.query = null;
    this.searchButtonClick.emit('');
  }
}
