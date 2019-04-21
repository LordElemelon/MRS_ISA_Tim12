import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpricesComponent } from './carprices.component';

describe('CarpricesComponent', () => {
  let component: CarpricesComponent;
  let fixture: ComponentFixture<CarpricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarpricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarpricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
