import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerChooserComponent } from './retailer-chooser.component';

describe('RetailerChooserComponent', () => {
  let component: RetailerChooserComponent;
  let fixture: ComponentFixture<RetailerChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
