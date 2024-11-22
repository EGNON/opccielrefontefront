import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationrachatAddEditComponent } from './generationrachat-add-edit.component';

describe('GenerationrachatAddEditComponent', () => {
  let component: GenerationrachatAddEditComponent;
  let fixture: ComponentFixture<GenerationrachatAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationrachatAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationrachatAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
