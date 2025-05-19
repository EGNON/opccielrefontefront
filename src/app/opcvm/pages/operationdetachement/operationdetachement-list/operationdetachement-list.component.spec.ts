import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationdetachementListComponent } from './operationdetachement-list.component';

describe('OperationdetachementListComponent', () => {
  let component: OperationdetachementListComponent;
  let fixture: ComponentFixture<OperationdetachementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationdetachementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationdetachementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
