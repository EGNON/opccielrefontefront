import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCrudComponent } from './entity-crud.component';

describe('EntityCrudComponent', () => {
  let component: EntityCrudComponent;
  let fixture: ComponentFixture<EntityCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityCrudComponent]
    });
    fixture = TestBed.createComponent(EntityCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
