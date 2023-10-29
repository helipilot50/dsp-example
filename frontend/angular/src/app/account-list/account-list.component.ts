import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Account, AccountsQuery } from 'not-dsp-graphql';
import { ACCOUNTS_LIST } from '../graphql/accounts.graphql';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'currency'];

  accounts: Account[] = [];
  loading: boolean = true;
  error: any;

  datasource = new MatTableDataSource<Account>();


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private apollo: Apollo, private router: Router) { }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.apollo.watchQuery<AccountsQuery>({
      query: ACCOUNTS_LIST,
      fetchPolicy: 'cache-first'
    }).valueChanges.subscribe(result => {
      this.accounts = result.data.accounts ? result.data.accounts as Account[] : [];
      this.datasource.data = this.accounts;
      this.loading = result.loading;
      this.error = result.errors;
    });
  }

  clickedRow(row: Account) {
    console.log(row);
    this.router.navigate(['/accounts', row.id]);
  }

  newAccount() {
    this.router.navigate(['/accounts', 'new']);
  }

}
