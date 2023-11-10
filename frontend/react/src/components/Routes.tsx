import { Navigate, Route, Routes } from 'react-router-dom';

import { AccountList } from './AccountList';
import { AccountDetails } from './AccountDetails';
import { CampaignList } from './CampaignList';
import { CampaignDetails } from './CampaignDetails';
import { LineitemDetails } from './LineitemDetails';
import { LineitemList } from './LineitemList';
import { RetailerDetails } from './RetailerDetails';
import { BrandDetails } from './BrandDetails';
import { BrandList } from './BrandList';
import { ProductDetails } from './ProductDetails';
import { ProductsList } from './PoductList';
import { AllRetailerList } from './RetailerList';

import { Dashboard } from './Dashboard';
import { SignedIn } from '@clerk/clerk-react';
import { PortfolioDetails } from './PortfolioDetails';
import { PortfolioList } from './PortfolioList';

export function AppRoutes() {
  return (

    <Routes>
      <Route path="accounts" element={<SignedIn><AccountList allowCreate /></SignedIn>} />
      <Route path="accounts/new" element={<SignedIn><AccountDetails /></SignedIn>} />
      <Route path="accounts/:accountId" element={<SignedIn><AccountDetails /></SignedIn>} />
      <Route path="accounts/campaigns" element={<SignedIn><CampaignList /></SignedIn>} />
      <Route path='accounts/:accountId/campaigns/:campaignId' element={<SignedIn><CampaignDetails /></SignedIn>} />
      <Route path='accounts/:accountId/campaigns/:campaignId/lineitems' element={<SignedIn><LineitemList /></SignedIn>} />
      <Route path='accounts/:accountId/campaigns/:campaignId/lineitems/:lineitemId' element={<SignedIn><LineitemDetails /></SignedIn>} />
      <Route path="portfolios" element={<SignedIn><SignedIn><PortfolioList /></SignedIn></SignedIn>} />
      <Route path="portfolios/:portfolioId" element={<SignedIn><SignedIn><PortfolioDetails /></SignedIn></SignedIn>} />
      <Route path="products" element={<SignedIn><ProductsList /></SignedIn>} />
      <Route path="products/:skuKey" element={<SignedIn><ProductDetails /></SignedIn>} />
      <Route path="brands" element={<SignedIn><SignedIn><BrandList /></SignedIn></SignedIn>} />
      <Route path="brands/:brandId" element={<SignedIn><SignedIn><BrandDetails /></SignedIn></SignedIn>} />
      <Route path="lineitems/:lineitemId" element={<SignedIn><LineitemDetails /></SignedIn>} />
      <Route path="retailers/:retailerId" element={<SignedIn><RetailerDetails /></SignedIn>} />
      <Route path="retailers/:retailerId/campaigns" element={<SignedIn><CampaignList /></SignedIn>} />
      <Route path="retailers/:retailerId/campaigns/:campaignId" element={<SignedIn><CampaignDetails /></SignedIn>} />
      <Route path='retailers/:retailerId/campaigns/:campaignId/lineitems' element={<SignedIn><LineitemList /></SignedIn>} />
      <Route path='retailers/:retailerId/campaigns/:campaignId/lineitems/:lineitemId' element={<SignedIn><LineitemDetails /></SignedIn>} />
      <Route path="retailers" element={<SignedIn><AllRetailerList /></SignedIn>} />
      <Route path="/" element={<Navigate replace to='dashboard' />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
}