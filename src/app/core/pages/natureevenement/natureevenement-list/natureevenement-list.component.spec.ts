import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureevenementListComponent } from './natureevenement-list.component';

describe('NatureevenementListComponent', () => {
  let component: NatureevenementListComponent;
  let fixture: ComponentFixture<NatureevenementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureevenementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureevenementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
