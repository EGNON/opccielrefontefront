import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeleecritureListComponent } from './modeleecriture-list.component';

describe('ModeleecritureListComponent', () => {
  let component: ModeleecritureListComponent;
  let fixture: ComponentFixture<ModeleecritureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeleecritureListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeleecritureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
