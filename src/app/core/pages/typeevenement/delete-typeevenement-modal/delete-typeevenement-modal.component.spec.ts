import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeevenementModalComponent } from './delete-typeevenement-modal.component';

describe('DeleteTypeevenementModalComponent', () => {
  let component: DeleteTypeevenementModalComponent;
  let fixture: ComponentFixture<DeleteTypeevenementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeevenementModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeevenementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
