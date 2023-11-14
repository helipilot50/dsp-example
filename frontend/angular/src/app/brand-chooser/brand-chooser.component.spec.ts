import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandChooserComponent } from './brand-chooser.component';

describe('BrandChooserComponent', () => {
  let component: BrandChooserComponent;
  let fixture: ComponentFixture<BrandChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
