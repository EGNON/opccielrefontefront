import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteActionnaireopcvmModalComponent } from './delete-actionnaireopcvm-modal.component';

describe('DeleteActionnaireopcvmModalComponent', () => {
  let component: DeleteActionnaireopcvmModalComponent;
  let fixture: ComponentFixture<DeleteActionnaireopcvmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteActionnaireopcvmModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteActionnaireopcvmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
