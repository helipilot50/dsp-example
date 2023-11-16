import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER, COMMA, U } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { ACCOUNTS_LIST, Account, AccountsQuery, AccountsQueryVariables, Maybe } from 'not-dsp-graphql';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'account-chooser',
  templateUrl: './account-chooser.component.html',
  styleUrls: ['./account-chooser.component.css']
})
export class AccountChooserComponent {
  @Input()
  existingAccounts: Maybe<Account>[] = [];

  @Output()
  currentAccounts = new EventEmitter<Account[]>();

  selectedAccounts: Account[] = [];

  allAccounts: Account[] = [];

  loading: boolean = false;
  error: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  accountsCtrl = new FormControl('');
  filteredAccounts: Observable<Account[]>;
  @ViewChild('accountInput')
  accountInput!: ElementRef<HTMLInputElement>;

  constructor(private apollo: Apollo,
    private snackBar: MatSnackBar) {

    this.filteredAccounts = this.accountsCtrl.valueChanges.pipe(
      startWith(null),
      map((accountName: string | null) => (accountName ? this._filterAccount(accountName) : this.allAccounts.slice())),
    );

  }


  ngOnInit(): void {
    this.apollo.watchQuery<AccountsQuery, AccountsQueryVariables>({
      query: ACCOUNTS_LIST,
      fetchPolicy: 'cache-and-network'

    }).valueChanges.subscribe((result: any) => {
      this.allAccounts = result.data.accounts ? result.data.accounts as Account[] : [];
      this.loading = result.loading;
      this.error = result.errors;
      if (this.error) {
        this.snackBar.open(`Accounts error: ${JSON.stringify(this.error, null, 2)} `, 'OK');
      }
      console.log("[AccountChooserComponent.ngOnInit] all Accounts", result.data.accounts);
    });
    this.selectedAccounts = this.existingAccounts.filter(account => account !== null) as Account[];
  }

  removeAccount(account: Account): void {

    const index = this.existingAccounts.indexOf(account);

    if (index >= 0) {
      this.selectedAccounts.splice(index, 1);
    }
    this.currentAccounts.emit(this.selectedAccounts as Account[]);
  }


  accountSelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[AccountChooserComponent.selected] viewValue', viewValue);
    this.selectedAccounts.push(this.allAccounts.find(account => this.accountToChipString(account) === viewValue) as Account);
    this.accountInput.nativeElement.value = '';
    this.accountsCtrl.setValue(null);
    this.currentAccounts.emit(this.selectedAccounts as Account[]);
  }

  private _filterAccount(value: any): Account[] {
    if (value === null)
      return [];
    console.log('[AccountChooserComponent._filterAccount] value', value);
    let filterValue: string = value.toString().toLowerCase();

    const found = this.allAccounts.filter(account => this.accountToChipString(account as Account).toLowerCase().includes(filterValue));
    console.log('[AccountChooserComponent._filterAccount] found', found);
    return found;
  }


  accountToChipString(account: Account): string {
    return account.name;
  }

}
