import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarsAdminComponent } from './list-cars-admin.component';

describe('ListCarsAdminComponent', () => {
  let component: ListCarsAdminComponent;
  let fixture: ComponentFixture<ListCarsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCarsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
