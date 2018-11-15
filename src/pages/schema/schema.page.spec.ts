import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaPage } from './schema.page';

describe('SchemaPage', () => {
  let component: SchemaPage;
  let fixture: ComponentFixture<SchemaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
