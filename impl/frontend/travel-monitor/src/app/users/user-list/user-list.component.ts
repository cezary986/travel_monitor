import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { UserService } from 'src/app/common/services/user.service';
import { PaginatedResponse } from 'src/app/pagination/paginated-response';
import { InfiniteScrollDataProvider } from 'src/app/pagination/infinite-scroll-data-provider';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public users: Observable<User[]> = null;
  public loading: Observable<boolean> = null;

  private paginatedResponse: PaginatedResponse<User>;
  private infiniteScrollData: InfiniteScrollDataProvider<User>;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchUsers();
  }

  private fetchUsers(query: string = null) {
    this.paginatedResponse = this.userService.getUsersList();
    this.paginatedResponse.setLimit(20);
    this.infiniteScrollData = new InfiniteScrollDataProvider<User>(this.paginatedResponse);
    this.users = this.infiniteScrollData.getDataObservable();
    this.loading = this.infiniteScrollData.isLoading();
    this.infiniteScrollData.getFirstPortion();
  }

}
