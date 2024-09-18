import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarificationordinaireComponent } from './tarificationordinaire.component';

describe('TarificationordinaireComponent', () => {
  let component: TarificationordinaireComponent;
  let fixture: ComponentFixture<TarificationordinaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarificationordinaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarificationordinaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
