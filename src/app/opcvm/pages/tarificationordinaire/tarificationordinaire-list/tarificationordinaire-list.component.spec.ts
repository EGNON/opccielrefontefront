import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarificationordinaireListComponent } from './tarificationordinaire-list.component';

describe('TarificationordinaireListComponent', () => {
  let component: TarificationordinaireListComponent;
  let fixture: ComponentFixture<TarificationordinaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarificationordinaireListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarificationordinaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
