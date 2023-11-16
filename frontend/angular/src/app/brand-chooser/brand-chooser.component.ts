import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER, COMMA, U } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { BRANDS_LIST, Brand, BrandsQuery, BrandsQueryVariables, Maybe, USER_LIST } from 'not-dsp-graphql';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'brand-chooser',
  templateUrl: './brand-chooser.component.html',
  styleUrls: ['./brand-chooser.component.css']
})
export class BrandChooserComponent {
  @Input()
  existingBrands: Maybe<Brand>[] = [];

  @Output()
  selectedBrands: Brand[] = [];

  allBrands: Brand[] = [];

  loading: boolean = false;
  error: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  brandsCtrl = new FormControl('');
  filteredBrands: Observable<Brand[]>;
  @ViewChild('brandInput')
  brandInput!: ElementRef<HTMLInputElement>;

  constructor(private apollo: Apollo,
    private snackBar: MatSnackBar) {

    this.filteredBrands = this.brandsCtrl.valueChanges.pipe(
      startWith(null),
      map((brandName: string | null) => (brandName ? this._filterBrand(brandName) : this.allBrands.slice())),
    );

  }

  ngOnInit(): void {
    this.apollo.watchQuery<BrandsQuery, BrandsQueryVariables>({
      query: BRANDS_LIST,
      variables: {
        offset: 0, // kludge
        limit: 1000 // kludge
      },
      fetchPolicy: 'cache-and-network'

    }).valueChanges.subscribe((result: any) => {
      this.allBrands = result.data.brands?.brands ? result.data.brands?.brands as Brand[] : [];
      this.loading = result.loading;
      this.error = result.errors;
      if (this.error) {
        this.snackBar.open(`Brands error: ${JSON.stringify(this.error, null, 2)} `, 'OK');
      }
      console.log("[BrandChooserComponent.ngOnInit] all Brands", result.data.brands);
    });
    this.selectedBrands = this.existingBrands.filter(brand => brand !== null) as Brand[];
  }

  removeBrand(brand: Brand): void {

    const index = this.existingBrands.indexOf(brand);

    if (index >= 0) {
      this.existingBrands.splice(index, 1);
    }
  }

  brandSelected(event: MatAutocompleteSelectedEvent): void {
    const viewValue = event.option.viewValue as string;
    console.log('[BrandChooserComponent.selected] viewValue', viewValue);
    this.existingBrands.push(this.allBrands.find(brand => this.brandToChipString(brand) === viewValue) as Brand);
    this.brandInput.nativeElement.value = '';
    this.brandsCtrl.setValue(null);
  }

  private _filterBrand(value: any): Brand[] {
    if (value === null)
      return [];
    console.log('[BrandChooserComponent._filterBrand] value', value);
    let filterValue: string = value.toString().toLowerCase();

    const found = this.allBrands.filter(brand => this.brandToChipString(brand as Brand).toLowerCase().includes(filterValue));
    console.log('[BrandChooserComponent._filterBrand] found', found);
    return found;
  }


  brandToChipString(brand: Brand): string {
    return brand.name;
  }
}
