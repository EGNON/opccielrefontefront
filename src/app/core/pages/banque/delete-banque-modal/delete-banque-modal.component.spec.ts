import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBanqueModalComponent } from './delete-banque-modal.component';

describe('DeleteBanqueModalComponent', () => {
  let component: DeleteBanqueModalComponent;
  let fixture: ComponentFixture<DeleteBanqueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteBanqueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteBanqueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
