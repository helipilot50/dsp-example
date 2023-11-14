import { Component } from '@angular/core';
import {
  Account, Brand, LIST_PORTFOLIOS, MAP_PORTFOLIO_ACCOUNTS,
  MAP_PORTFOLIO_BRANDS, MAP_PORTFOLIO_USERS,
  MapAccountsToPortfolioMutation, MapAccountsToPortfolioMutationVariables,
  MapBrandsToPortfolioMutation, MapBrandsToPortfolioMutationVariables,
  MapUsersToPortfolioMutation, MapUsersToPortfolioMutationVariables,
  NEW_PORTFOLIO, NewPortfolio, NewPortfolioMutation, NewPortfolioMutationVariables,
  PORTFOLIO_ACCOUNTS_MODIFIED, PORTFOLIO_BRANDS_MODIFIED,
  PORTFOLIO_DETAILS, PORTFOLIO_USERS_MODIFIED, Portfolio,
  PortfolioAccountsModifiedSubscription, PortfolioAccountsModifiedSubscriptionVariables,
  PortfolioBrandsModifiedSubscription, PortfolioBrandsModifiedSubscriptionVariables,
  PortfolioQuery, PortfolioQueryVariables,
  PortfolioUsersModifiedSubscription, PortfolioUsersModifiedSubscriptionVariables, User
} from 'not-dsp-graphql';
import { Location } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notifyConfig } from '../snackBarDefaults';
import { UserChooserComponent } from '../user-chooser/user-chooser.component';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.css'],
})
export class PortfolioDetailsComponent {
  portfolio: Portfolio | undefined = undefined;
  loading: boolean = true;
  error: any;
  isNew: boolean = false;

  constructor(private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['portfolioId'];
    this.isNew = id === 'new';
    if (this.isNew) {
      console.debug('new portfolio');
      this.loading = false;
      this.portfolio = {
        id: '',
        name: '',
        description: '',
        accounts: [],
        brands: [],
        users: []
      };
    } else {
      this.apollo.watchQuery<PortfolioQuery, PortfolioQueryVariables>({
        query: PORTFOLIO_DETAILS,
        variables: {
          portfolioId: id
        }
      }).valueChanges.subscribe((result) => {
        console.log(result);
        this.portfolio = result.data.portfolio ? result.data.portfolio as Portfolio : undefined;
        this.loading = result.loading;
        this.error = result.errors;
        if (this.error) {
          this.snackBar.open(`Portfolio error: ${JSON.stringify(this.error, null, 2)} `, 'OK');
        }
      });
    }
  }

  onFormSubmit() {
    console.debug('form submit', this.portfolio);
    if (this.isNew) {
      this.createPortfolio(this.portfolio);
    } else {
      // TODO: update portfolio
    }
  }

  createPortfolio(form: any) {
    const accountId = this.route.snapshot.params['accountId'];
    console.debug('create portfolio', this.portfolio, this.route.snapshot.params);

    const newAPortfolio: NewPortfolio = {
      name: this.portfolio?.name as string,
      description: this.portfolio?.description as string,
      brandIds: this.portfolio?.brands?.map(b => b ? b.id : null) || [],
      accountIds: this.portfolio?.accounts?.map(a => a ? a.id : null) || [],
      userIds: this.portfolio?.users?.map(u => u ? u.id : null) || [],

    };
    this.apollo.mutate<NewPortfolioMutation, NewPortfolioMutationVariables>({

      mutation: NEW_PORTFOLIO,
      variables: {
        portfolio: newAPortfolio
      },
      refetchQueries: [{
        query: LIST_PORTFOLIOS,
      },
      {
        query: PORTFOLIO_DETAILS,
      }],

    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('Error creating portfolio', errors);
        this.snackBar.open(`Error creating portfolio: ${errors[0].message} `, 'OK');
        this.location.back();
      }
      if (data) {
        console.debug('New portfolio created', JSON.stringify(data, null, 2));
        const newPortfolioId = (data as any).newPortfolio.id;
        this.snackBar.open(`New portfolio created, id: ${newPortfolioId} `, 'OK', notifyConfig);
        this.location.back();
      }
    });

  }

  saveDetails(form: any) {
    console.debug("[PortfolioDetailsComponent.saveDetails] clicked");
    alert('Product Form Validated)' + JSON.stringify(form.value, null, 4));
  }

}
