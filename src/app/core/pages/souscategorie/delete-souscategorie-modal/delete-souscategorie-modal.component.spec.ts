import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSouscategorieModalComponent } from './delete-souscategorie-modal.component';

describe('DeleteSouscategorieModalComponent', () => {
  let component: DeleteSouscategorieModalComponent;
  let fixture: ComponentFixture<DeleteSouscategorieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSouscategorieModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSouscategorieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
