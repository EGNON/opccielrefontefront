import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterealerteAddEditComponent } from './criterealerte-add-edit.component';

describe('CriterealerteAddEditComponent', () => {
  let component: CriterealerteAddEditComponent;
  let fixture: ComponentFixture<CriterealerteAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriterealerteAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriterealerteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
