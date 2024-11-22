import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDepotsouscriptionModalComponent } from './delete-depotsouscription-modal.component';

describe('DeleteDepotsouscriptionModalComponent', () => {
  let component: DeleteDepotsouscriptionModalComponent;
  let fixture: ComponentFixture<DeleteDepotsouscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteDepotsouscriptionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDepotsouscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
