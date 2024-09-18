import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleformuleListComponent } from './modeleformule-list.component';

describe('ModeleformuleListComponent', () => {
  let component: ModeleformuleListComponent;
  let fixture: ComponentFixture<ModeleformuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleformuleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleformuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
