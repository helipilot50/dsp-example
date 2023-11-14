import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountListComponent } from './account-list/account-list.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioListComponent } from './portfolio-list/portfolio-list.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';


import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectCountryModule, MatSelectCountryLangToken } from "@angular-material-extensions/select-country";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { LayoutModule } from '@angular/cdk/layout';
import { RetailerDetailsComponent } from './retailer-details/retailer-details.component';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { LineitemListComponent } from './lineitem-list/lineitem-list.component';
import { LineitemDetailComponent } from './lineitem-detail/lineitem-detail.component';
import { AccountChooserComponent } from './account-chooser/account-chooser.component';
import { BrandChooserComponent } from './brand-chooser/brand-chooser.component';
import { UserChooserComponent } from './user-chooser/user-chooser.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountDetailsComponent,
    AccountListComponent,
    CampaignListComponent,
    CampaignDetailsComponent,
    RetailerDetailsComponent,
    RetailerListComponent,
    ProductDetailsComponent,
    ProductListComponent,
    BrandDetailsComponent,
    BrandListComponent,
    LineitemListComponent,
    LineitemDetailComponent,
    DashboardComponent,
    PortfolioListComponent,
    PortfolioDetailsComponent,
    AccountChooserComponent,
    BrandChooserComponent,
    UserChooserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectCountryModule.forRoot("en"), //https://www.npmjs.com/package/@angular-material-extensions/select-country#installation
    ReactiveFormsModule,
    FormsModule,

    LayoutModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
