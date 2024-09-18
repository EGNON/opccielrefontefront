import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreConfidentielComponent } from './registre-confidentiel.component';

describe('RegistreConfidentielComponent', () => {
  let component: RegistreConfidentielComponent;
  let fixture: ComponentFixture<RegistreConfidentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistreConfidentielComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistreConfidentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
