import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFlowComponent } from './reservation-flow.component';

describe('ReservationFlowComponent', () => {
  let component: ReservationFlowComponent;
  let fixture: ComponentFixture<ReservationFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
