import { Component } from '@angular/core';
import {
  Lineitem, LineitemQuery, LineitemQueryVariables,
  LineitemStatus,
  BudgetType,
  NewLineitem, NewLineitemMutation, NewLineitemMutationVariables, ActivateLineitemsMutation, MutationActivateLineitemsArgs, MutationPauseLineitemsArgs, PauseLineitemsMutation, LineitemActivatedSubscription, LineitemPausedSubscription
} from 'not-dsp-graphql';
import { LINEITEMS_ACTIVATE, LINEITEMS_PAUSE, LINEITEM_ACTIVATED, LINEITEM_DETAILS, LINEITEM_LIST, LINEITEM_NEW, LINEITEM_PAUSED } from 'not-dsp-graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { FetchResult } from '@apollo/client/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notifyConfig } from '../snackBarDefaults';
import { DetailsComponent } from '../detail-component';


@Component({
  selector: 'app-lineitem-detail',
  templateUrl: './lineitem-detail.component.html',
  styleUrls: ['./lineitem-detail.component.css'],
})
export class LineitemDetailComponent extends DetailsComponent {

  cats = { startDate: Date, endDate: Date };

  lineitem: Lineitem = {
    id: '',
    name: '',
    status: LineitemStatus.Paused,
    startDate: new Date(),
    endDate: new Date(),
  };

  loading: boolean = true;
  isNew: boolean = false;

  statusValues: string[] = Object.values(LineitemStatus);



  ngOnInit(): void {
    console.debug('[LineitemDetailComponent.ngOnInit] statusValues', this.statusValues);
    const id = this.route.snapshot.params['lineitemId'];

    this.isNew = id === 'new';

    if (this.isNew) {
      this.loading = false;

      console.debug('[LineitemDetailComponent.ngOnInit] new lineitem', this.lineitem);
    } else {
      this.apollo.watchQuery<LineitemQuery, LineitemQueryVariables>({
        query: LINEITEM_DETAILS,
        variables: {
          lineitemId: id
        }
      }).valueChanges.subscribe((result) => {
        console.debug('[LineitemDetailComponent.ngOnInit] query result', result);
        this.lineitem = result.data.lineitem as Lineitem;
        this.loading = result.loading;
        this.displayError(result.error);
      });
    }

    // Lineitem activated subscription
    const cat = this.apollo.subscribe<LineitemActivatedSubscription>({
      query: LINEITEM_ACTIVATED,
      variables: {
        lineitemId: id
      }
    }).subscribe((result: FetchResult<LineitemActivatedSubscription>) => {
      console.debug('[LineitemDetailComponent] activated subscription result', result);
      this.snackBar.open(`Lineitem ${result.data?.lineitemActivated.name} activated`, 'OK', notifyConfig);
    });

    // Lineitem paused subscription
    this.apollo.subscribe<LineitemPausedSubscription>({
      query: LINEITEM_PAUSED,
      variables: {
        lineitemId: id
      }
    }).subscribe((result: FetchResult<LineitemPausedSubscription>) => {
      console.debug('[LineitemDetailComponent] paused subscription result', result);
      this.snackBar.open(`Lineitem ${result.data?.lineitemPaused.name} paused`, 'OK', notifyConfig);
    }
    );
  }

  activate() {
    console.debug("[LineitemDetailComponent.activate] lineitemId", this.lineitem.id);
    this.apollo.mutate<ActivateLineitemsMutation, MutationActivateLineitemsArgs>({
      mutation: LINEITEMS_ACTIVATE,
      variables: {
        lineitemIds: [this.lineitem.id],
      },
      refetchQueries: [{
        query: LINEITEM_DETAILS
      },
      {
        query: LINEITEM_LIST,
      }]
    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[LineitemDetailComponent.activate] Error activating lineitem', errors);
      }
      if (data) {
        console.debug('[LineitemDetailComponent.activate] Lineitem activated', JSON.stringify(data, null, 2));
      }
    });
  }
  deactivate() {
    console.debug("[LineitemDetailComponent.deactivate] lineitemId", this.lineitem.id);
    this.apollo.mutate<PauseLineitemsMutation, MutationPauseLineitemsArgs>({
      mutation: LINEITEMS_PAUSE,
      variables: {
        lineitemIds: [this.lineitem.id],
      },
      refetchQueries: [{
        query: LINEITEM_DETAILS
      },
      {
        query: LINEITEM_LIST,
      }]
    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[LineitemDetailComponent.deactivate] Error pausing lineitem', errors);
        this.snackBar.open(`Error pausing lineitem: ${errors[0].message} `, 'OK');
      }
      if (data) {
        console.debug('[LineitemDetailComponent.deactivate] Lineitem paused', JSON.stringify(data, null, 2));
      }
    });

  }


  onFormSubmit() {
    console.debug('f[LineitemDetailComponentonFormSubmit] lineitem', this.lineitem);
    if (this.isNew) {
      this.createLineitem(this.lineitem);
    } else {
      this.updateLineitem(this.lineitem);
    }
  }
  updateLineitem(value: any) {
    alert('[LineitemDetailComponent.updateLineitem] Method not implemented.');
    this.location.back();
  }

  createLineitem(value: any) {
    const campaignId: string = this.route.snapshot.params['campaignId'];
    const accountId = this.route.snapshot.params['accountId'];
    const newLineitem: NewLineitem = {
      name: this.lineitem?.name || '',
      startDate: this.lineitem?.startDate || new Date(),
      endDate: this.lineitem?.endDate || new Date(),
      budget: {
        amount: 0,
        isCapped: false,
        type: BudgetType.Total
      },
      pages: []
    };
    console.debug('[LineitemDetailComponent.createLineitem]', newLineitem, campaignId, accountId);
    this.apollo.mutate<NewLineitemMutation, NewLineitemMutationVariables>({
      mutation: LINEITEM_NEW,
      variables: {
        campaignId: campaignId,
        lineitem: newLineitem
      },
      refetchQueries: [{
        query: LINEITEM_LIST,
      }]

    }).subscribe(({ data, errors, loading }) => {
      if (errors) {
        console.error('[LineitemDetailComponent.createLineitem] Error creating lineitem', errors);
        this.snackBar.open(`Error creating lineitem: ${errors[0].message}`, 'OK');
        this.location.back();
      }
      if (data) {
        console.debug('[LineitemDetailComponent.createLineitem] New lineitem created', JSON.stringify(data, null, 2));
        const newLineitemId = (data as any).newLineitem.id;
        this.snackBar.open(`New lineitem created, id: ${newLineitemId} `, 'OK', notifyConfig);
        this.location.back();
      }
    });
  }

}


