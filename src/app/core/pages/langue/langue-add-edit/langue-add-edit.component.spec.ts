import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangueAddEditComponent } from './langue-add-edit.component';

describe('LangueAddEditComponent', () => {
  let component: LangueAddEditComponent;
  let fixture: ComponentFixture<LangueAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LangueAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LangueAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
