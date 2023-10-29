import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineitemDetailComponent } from './lineitem-detail.component';

describe('LineitemDetailComponent', () => {
  let component: LineitemDetailComponent;
  let fixture: ComponentFixture<LineitemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineitemDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineitemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
