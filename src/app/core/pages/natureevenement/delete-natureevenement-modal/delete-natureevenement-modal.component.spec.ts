import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNatureevenementModalComponent } from './delete-natureevenement-modal.component';

describe('DeleteNatureevenementModalComponent', () => {
  let component: DeleteNatureevenementModalComponent;
  let fixture: ComponentFixture<DeleteNatureevenementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteNatureevenementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteNatureevenementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
