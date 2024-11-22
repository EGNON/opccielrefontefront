import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationrachatListComponent } from './generationrachat-list.component';

describe('GenerationrachatListComponent', () => {
  let component: GenerationrachatListComponent;
  let fixture: ComponentFixture<GenerationrachatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerationrachatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerationrachatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
