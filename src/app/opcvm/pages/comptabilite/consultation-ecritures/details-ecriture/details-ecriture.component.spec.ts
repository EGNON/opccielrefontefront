import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEcritureComponent } from './details-ecriture.component';

describe('DetailsEcritureComponent', () => {
  let component: DetailsEcritureComponent;
  let fixture: ComponentFixture<DetailsEcritureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsEcritureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsEcritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
