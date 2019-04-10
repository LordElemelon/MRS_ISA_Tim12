import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalservicesComponent } from './rentalservices.component';

describe('RentalservicesComponent', () => {
  let component: RentalservicesComponent;
  let fixture: ComponentFixture<RentalservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
