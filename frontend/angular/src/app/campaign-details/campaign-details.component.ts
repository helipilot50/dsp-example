import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Apollo } from 'apollo-angular';
import {
  BudgetType, Campaign, CampaignQuery,
  CampaignQueryVariables, CampaignStatus,
  CampaignType, Lineitem, NewCampaign,
  NewCampaignMutation,
  NewCampaignMutationVariables
} from 'not-dsp-graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { CAMPAIGNS_LIST, CAMPAIGN_DETAILS, CAMPAIGN_NEW } from 'not-dsp-graphql';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent {

  campaign: Campaign = {
    id: '',
    name: '',
    status: CampaignStatus.Unknown,
    type: CampaignType.Unknown,
    startDate: new Date(),
    endDate: new Date(),
  };
  loading: boolean = true;
  error: any;
  isNew: boolean = false;

  types: string[] = Object.values(CampaignType);
  statusValues: string[] = Object.values(CampaignStatus);


  lineitems: Lineitem[] = [];

  lineitemDisplayedColumns: string[] = ['id', 'name', 'status'];

  constructor(private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['campaignId'];

    this.isNew = id === 'new';

    if (this.isNew) {
      console.debug('new campaign');
      this.loading = false;
    } else {
      this.apollo.watchQuery<CampaignQuery, CampaignQueryVariables>({
        query: CAMPAIGN_DETAILS,
        variables: {
          campaignId: id
        }
      }).valueChanges.subscribe((result) => {
        console.debug(result);
        this.campaign = result.data.campaign as Campaign;
        this.loading = result.loading;
        this.error = result.errors;
      });
    }
  }

  onFormSubmit() {
    console.debug('form submit', this.campaign);
    if (this.isNew) {
      this.createCampaign(this.campaign);
    } else {
      this.updateCampaign(this.campaign);
    }
  }

  createCampaign(form: any) {
    const accountId = this.route.snapshot.params['accountId'];
    console.debug('create campaign', this.campaign, this.route.snapshot.params);

    const newACampaign: NewCampaign = {
      name: this.campaign.name || '',
      startDate: this.campaign.startDate || new Date(),
      endDate: this.campaign.endDate || new Date(),
      type: this.campaign.type,
      budget: {
        isCapped: false,
        type: BudgetType.Total,
        amount: 0

      }
    };

    this.apollo.mutate<NewCampaignMutation, NewCampaignMutationVariables>({
      mutation: CAMPAIGN_NEW,
      variables: {
        advertiserId: accountId,
        campaign: newACampaign
      },
      refetchQueries: [{
        query: CAMPAIGNS_LIST,
      },
      {
        query: CAMPAIGN_DETAILS,
      }]

    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('Error creating campaign', errors);
        alert(`Error creating campaign: ${errors[0].message}`);
        this.location.back();
      }
      if (data) {
        console.debug('New campaign created', JSON.stringify(data, null, 2));
        const newCampaignId = (data as any).newCampaign.id;
        alert(`New campaign created, id: ${newCampaignId} `);
        this.location.back();
      }
    });

  }

  updateCampaign(form: any) {
    const accountId = this.route.snapshot.params['accountId'];
    const id = this.route.snapshot.params['campaignId'];

    alert(`Campaign updated, id: ${this.campaign?.id} (fake)`);
    console.debug('Update campaign', this.campaign);
    this.router.navigate(['/accounts', accountId, 'campaigns']);
  }
}
