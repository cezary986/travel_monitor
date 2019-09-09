import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  @Input() files: File[] = [];
  @Output() onFileDelete: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onDeleteFileClick(index: number) {
    this.onFileDelete.emit(index);
  }
}
