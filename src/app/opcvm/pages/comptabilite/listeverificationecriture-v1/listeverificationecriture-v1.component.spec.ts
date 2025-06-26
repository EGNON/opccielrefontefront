import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeverificationecritureV1Component } from './listeverificationecriture-v1.component';

describe('ListeverificationecritureV1Component', () => {
  let component: ListeverificationecritureV1Component;
  let fixture: ComponentFixture<ListeverificationecritureV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeverificationecritureV1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeverificationecritureV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
