import { Component, OnInit, ViewChild } from '@angular/core';
import { LIST_PORTFOLIOS, Portfolio, PortfoliosQuery, PortfoliosQueryVariables } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent {
  displayedColumns: string[] = ['name', 'description'];

  portfolios: Portfolio[] = [];
  displaySku: Portfolio[] = [];
  loading: boolean = true;
  error: any;
  datasource = new MatTableDataSource<Portfolio>();

  portfoliosQuery: any | undefined;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.portfoliosQuery = this.apollo.watchQuery<PortfoliosQuery, PortfoliosQueryVariables>({
      query: LIST_PORTFOLIOS,
      fetchPolicy: 'cache-and-network'
    });
    this.portfoliosQuery.valueChanges.subscribe((result: any) => {
      this.portfolios = result.data.portfolios ? result.data.portfolios as Portfolio[] : [];
      this.datasource.data = this.portfolios;
      this.loading = result.loading;
      this.error = result.errors;
      console.debug('[PortfolioListComponent.ngOnInit] portfolios', result.data.portfolios);
    });

  }

  newPortfolio() {
    this.router.navigate(['/portfolios', 'new']);
  }


  clickedRow(row: Portfolio) {
    console.debug('[PortfolioListComponent.clickedRow] row', row);
    this.router.navigate(['/portfolios', row.id]);
  }
}
