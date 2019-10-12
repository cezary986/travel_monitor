import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/common/models/user';

@Component({
  selector: 'app-simple-user-list',
  templateUrl: './simple-user-list.component.html',
  styleUrls: ['./simple-user-list.component.scss']
})
export class SimpleUserListComponent implements OnInit {

  @Input() users: User[] = null;

  constructor() { }

  ngOnInit() {
  }

}
