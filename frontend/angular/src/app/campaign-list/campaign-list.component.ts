import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Campaign, CampaignsQuery, QueryCampaignsArgs } from 'not-dsp-graphql';
import { CAMPAIGNS_LIST } from 'not-dsp-graphql';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'status', 'startDate', 'endDate'];

  campaigns: Campaign[] = [];
  loading: boolean = true;
  error: any;
  accountId: string = '';
  datasource = new MatTableDataSource<Campaign>();

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['accountId'];
    const queryVars: QueryCampaignsArgs = {
      accountId: this.accountId
    };
    console.log('[CampaignListComponent.onInit] queryVars', queryVars);
    this.apollo.watchQuery<CampaignsQuery, QueryCampaignsArgs>({
      query: CAMPAIGNS_LIST,
      variables: queryVars
    }).valueChanges.subscribe(result => {
      this.campaigns = result.data.campaigns?.campaigns ? result.data.campaigns?.campaigns as Campaign[] : [];
      this.datasource.data = this.campaigns;
      this.loading = result.loading;
      this.error = result.errors;
      console.log('[CampaignListComponent.onInit] campaigns', this.campaigns);
    });
  }
  clickedRow(row: Campaign) {
    console.log(row);

    this.router.navigate(['/accounts', this.accountId, 'campaigns', row.id]);
  }

  newCampaign() {
    this.router.navigate(['/accounts', this.accountId, 'campaigns', 'new']);
  }

}
