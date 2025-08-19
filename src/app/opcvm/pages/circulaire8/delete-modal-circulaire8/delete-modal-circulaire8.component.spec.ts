import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalCirculaire8Component } from './delete-modal-circulaire8.component';

describe('DeleteModalCirculaire8Component', () => {
  let component: DeleteModalCirculaire8Component;
  let fixture: ComponentFixture<DeleteModalCirculaire8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalCirculaire8Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModalCirculaire8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
