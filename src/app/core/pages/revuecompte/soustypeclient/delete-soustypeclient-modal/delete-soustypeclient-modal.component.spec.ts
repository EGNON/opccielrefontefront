import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSoustypeclientModalComponent } from './delete-soustypeclient-modal.component';

describe('DeleteSoustypeclientModalComponent', () => {
  let component: DeleteSoustypeclientModalComponent;
  let fixture: ComponentFixture<DeleteSoustypeclientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSoustypeclientModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSoustypeclientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
