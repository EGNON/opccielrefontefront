import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondanceAddEditComponent } from './correspondance-add-edit.component';

describe('CorrespondanceAddEditComponent', () => {
  let component: CorrespondanceAddEditComponent;
  let fixture: ComponentFixture<CorrespondanceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrespondanceAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrespondanceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
