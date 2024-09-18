import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterealerteListComponent } from './criterealerte-list.component';

describe('CriterealerteListComponent', () => {
  let component: CriterealerteListComponent;
  let fixture: ComponentFixture<CriterealerteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriterealerteListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriterealerteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
