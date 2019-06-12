import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlinesSysAdminComponent } from './airlines-sys-admin.component';

describe('AirlinesSysAdminComponent', () => {
  let component: AirlinesSysAdminComponent;
  let fixture: ComponentFixture<AirlinesSysAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlinesSysAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlinesSysAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
