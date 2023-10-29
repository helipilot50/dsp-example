import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { SkuDetailsComponent } from './sku-details/sku-details.component';
import { SkuListComponent } from './sku-list/sku-list.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { RetailerDetailsComponent } from './retailer-details/retailer-details.component';
import { LineitemListComponent } from './lineitem-list/lineitem-list.component';
import { LineitemDetailComponent } from './lineitem-detail/lineitem-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'accounts',
    component: AccountListComponent
  },
  {
    path: 'accounts/:accountId',
    component: AccountDetailsComponent
  },
  {
    path: 'accounts/:accountId/campaigns',
    component: CampaignListComponent
  },
  {
    path: 'accounts/:accountId/campaigns/:campaignId',
    component: CampaignDetailsComponent
  },
  {
    path: 'retailers',
    component: RetailerListComponent
  },
  {
    path: 'retailers/:retailerId',
    component: RetailerDetailsComponent
  },
  {
    path: 'retailers/:retailerId/campaigns',
    component: CampaignListComponent
  },
  {
    path: 'retailers/:retailerId/campaigns/:campaignId',
    component: CampaignDetailsComponent
  },
  {
    path: 'campaigns/:campaignId',
    component: CampaignDetailsComponent
  },
  {
    path: 'accounts/:accountId/campaigns/:campaignId/lineitems',
    component: LineitemListComponent
  },
  {
    path: 'accounts/:accountId/campaigns/:campaignId/lineitems/:lineitemId',
    component: LineitemDetailComponent
  },
  {
    path: 'brands',
    component: BrandListComponent
  },
  {
    path: 'brands/:brandId',
    component: BrandDetailsComponent
  },
  {
    path: 'skus',
    component: SkuListComponent
  },
  {
    path: 'skus/:skuKey',
    component: SkuDetailsComponent
  },
  {
    path: 'lineitems/:lineitemId',
    component: LineitemDetailComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
