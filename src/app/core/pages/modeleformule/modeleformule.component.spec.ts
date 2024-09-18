import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleformuleComponent } from './modeleformule.component';

describe('ModeleformuleComponent', () => {
  let component: ModeleformuleComponent;
  let fixture: ComponentFixture<ModeleformuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleformuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleformuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
