import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostecomptableAddEditComponent } from './postecomptable-add-edit.component';

describe('PostecomptableAddEditComponent', () => {
  let component: PostecomptableAddEditComponent;
  let fixture: ComponentFixture<PostecomptableAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostecomptableAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostecomptableAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
