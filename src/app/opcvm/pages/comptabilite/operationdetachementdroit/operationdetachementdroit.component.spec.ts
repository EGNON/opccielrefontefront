import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationdetachementdroitComponent } from './operationdetachementdroit.component';

describe('OperationdetachementdroitComponent', () => {
  let component: OperationdetachementdroitComponent;
  let fixture: ComponentFixture<OperationdetachementdroitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationdetachementdroitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationdetachementdroitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
