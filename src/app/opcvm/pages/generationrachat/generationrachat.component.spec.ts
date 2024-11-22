import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationrachatComponent } from './generationrachat.component';

describe('GenerationrachatComponent', () => {
  let component: GenerationrachatComponent;
  let fixture: ComponentFixture<GenerationrachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationrachatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationrachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
