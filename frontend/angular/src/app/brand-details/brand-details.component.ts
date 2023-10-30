import { Component } from '@angular/core';
import { Brand, BrandQuery, BrandQueryVariables, Sku } from 'not-dsp-graphql';
import { BRAND_DETAILS } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent {

  brand: Brand | undefined = undefined;
  loading: boolean = true;
  error: any;


  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

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
      this.error = result.errors;
    });
  }
  saveDetails(form: any) {
    alert('Brand Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}
