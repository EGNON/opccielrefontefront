import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementrachatListComponent } from './paiementrachat-list.component';

describe('PaiementrachatListComponent', () => {
  let component: PaiementrachatListComponent;
  let fixture: ComponentFixture<PaiementrachatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementrachatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementrachatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
