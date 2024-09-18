import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModeetablissementModalComponent } from './delete-modeetablissement-modal.component';

describe('DeleteModeetablissementModalComponent', () => {
  let component: DeleteModeetablissementModalComponent;
  let fixture: ComponentFixture<DeleteModeetablissementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteModeetablissementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModeetablissementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
