import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindatmComponent } from './findatm.component';

describe('FindatmComponent', () => {
  let component: FindatmComponent;
  let fixture: ComponentFixture<FindatmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindatmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindatmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
