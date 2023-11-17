import { Component } from '@angular/core';
import { Retailer, RetailerQuery, RetailerQueryVariables, RetailerStatus } from 'not-dsp-graphql';
import { RETAILER_DETAILS } from 'not-dsp-graphql';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { DetailsComponent } from '../detail-component';

@Component({
  selector: 'app-retailer-details',
  templateUrl: './retailer-details.component.html',
  styleUrls: ['./retailer-details.component.css']
})
export class RetailerDetailsComponent extends DetailsComponent {

  retailer: Retailer | undefined = undefined;
  loading: boolean = true;
  id: string = '';

  statuses: string[] = Object.values(RetailerStatus);


  ngOnInit(): void {
    this.id = this.route.snapshot.params['retailerId'];
    this.apollo.watchQuery<RetailerQuery, RetailerQueryVariables>({
      query: RETAILER_DETAILS,
      variables: {
        retailerId: this.id
      }
    }).valueChanges.subscribe((result) => {
      console.log(result);
      this.retailer = result.data.retailer ? result.data.retailer as Retailer : undefined;
      this.loading = result.loading;
      this.displayError(result.error);
    });
  }
  saveDetails(form: any) {
    alert('Retailer Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}

