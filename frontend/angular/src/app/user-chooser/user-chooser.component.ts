import { ENTER, COMMA, U } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { User, UsersQuery, UsersQueryVariables, USER_LIST } from 'not-dsp-graphql';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'user-chooser',
  templateUrl: './user-chooser.component.html',
  styleUrls: ['./user-chooser.component.css']
})
export class UserChooserComponent {
  users: User[] = [];
  allUsers: User[] = [];

  loading: boolean = false;
  error: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  usersCtrl = new FormControl('');
  filteredUsers: Observable<User[]>;
  @ViewChild('userInput')
  userInput!: ElementRef<HTMLInputElement>;

  constructor(private apollo: Apollo,
    private snackBar: MatSnackBar) {

    this.filteredUsers = this.usersCtrl.valueChanges.pipe(
      startWith(null),
      map((countryName: string | null) => (countryName ? this._filterUser(countryName) : this.allUsers.slice())),
    );

  }

  ngOnInit(): void {
    this.apollo.watchQuery<UsersQuery, UsersQueryVariables>({
      query: USER_LIST,
      fetchPolicy: 'cache-first'
    }).valueChanges.subscribe((result) => {
      console.log(result);
      this.allUsers = result.data.users ? result.data.users as User[] : [];
      this.loading = result.loading;
      this.error = result.errors;
      if (this.error) {
        this.snackBar.open(`Portfolio error: ${JSON.stringify(this.error, null, 2)} `, 'OK');
      }
    });
  }

  removeUser(user: User): void {

    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  userSelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[UserChooserComponent.selected] viewValue', viewValue);
    this.users.push(this.allUsers.find(user => this.userToChipString(user) === viewValue) as User);
    this.userInput.nativeElement.value = '';
    this.usersCtrl.setValue(null);
  }

  private _filterUser(value: any): User[] {
    if (value === null)
      return [];
    console.log('[UserChooserComponent._filterUser] value', value);
    let filterValue: string = value.toString().toLowerCase();

    const found = this.allUsers.filter(user => this.userToChipString(user as User).toLowerCase().includes(filterValue));
    console.log('[UserChooserComponent._filterUser] found', found);
    return found;
  }

  userToChipString(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
