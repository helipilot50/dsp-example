import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineitemListComponent } from './lineitem-list.component';

describe('LineitemListComponent', () => {
  let component: LineitemListComponent;
  let fixture: ComponentFixture<LineitemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineitemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineitemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
