import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFormejuridiqueModalComponent } from './delete-formejuridique-modal.component';

describe('DeleteFormejuridiqueModalComponent', () => {
  let component: DeleteFormejuridiqueModalComponent;
  let fixture: ComponentFixture<DeleteFormejuridiqueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteFormejuridiqueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFormejuridiqueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
