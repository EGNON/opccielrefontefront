import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCriterealerteModalComponent } from './delete-criterealerte-modal.component';

describe('DeleteCriterealerteModalComponent', () => {
  let component: DeleteCriterealerteModalComponent;
  let fixture: ComponentFixture<DeleteCriterealerteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCriterealerteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCriterealerteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
