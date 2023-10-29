import { Component } from '@angular/core';
import { Sku, SkuQuery, SkuQueryVariables } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { SKU_DETAILS } from '../graphql/skus.graphql';

@Component({
  selector: 'app-sku-details',
  templateUrl: './sku-details.component.html',
  styleUrls: ['./sku-details.component.css']
})
export class SkuDetailsComponent {

  sku: Sku | undefined = undefined;
  loading: boolean = true;
  error: any;


  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['skuKey'];
    this.apollo.watchQuery<SkuQuery, SkuQueryVariables>({
      query: SKU_DETAILS,
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
    alert('SKU Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}


