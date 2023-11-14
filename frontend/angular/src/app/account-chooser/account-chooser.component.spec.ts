import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountChooserComponent } from './account-chooser.component';

describe('AccountChooserComponent', () => {
  let component: AccountChooserComponent;
  let fixture: ComponentFixture<AccountChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
