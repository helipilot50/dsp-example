import { Component, OnInit, ViewChild } from '@angular/core';
import { Brand, BrandsQuery, BrandsQueryVariables } from 'not-dsp-graphql';
import { BRANDS_LIST } from '../graphql/brands.graphql';
import { Apollo, QueryRef } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'value', 'country', 'industry'];

  brands: Brand[] = [];
  loading: boolean = true;
  error: any;
  datasource = new MatTableDataSource<Brand>();

  offset: number = 0;
  limit: number = 10;
  brandsCount: number = 10;

  page: number = 0;

  brandsQuery: any | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.brandsQuery = this.apollo.watchQuery<BrandsQuery, BrandsQueryVariables>({
      query: BRANDS_LIST,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
      fetchPolicy: 'cache-and-network'

    });

    this.brandsQuery.valueChanges.subscribe((result: any) => {
      this.brands = result.data.brands?.brands ? result.data.brands?.brands as Brand[] : [];
      this.datasource.data = this.brands;
      this.loading = result.loading;
      this.error = result.errors;
      this.brandsCount = result.data.brands?.totalCount || 10;
      this.offset = result.data.brands?.offset || 0;
      this.limit = result.data.brands?.limit || 10;
      this.page = this.offset / this.limit;
      console.log(result.data.brands);
    });
  }
  ngAfterViewInit() {
    console.debug("ngAfterViewInit");
    this.paginator.page.subscribe(page => {
      this.offset = page.pageIndex * this.limit;
      this.limit = page.pageSize;
      this.page = this.offset / this.limit;
      console.debug("ngAfterViewInit", page, this.offset, this.limit);
      this.fetchMore();
    });

    //https://github.com/abcox/toybox-web-ng2/blob/main/src/app/contact/contact-list/contact-list.component.ts
  }


  fetchMore() {

    console.debug("fetchMore", this.offset, this.limit, this.brands.length);
    this.brandsQuery?.fetchMore({
      variables: {
        offset: this.offset,
        limit: this.limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          brands: {
            ...prev.brands,
            brands: [...fetchMoreResult.brands.brands],
          }
        });
      }
    });
    return;
  }


  clickedRow(row: Brand) {
    console.log(row);
    this.router.navigate(['/brands', row.id]);
  }
};


