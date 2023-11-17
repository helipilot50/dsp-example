import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { Location } from '@angular/common';
import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'details-component',
  template: '<div></div>',
  styles: ['size: 100%'],
})
export class DetailsComponent {
  constructor(protected apollo: Apollo,
    protected router: Router,
    protected route: ActivatedRoute,
    protected snackBar: MatSnackBar,
    protected location: Location,
    protected formBuilder: FormBuilder
  ) {

  }
  protected displayError(error?: any) {
    if (error) {
      console.error('[PortfolioDetailsComponent] portfolio error', error);
      this.snackBar.open(`[PortfolioDetailsComponent.onInit] error: ${JSON.stringify(error, null, 2)} `, 'OK');
    }
  }
}
