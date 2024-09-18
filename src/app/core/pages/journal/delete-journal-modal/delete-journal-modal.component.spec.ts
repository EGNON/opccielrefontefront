import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteJournalModalComponent } from './delete-journal-modal.component';

describe('DeleteJournalModalComponent', () => {
  let component: DeleteJournalModalComponent;
  let fixture: ComponentFixture<DeleteJournalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteJournalModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteJournalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
