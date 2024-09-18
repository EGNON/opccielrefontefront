import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeclientModalComponent } from './delete-typeclient-modal.component';

describe('DeleteTypeclientModalComponent', () => {
  let component: DeleteTypeclientModalComponent;
  let fixture: ComponentFixture<DeleteTypeclientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeclientModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeclientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
