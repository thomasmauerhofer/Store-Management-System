import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AggregationComponent} from './aggregation.component';
import {Role} from '../../models/user';
import {getTestConfig} from '../../testing/test-config';


describe('AggregationComponent', () => {
  let component: AggregationComponent;
  let fixture: ComponentFixture<AggregationComponent>;


  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    TestBed.configureTestingModule(getTestConfig([]))
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
