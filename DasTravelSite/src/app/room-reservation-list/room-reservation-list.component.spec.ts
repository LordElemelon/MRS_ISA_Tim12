import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomReservationListComponent } from './room-reservation-list.component';

describe('RoomReservationListComponent', () => {
  let component: RoomReservationListComponent;
  let fixture: ComponentFixture<RoomReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
