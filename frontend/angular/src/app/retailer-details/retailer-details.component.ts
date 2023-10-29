import { Component } from '@angular/core';
import { Retailer, RetailerQuery, RetailerQueryVariables, RetailerStatus } from 'not-dsp-graphql';
import { RETAILER_DETAILS } from 'not-dsp-graphql';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-retailer-details',
  templateUrl: './retailer-details.component.html',
  styleUrls: ['./retailer-details.component.css']
})
export class RetailerDetailsComponent {

  retailer: Retailer | undefined = undefined;
  loading: boolean = true;
  error: any;

  statuses: string[] = Object.values(RetailerStatus);

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['retailerId'];
    this.apollo.watchQuery<RetailerQuery, RetailerQueryVariables>({
      query: RETAILER_DETAILS,
      variables: {
        retailerId: id
      }
    }).valueChanges.subscribe((result) => {
      console.log(result);
      this.retailer = result.data.retailer ? result.data.retailer as Retailer : undefined;
      this.loading = result.loading;
      this.error = result.errors;
    });
  }
  saveDetails(form: any) {
    alert('Retailer Form Validated)' + JSON.stringify(form.value, null, 4));
  }
}

