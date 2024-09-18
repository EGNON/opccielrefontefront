import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureoperationAddEditComponent } from './natureoperation-add-edit.component';

describe('NatureoperationAddEditComponent', () => {
  let component: NatureoperationAddEditComponent;
  let fixture: ComponentFixture<NatureoperationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureoperationAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureoperationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
