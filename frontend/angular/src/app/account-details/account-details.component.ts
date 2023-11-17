import { Component, ElementRef, OnInit, inject, ViewChild, } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Location } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ACCOUNTS_LIST, ACCOUNT_NEW, ACCOUNT_DETAILS } from 'not-dsp-graphql';

import { COMMA, ENTER } from '@angular/cdk/keycodes';


import {
  Account, AccountQuery, AccountQueryVariables,
  AccountType,
  AllCountriesQuery,
  AllCountriesQueryVariables,
  CurrencyCode,
  Country,
  NewAccount,
  NewAccountMutation,
  NewAccountMutationVariables,
  Retailer,
  RetailersQuery,
  RetailersQueryVariables,
} from 'not-dsp-graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ALL_COUNTRIES } from 'not-dsp-graphql';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { RETAILER_LIST } from 'not-dsp-graphql';
import { DetailsComponent } from '../detail-component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})



export class AccountDetailsComponent extends DetailsComponent implements OnInit {

  account: Account = {
    id: '',
    name: '',
    type: AccountType.Demand,
    currency: {
      code: CurrencyCode.Usd,
      name: 'US Dollar',
      symbol: '$'
    },
    countries: [],
    retailers: [],
  };
  loading: boolean = true;
  error: any;

  isNew = false;


  currencies: string[] = Object.values(CurrencyCode);
  types: string[] = Object.values(AccountType);

  allCountries: Country[] = [];
  countries: Country[] = [];

  allRetailers: Retailer[] = [];
  retailers: Retailer[] = [];

  //---------------------------------------------------

  separatorKeysCodes: number[] = [ENTER, COMMA];

  countryCtrl = new FormControl('');
  filteredCountries: Observable<Country[]>;
  @ViewChild('countryInput')
  countryInput!: ElementRef<HTMLInputElement>;

  retailersCtrl = new FormControl('');
  filteredRetailers: Observable<Retailer[]>;
  @ViewChild('retailerInput')
  retailerInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  //---------------------------------------------------

  constructor(protected override apollo: Apollo,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override snackBar: MatSnackBar,
    protected override location: Location,
    protected override formBuilder: FormBuilder
  ) {

    super(apollo, router, route, snackBar, location, formBuilder);
    //---------------------------------------------------
    this.filteredCountries = this.countryCtrl.valueChanges.pipe(
      startWith(null),
      map((countryName: string | null) => (countryName ? this._filterCountry(countryName) : this.allCountries.slice())),
    );
    //---------------------------------------------------
    this.filteredRetailers = this.retailersCtrl.valueChanges.pipe(
      startWith(null),
      map((retailerName: string | null): Retailer[] => (retailerName ? this._filterRetailer(retailerName) : this.allRetailers.slice())),
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['accountId'];
    this.isNew = id === 'new';
    // countries
    this.apollo.watchQuery<AllCountriesQuery, AllCountriesQueryVariables>({
      query: ALL_COUNTRIES,
      fetchPolicy: 'cache-first',
    }).valueChanges.subscribe(result => {
      console.log('[AccountDetailsComponent] country data', result.data);
      this.allCountries = result.data.countries as Country[];
    });
    // Retailers
    this.apollo.watchQuery<RetailersQuery, RetailersQueryVariables>({
      query: RETAILER_LIST,
      variables: {
        offset: 0,
        limit: 1000
      },
      fetchPolicy: 'cache-first',
    }).valueChanges.subscribe(result => {
      console.log('[AccountDetailsComponent] retailer data', result.data);
      this.allRetailers = result.data?.retailers?.retailers as Retailer[];
    });

    if (this.isNew) {
      console.log('[AccountDetailsComponent] new account');
      this.loading = false;

    } else {
      // console.log('[AccountDetailsComponent] ACCOUNT_DETAILS', ACCOUNT_DETAILS);
      this.apollo.watchQuery<AccountQuery, AccountQueryVariables>({
        query: ACCOUNT_DETAILS,
        fetchPolicy: 'cache-first',
        variables: {
          accountId: id
        }
      }).valueChanges.subscribe(result => {
        this.account = result.data.account as Account;
        console.log('[AccountDetailsComponent] account', this.account);

        if (this.account && this.account.countries) {
          let countries = this.account.countries as Country[];
          this.countries = countries;
          console.log('[AccountDetailsComponent] account countries', this.account.countries);
          this.retailers = this.account.retailers as Retailer[];
          console.log('[AccountDetailsComponent] account retailers', this.account.retailers);
        }
        this.loading = result.loading;
        this.error = result.errors;
      });
    }
  }

  onCountrySelected(event: any) { //https://github.com/angular-material-extensions/select-country/blob/master/src/app/app.component.ts
    console.log('[AccountDetailsComponent] country selected', event);
  }

  onRetailerSelected(event: any) {
    console.log('[AccountDetailsComponent] retailer selected', event);
  }

  onFormSubmit() {
    console.log('[AccountDetailsComponent] form submit', this.account);
    if (this.isNew) {
      this.createAccount();
    } else {
      this.updateAccount();
    }
  }

  createAccount() {

    const newAccount: NewAccount = {
      name: this.account.name,
      currency: this.account?.currency?.code || CurrencyCode.Usd,
      allowBrandedKeywords: false,
      countries: this.account.countries?.map((country: any) => country.code) as string[],
      type: this.account.type || AccountType.Demand,
    };

    console.log('[AccountDetailsComponent] create account', newAccount);

    this.apollo.mutate<NewAccountMutation, NewAccountMutationVariables>({
      mutation: ACCOUNT_NEW,
      variables: {
        account: newAccount
      },
      refetchQueries: [{
        query: ACCOUNTS_LIST,
      },
      {
        query: ACCOUNT_DETAILS,
      }]

    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[AccountDetailsComponent] Error creating account', errors);
        alert(`Error creating account: ${errors[0].message}`);
      }
      if (data) {
        console.log('[AccountDetailsComponent] New account created', JSON.stringify(data, null, 2));
        const newAccountId = data.newAccount?.id;
        alert(`New Account created, id: ${newAccountId} `);
        this.location.back();
      }
    });
  }

  updateAccount() {
    alert(`Account updated, id: ${this.account?.id} (fake)`);
    console.log('[AccountDetailsComponent] Update account', this.account);
    this.router.navigate(['/accounts']);
  }

  //----------------------------------------------------
  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add country
    if (value) {
      this.countries.push(this.allCountries.find(country => country.name === value) as Country);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.countryCtrl.setValue(null);
  }

  addRetailer(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add retailer
    if (value) {
      this.retailers.push(this.allRetailers.find(retailer => retailer.name === value) as Retailer);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.retailersCtrl.setValue(null);
  }

  removeCountry(country: Country): void {
    const index = this.countries.indexOf(country);

    if (index >= 0) {
      this.countries.splice(index, 1);

      this.announcer.announce(`Removed ${country.name}`);
    }
  }
  removeRetailer(retailer: Retailer): void {
    const index = this.retailers.indexOf(retailer);

    if (index >= 0) {
      this.retailers.splice(index, 1);

      this.announcer.announce(`Removed ${retailer.name}`);
    }
  }

  countrySelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[AccountDetailsComponent.selected] viewValue', viewValue);
    this.countries.push(this.allCountries.find(country => country.name === viewValue) as Country);
    this.countryInput.nativeElement.value = '';
    this.countryCtrl.setValue(null);
  }
  private _filterCountry(value: any): Country[] {
    if (value === null)
      return [];
    console.log('[AccountDetailsComponent._filterCountry] value', value);
    let filterValue: string = '';
    if (value.name)
      filterValue = value.name.toLowerCase();
    else
      filterValue = value.toLowerCase();
    const found = this.allCountries.filter(country => country.name.toLowerCase().includes(filterValue));
    console.log('[AccountDetailsComponent._filterCountry] found', found);
    return found;
  }
  retailerSelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[AccountDetailsComponent.retailerSelected] viewValue', viewValue);
    this.retailers.push(this.allRetailers.find(retailer => retailer.name === viewValue) as Retailer);
    this.retailerInput.nativeElement.value = '';
    this.retailersCtrl.setValue(null);
  }
  private _filterRetailer(value: any): Retailer[] {
    if (value === null)
      return [];
    console.log('[AccountDetailsComponent._filterRetailer] value', value);
    let filterValue: string = '';
    if (value.name)
      filterValue = value.name.toLowerCase();
    else
      filterValue = value.toLowerCase();
    const found = this.allRetailers.filter(retailer => retailer.name.toLowerCase().includes(filterValue));
    console.log('[AccountDetailsComponent._filterRetailer] found', found);
    return found;
  }
  //----------------------------------------------------

}
