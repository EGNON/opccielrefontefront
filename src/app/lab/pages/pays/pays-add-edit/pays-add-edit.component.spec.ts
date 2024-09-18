import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaysAddEditComponent } from './pays-add-edit.component';

describe('PaysAddEditComponent', () => {
  let component: PaysAddEditComponent;
  let fixture: ComponentFixture<PaysAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaysAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaysAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
