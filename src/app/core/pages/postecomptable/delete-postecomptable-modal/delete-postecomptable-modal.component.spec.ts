import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePostecomptableModalComponent } from './delete-postecomptable-modal.component';

describe('DeletePostecomptableModalComponent', () => {
  let component: DeletePostecomptableModalComponent;
  let fixture: ComponentFixture<DeletePostecomptableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePostecomptableModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePostecomptableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
