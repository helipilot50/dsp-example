import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerListComponent } from './retailer-list.component';

describe('RetailerListComponent', () => {
  let component: RetailerListComponent;
  let fixture: ComponentFixture<RetailerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
