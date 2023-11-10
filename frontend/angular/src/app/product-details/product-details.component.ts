import { Component } from '@angular/core';
import { Sku, SkuQuery, SkuQueryVariables } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { PRODUCT_DETAILS } from 'not-dsp-graphql';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  sku: Sku | undefined = undefined;
  loading: boolean = true;
  error: any;


  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['skuKey'];
    this.apollo.watchQuery<SkuQuery, SkuQueryVariables>({
      query: PRODUCT_DETAILS,
      variables: {
        skuKey: id
      }
    }).valueChanges.subscribe((result) => {
      console.log(result);
      this.sku = result.data.sku ? result.data.sku as Sku : undefined;
      this.loading = result.loading;
      this.error = result.errors;
    });
  }
  saveDetails(form: any) {
    console.debug("[ProductListComponent.saveDetails] clicked");
    alert('Product Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}


