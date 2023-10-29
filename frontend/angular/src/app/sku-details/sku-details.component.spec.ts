import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDetailsComponent } from './sku-details.component';

describe('SkuDetailsComponent', () => {
  let component: SkuDetailsComponent;
  let fixture: ComponentFixture<SkuDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
