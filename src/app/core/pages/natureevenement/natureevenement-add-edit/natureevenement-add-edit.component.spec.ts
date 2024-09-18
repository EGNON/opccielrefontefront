import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureevenementAddEditComponent } from './natureevenement-add-edit.component';

describe('NatureevenementAddEditComponent', () => {
  let component: NatureevenementAddEditComponent;
  let fixture: ComponentFixture<NatureevenementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureevenementAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureevenementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
