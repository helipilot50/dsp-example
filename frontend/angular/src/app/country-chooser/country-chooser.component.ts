import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER, COMMA, U } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { ALL_COUNTRIES, AllCountriesQuery, AllCountriesQueryVariables, Country, Maybe } from 'not-dsp-graphql';
import { startWith, map, Observable } from 'rxjs';


@Component({
  selector: 'country-chooser',
  templateUrl: './country-chooser.component.html',
  styleUrls: ['./country-chooser.component.css']
})
export class CountryChooserComponent {
  @Input()
  existingCountries: Maybe<Country>[] = [];
  @Output()
  currentCountries = new EventEmitter<Country[]>();
  selectedCountries: Country[] = [];

  allCountries: Country[] = [];

  loading: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  countriesCtrl = new FormControl('');
  filteredCountries: Observable<Country[]>;
  @ViewChild('countryInput')
  countryInput!: ElementRef<HTMLInputElement>;

  constructor(private apollo: Apollo,
    private snackBar: MatSnackBar) {

    this.filteredCountries = this.countriesCtrl.valueChanges.pipe(
      startWith(null),
      map((countryName: string | null) => (countryName ? this._filterBrand(countryName) : this.allCountries.slice())),
    );

  }

  ngOnInit(): void {
    this.apollo.watchQuery<AllCountriesQuery, AllCountriesQueryVariables>({
      query: ALL_COUNTRIES,
      fetchPolicy: 'cache-and-network'

    }).valueChanges.subscribe((result: any) => {
      this.allCountries = result.data.countries ? result.data.countries as Country[] : [];
      this.loading = result.loading;
      if (result.errors) {
        this.snackBar.open(`[CountryChooserComponent.ngOnInit] error: ${JSON.stringify(result.errors, null, 2)} `, 'OK');
      }
    });
    this.selectedCountries = this.existingCountries.filter(country => country !== null) as Country[];
    console.log('[CountryChooserComponent.ngOnInit] selectedCounties', this.selectedCountries);

  }

  countrySelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[CountryChooserComponent.selected] viewValue', viewValue);
    this.selectedCountries.push(this.allCountries.find(country => this.countryToChipString(country) === viewValue) as Country);
    this.countryInput.nativeElement.value = '';
    this.countriesCtrl.setValue(null);
    this.currentCountries.emit(this.selectedCountries as Country[]);
  }

  removeCountry(brand: Country): void {

    const index = this.existingCountries.indexOf(brand);

    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
    this.currentCountries.emit(this.selectedCountries as Country[]);
  }

  private _filterBrand(value: any): Country[] {
    if (value === null)
      return [];
    console.log('[CountryChooserComponent._filterBrand] value', value);
    let filterValue: string = value.toString().toLowerCase();

    const found = this.allCountries.filter(country => this.countryToChipString(country as Country).toLowerCase().includes(filterValue));
    console.log('[CountryChooserComponent._filterBrand] found', found);
    return found;
  }

  countryToChipString(country: Country): string {
    return country.name;
  }
}
