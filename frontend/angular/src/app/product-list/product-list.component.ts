import { Component, OnInit, ViewChild } from '@angular/core';
import { Sku, SkusQuery, SkusQueryVariables } from 'not-dsp-graphql';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_LIST } from 'not-dsp-graphql';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['skuKey', 'name', 'description', 'price', 'quantity'];

  skus: Sku[] = [];
  displaySku: Sku[] = [];
  loading: boolean = true;
  error: any;
  datasource = new MatTableDataSource<Sku>();

  offset: number = 0;
  limit: number = 5;
  skusCount: number = 15;

  page: number = 0;

  skusQuery: any | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.skusQuery = this.apollo.watchQuery<SkusQuery, SkusQueryVariables>({
      query: PRODUCT_LIST,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
      fetchPolicy: 'cache-and-network'
    });
    this.skusQuery.valueChanges.subscribe((result: any) => {
      this.skus = result.data.skus?.skus ? result.data.skus?.skus as Sku[] : [];
      this.datasource.data = this.skus.slice(this.offset, this.offset + this.limit);
      this.loading = result.loading;
      this.error = result.errors;
      this.skusCount = result.data.skus?.totalCount;
      this.offset = result.data.skus?.offset;
      this.limit = result.data.skus?.limit;
      console.debug('[ProductListComponent.ngOnInit] offset, limit, page', this.offset, this.limit, this.page);
      console.debug('[ProductListComponent.ngOnInit] skus', result.data.skus);
    });

  }

  ngAfterViewInit() {
    console.debug("ngAfterViewInit");
    this.paginator.page.subscribe(page => {
      console.debug('[ProductListComponent.ngAfterViewInit] page event', page);
      const newPageindex = page.pageIndex;
      const previousPageindex = page.previousPageIndex || 0;

      this.offset = page.pageIndex * this.limit;
      this.page = this.offset / this.limit;
      this.limit = page.pageSize;
      console.debug('[ProductListComponent.ngAfterViewInit] offset, limit, page',
        this.offset, this.limit, this.page);
      console.debug('[ProductListComponent.ngAfterViewInit] skus',
        this.skus);

      if (newPageindex > previousPageindex)
        this.fetchNext(this.offset, this.limit);
      else
        this.fetchPrevious(this.offset, this.limit);
    });
  }

  fetchPrevious(offset: number, limit: number) {
    console.debug("[ProductListComponent.fetchPrevious]", offset, limit);
    this.datasource.data = this.skus.slice(offset, offset + limit);
  }

  fetchNext(offset: number, limit: number) {
    console.debug("[ProductListComponent.fetchNext]",
      offset, limit);
    this.skusQuery?.fetchMore({
      variables: {
        offset,
        limit
      },
      fetchPolicy: 'cache-and-network',
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        console.debug("[ProductListComponent.fetchNext.updateQuery]",
          prev,
          fetchMoreResult);
        const merged = Object.assign({}, prev, {
          skus: {
            ...prev.skus,
            skus: [...fetchMoreResult.skus.skus],
            offset,
            limit,
            totalCount: fetchMoreResult.skus.totalCount
          }
        });
        this.datasource.data = this.skus.slice(offset, offset + limit);
        return merged;
      }
    });
    return;
  }

  clickedRow(row: Sku) {
    console.debug('[ProductListComponent.clickedRow] row', row);
    this.router.navigate(['/products', row.skuKey]);
  }
}
