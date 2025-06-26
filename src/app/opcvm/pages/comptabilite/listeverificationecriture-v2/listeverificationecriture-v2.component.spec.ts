import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeverificationecritureV2Component } from './listeverificationecriture-v2.component';

describe('ListeverificationecritureV2Component', () => {
  let component: ListeverificationecritureV2Component;
  let fixture: ComponentFixture<ListeverificationecritureV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeverificationecritureV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeverificationecritureV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
