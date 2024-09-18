import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSecteurboursierModalComponent } from './delete-secteurboursier-modal.component';

describe('DeleteSecteurboursierModalComponent', () => {
  let component: DeleteSecteurboursierModalComponent;
  let fixture: ComponentFixture<DeleteSecteurboursierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSecteurboursierModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSecteurboursierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
