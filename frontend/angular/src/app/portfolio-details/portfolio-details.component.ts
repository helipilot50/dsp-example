import { Component } from '@angular/core';
import {
  Account, Brand, Exact, LIST_PORTFOLIOS, MAP_PORTFOLIO_ACCOUNTS,
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
import { Apollo, QueryRef } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notifyConfig } from '../snackBarDefaults';
import { UserChooserComponent } from '../user-chooser/user-chooser.component';
import { FetchResult } from '@apollo/client/core';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.css'],
})
export class PortfolioDetailsComponent {
  portfolio: Portfolio | undefined;
  loading: boolean = true;
  error: any;
  isNew: boolean = false;

  private portfolioQuery: QueryRef<PortfolioQuery, Exact<{ portfolioId: string; }>> | undefined;

  constructor(private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location
  ) {

  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['portfolioId'];
    this.isNew = id === 'new';
    if (this.isNew) {
      console.debug('[PortfolioDetailsComponent.onInit] new portfolio');
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
      this.portfolioQuery = this.apollo.watchQuery<PortfolioQuery, PortfolioQueryVariables>({
        query: PORTFOLIO_DETAILS,
        variables: {
          portfolioId: id,

        }
      });
      this.portfolioQuery.valueChanges.subscribe((result) => {
        if (this.error) {
          console.error('[PortfolioDetailsComponent] portfolio error', this.error);
          this.snackBar.open(`[PortfolioDetailsComponent.onInit] error: ${JSON.stringify(this.error, null, 2)} `, 'OK');
          return;
        }
        console.debug('[PortfolioDetailsComponent] portfolio', result);
        if (result.data.portfolio) this.portfolio = result.data.portfolio as Portfolio;
        this.loading = result.loading;
        this.error = result.errors;

        // brands subscription
        this.apollo.subscribe<PortfolioBrandsModifiedSubscription, PortfolioBrandsModifiedSubscriptionVariables>({
          query: PORTFOLIO_BRANDS_MODIFIED,
          variables: {
            portfolioId: this.portfolio?.id as string
          }
        }).subscribe((result: FetchResult<PortfolioBrandsModifiedSubscription>) => {
          console.debug('[PortfolioDetailsComponent] brands updated subscription result', result);
          this.portfolioQuery?.refetch();
          this.snackBar.open(`Portfolio brands updated`, 'OK', notifyConfig);
        });

        // accounts subscription
        this.apollo.subscribe<PortfolioAccountsModifiedSubscription, PortfolioAccountsModifiedSubscriptionVariables>({
          query: PORTFOLIO_ACCOUNTS_MODIFIED,
          variables: {
            portfolioId: this.portfolio?.id as string
          }
        }).subscribe((result: FetchResult<PortfolioAccountsModifiedSubscription>) => {
          console.debug('[PortfolioDetailsComponent] accounts updated result', result);
          this.portfolioQuery?.refetch();
          this.snackBar.open(`Portfolio accounts updated`, 'OK', notifyConfig);
        });

        // users subscription
        this.apollo.subscribe<PortfolioUsersModifiedSubscription, PortfolioUsersModifiedSubscriptionVariables>({
          query: PORTFOLIO_USERS_MODIFIED,
          variables: {
            portfolioId: this.portfolio?.id as string
          }
        }).subscribe((result: FetchResult<PortfolioUsersModifiedSubscription>) => {
          console.debug('[PortfolioDetailsComponent] users updated result', result);
          if (this.portfolio) {
            this.portfolio.users = result.data?.portfolioUsersModified?.users as User[];
          }
          this.snackBar.open(`Portfolio users updated`, 'OK', notifyConfig);
        });
      });
    }
  }


  onFormSubmit() {
    console.debug('[PortfolioDetailsComponent.onFormSubmit', this.portfolio);
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
        console.error('[PortfolioDetailsComponent.createPortfolio] Error creating portfolio', errors);
        this.snackBar.open(`Error creating portfolio: ${errors[0].message} `, 'OK');
        this.location.back();
      }
      if (data) {
        console.debug('[PortfolioDetailsComponent.createPortfolio] New portfolio created', JSON.stringify(data, null, 2));
        const newPortfolioId = (data as any).newPortfolio.id;
        this.snackBar.open(`New portfolio created, id: ${newPortfolioId} `, 'OK', notifyConfig);
        this.location.back();
      }
    });

  }

  portfolioUsers(users: User[]) {
    console.debug("[PortfolioDetailsComponent.portfolioAccounts] portfolio: ", this.portfolio);
    console.debug("[PortfolioDetailsComponent.portfolioUsers] users: ", users);
    this.apollo.mutate<MapUsersToPortfolioMutation, MapUsersToPortfolioMutationVariables>({
      mutation: MAP_PORTFOLIO_USERS,
      variables: {
        portfolioId: this.portfolio?.id as string,
        userIds: users.map(b => b.id),
      },
      refetchQueries: [{
        query: PORTFOLIO_DETAILS,
        variables: {
          portfolioId: this.portfolio?.id
        }
      }]
    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[PortfolioDetailsComponent.portfolioUsers] Error mapping portfolio users', errors);
        this.snackBar.open(`Error mapping portfolio users: ${errors[0].message} `, 'OK');
      }
      if (data) {
        console.debug('[PortfolioDetailsComponent.portfolioUsers] portfolio users mapped', JSON.stringify(data, null, 2));
      }
    });
  }

  portfolioAccounts(accounts: Account[]) {
    console.debug("[PortfolioDetailsComponent.portfolioAccounts] portfolio: ", this.portfolio);
    console.debug("[PortfolioDetailsComponent.portfolioAccounts] accounts: ", accounts);
    this.apollo.mutate<MapAccountsToPortfolioMutation, MapAccountsToPortfolioMutationVariables>({
      mutation: MAP_PORTFOLIO_ACCOUNTS,
      variables: {
        portfolioId: this.portfolio?.id as string,
        accountIds: accounts.map(b => b.id as string),
      },
      refetchQueries: [{
        query: PORTFOLIO_DETAILS,
        variables: {
          portfolioId: this.portfolio?.id as string
        }
      }]
    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[PortfolioDetailsComponent.portfolioAccounts] Error mapping portfolio accounts', errors);
        this.snackBar.open(`Error mapping portfolio accounts: ${errors[0].message} `, 'OK');
      }
      if (data) {
        console.debug('[PortfolioDetailsComponent.portfolioAccounts] portfolio accounts mapped', JSON.stringify(data, null, 2));
      }
    });
  }


  portfolioBrands(brands: Brand[]) {
    console.debug("[PortfolioDetailsComponent.portfolioAccounts] portfolio: ", this.portfolio);
    console.debug("[PortfolioDetailsComponent.portfolioBrands] brands: ", brands);
    this.apollo.mutate<MapBrandsToPortfolioMutation, MapBrandsToPortfolioMutationVariables>({
      mutation: MAP_PORTFOLIO_BRANDS,
      variables: {
        portfolioId: this.portfolio?.id as string,
        brandIds: brands.map(b => b.id),
      },
      refetchQueries: [{
        query: PORTFOLIO_DETAILS,
        variables: {
          portfolioId: this.portfolio?.id
        }
      }]
    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[PortfolioDetailsComponent.portfolioBrands] Error mapping portfolio brands', errors);
        this.snackBar.open(`Error mapping portfolio brands: ${errors[0].message} `, 'OK');
      }
      if (data) {
        console.debug('[PortfolioDetailsComponent.portfolioBrands] portfolio brands mapped', JSON.stringify(data, null, 2));
      }
    });
  }

  saveDetails(form: any) {
    console.debug("[PortfolioDetailsComponent.saveDetails] clicked");
    alert('update portfolio not implemented yet' + JSON.stringify(form.value, null, 4));
  }

}
