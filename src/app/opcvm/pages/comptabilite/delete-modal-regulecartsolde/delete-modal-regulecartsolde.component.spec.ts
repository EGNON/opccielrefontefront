import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalRegulecartsoldeComponent } from './delete-modal-regulecartsolde.component';

describe('DeleteModalRegulecartsoldeComponent', () => {
  let component: DeleteModalRegulecartsoldeComponent;
  let fixture: ComponentFixture<DeleteModalRegulecartsoldeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalRegulecartsoldeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModalRegulecartsoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
