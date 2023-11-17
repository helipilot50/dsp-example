import { Component } from '@angular/core';
import { Brand, BrandQuery, BrandQueryVariables, Sku } from 'not-dsp-graphql';
import { BRAND_DETAILS } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { DetailsComponent } from '../detail-component';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent extends DetailsComponent {

  brand: Brand | undefined = undefined;
  loading: boolean = true;

  ngOnInit(): void {
    const id = this.route.snapshot.params['brandId'];
    this.apollo.watchQuery<BrandQuery, BrandQueryVariables>({
      query: BRAND_DETAILS,
      variables: {
        brandId: id
      }
    }).valueChanges.subscribe((result) => {
      console.log(result);
      this.brand = result.data.brand ? result.data.brand as Brand : undefined;
      this.loading = result.loading;
      this.displayError(result.error);
    });
  }
  saveDetails(form: any) {
    alert('Brand Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}
