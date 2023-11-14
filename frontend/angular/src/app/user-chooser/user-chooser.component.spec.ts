import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChooserComponent } from './user-chooser.component';

describe('UserChooserComponent', () => {
  let component: UserChooserComponent;
  let fixture: ComponentFixture<UserChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChooserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
