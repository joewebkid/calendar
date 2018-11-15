import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnonsorsPage } from './snonsors.page';

describe('SnonsorsPage', () => {
  let component: SnonsorsPage;
  let fixture: ComponentFixture<SnonsorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnonsorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnonsorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
