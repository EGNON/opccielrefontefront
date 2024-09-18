import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleecritureComponent } from './modeleecriture.component';

describe('ModeleecritureComponent', () => {
  let component: ModeleecritureComponent;
  let fixture: ComponentFixture<ModeleecritureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleecritureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleecritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
