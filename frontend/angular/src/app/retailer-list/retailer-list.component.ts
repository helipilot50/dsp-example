import { Component, OnInit, ViewChild } from '@angular/core';
import { Retailer, RetailersQuery, RetailersQueryVariables } from 'not-dsp-graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { RETAILER_LIST } from 'not-dsp-graphql';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.css']
})
export class RetailerListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status', 'countryOfOrigin'];

  retailers: Retailer[] = [];
  loading: boolean = true;
  error: any;
  datasource = new MatTableDataSource<Retailer>();

  offset: number = 0;
  limit: number = 10;
  retailersCount: number = 10;

  retailersQuery: any | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.retailersQuery = this.apollo.watchQuery<RetailersQuery, RetailersQueryVariables>({
      query: RETAILER_LIST,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
    });

    this.retailersQuery.valueChanges.subscribe((result: any) => {
      this.retailers = result.data.retailers?.retailers ? result.data.retailers?.retailers as Retailer[] : [];
      this.datasource.data = this.retailers;
      this.loading = result.loading;
      this.error = result.errors;
      this.retailersCount = result.data.retailers?.totalCount || 10;
      this.offset = result.data.retailers?.offset || 0;
      this.limit = result.data.retailers?.limit || 10;
      console.log(result.data.retailers);
    });
  }

  ngAfterViewInit() {
    console.debug("ngAfterViewInit");
    this.paginator.page.subscribe(page => {
      this.offset = page.pageIndex * this.limit;
      this.limit = page.pageSize;
      console.debug("ngAfterViewInit", page, this.offset, this.limit);
      this.fetchMore();
    });
  }

  fetchMore() {

    console.debug("fetchMore", this.offset, this.limit, this.retailers.length);
    this.retailersQuery?.fetchMore({
      variables: {
        offset: this.offset,
        limit: this.limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        // console.debug("updateQuery", prev, fetchMoreResult);
        if (!fetchMoreResult) return prev;
        console.debug("updateQuery prev", prev);
        console.debug('updateQuery fetchMore', fetchMoreResult);
        return Object.assign({}, prev, {
          retailers: {
            ...prev.retailers,
            retailers: [...fetchMoreResult.retailers.retailers],
          }
        });
      }
    });
    return;
  }

  clickedRow(row: Retailer) {
    console.log(row);
    this.router.navigate(['/retailers', row.id]);
  }

}
