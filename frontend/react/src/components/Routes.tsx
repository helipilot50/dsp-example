import { Navigate, Route, Routes, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

import { AccountsMain } from './AccountList';
import { AccountDetails } from './AccountDetails';
import { CampaignList } from './CampaignList';
import { CampaignDetails } from './CampaignDetails';
import { LineitemDetails } from './LineitemDetails';
import { LineitemList } from './LineitemList';
import { RetailerDetails } from './RetailerDetails';
import { BrandDetails } from './BrandDetails';
import { BrandsMain } from './BrandList';
import { SkuDetails } from './SkuDetails';
import { SkusMain } from './SkuList';
import { AllRetailerList } from './RetailerList';

import { Dashboard } from './Dashboard';

export function AppRoutes() {
  return (

    <Routes>
      <Route path="accounts" element={<AccountsMain />} />
      <Route path="accounts/new" element={<AccountDetails />} />
      <Route path="accounts/:accountId" element={<AccountDetails />} />
      <Route path="accounts/campaigns" element={<CampaignList />} />
      <Route path='accounts/:accountId/campaigns/:campaignId' element={<CampaignDetails />} />
      <Route path='accounts/:accountId/campaigns/:campaignId/lineitems' element={<LineitemList />} />
      <Route path='accounts/:accountId/campaigns/:campaignId/lineitems/:lineitemId' element={<LineitemDetails />} />
      <Route path="skus" element={<SkusMain />} />
      <Route path="skus/:skuKey" element={<SkuDetails />} />
      <Route path="brands" element={<BrandsMain />} />
      <Route path="brands/:brandId" element={<BrandDetails />} />
      <Route path="lineitems/:lineitemId" element={<LineitemDetails />} />
      <Route path="retailers/:retailerId" element={<RetailerDetails />} />
      <Route path="retailers/:retailerId/campaigns" element={<CampaignList />} />
      <Route path="retailers/:retailerId/campaigns/:campaignId" element={<CampaignDetails />} />
      <Route path='retailers/:retailerId/campaigns/:campaignId/lineitems' element={<LineitemList />} />
      <Route path='retailers/:retailerId/campaigns/:campaignId/lineitems/:lineitemId' element={<LineitemDetails />} />
      <Route path="retailers" element={<AllRetailerList />} />
      <Route path="/" element={<Navigate replace to='dashboard' />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
}