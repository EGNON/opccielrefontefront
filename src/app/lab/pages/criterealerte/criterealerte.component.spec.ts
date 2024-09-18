import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterealerteComponent } from './criterealerte.component';

describe('CriterealerteComponent', () => {
  let component: CriterealerteComponent;
  let fixture: ComponentFixture<CriterealerteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriterealerteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriterealerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
