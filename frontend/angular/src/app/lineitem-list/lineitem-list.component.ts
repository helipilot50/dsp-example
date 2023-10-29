import { Component, OnInit, ViewChild } from '@angular/core';
import { LINEITEM_LIST } from 'not-dsp-graphql';
import { Lineitem, LineitemsQuery, QueryLineitemsArgs } from 'not-dsp-graphql';
import { Apollo, QueryRef } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lineitem-list',
  templateUrl: './lineitem-list.component.html',
  styleUrls: ['./lineitem-list.component.css']
})
export class LineitemListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status', 'startDate', 'endDate'];

  lineitems: Lineitem[] = [
  ];
  loading: boolean = true;
  error: any;
  accountId: string = '';
  campaignId: string = '';
  datasource = new MatTableDataSource<Lineitem>();

  offset: number = 0;
  limit: number = 10;
  lineitemsCount: number = 10;

  lineitemsQuery: any | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['accountId'];
    this.campaignId = this.route.snapshot.params['campaignId'];
    console.log('[LineitemListComponent] accountId', this.accountId);
    console.log('[LineitemListComponent] campaignId', this.campaignId);
    const queryVars: QueryLineitemsArgs = {
      campaignId: this.campaignId
    };
    console.log('[LineitemListComponent] queryVars', queryVars);
    this.lineitemsQuery = this.apollo.watchQuery<LineitemsQuery, QueryLineitemsArgs>({
      query: LINEITEM_LIST,
      variables: queryVars
    });

    this.lineitemsQuery.valueChanges.subscribe((result: { data: { lineitems: { lineitems: Lineitem[]; }; }; loading: boolean; errors: any; }) => {
      this.lineitems = result.data.lineitems?.lineitems ? result.data.lineitems?.lineitems : [];
      console.log('[LineitemListComponent] lineitems', this.lineitems);
      this.datasource.data = this.lineitems;
      this.loading = result.loading;
      this.error = result.errors;
    });
  }

  ngAfterViewInit() {
    console.debug("[LineitemListComponent] ngAfterViewInit");
    this.paginator.page.subscribe(page => {
      this.offset = page.pageIndex * this.limit;
      this.limit = page.pageSize;
      console.debug("[LineitemListComponent] ngAfterViewInit", page, this.offset, this.limit);
      this.fetchMore();
    });
  }

  fetchMore() {

    console.debug("[LineitemListComponent] fetchMore", this.offset, this.limit);
    this.lineitemsQuery?.fetchMore({
      variables: {
        offset: this.offset,
        limit: this.limit
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        console.debug("[LineitemListComponent] updateQuery", prev, fetchMoreResult);
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

  clickedRow(row: Lineitem) {
    console.log(row);
    this.router.navigate(['/accounts', this.accountId, 'campaigns', this.campaignId, 'lineitems', row.id]);
  }

  newLineitem() {
    this.router.navigate(['/accounts', this.accountId, 'campaigns', this.campaignId, 'lineitems', 'new']);
  }

}
