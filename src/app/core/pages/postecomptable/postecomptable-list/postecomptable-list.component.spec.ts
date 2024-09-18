import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostecomptableListComponent } from './postecomptable-list.component';

describe('PostecomptableListComponent', () => {
  let component: PostecomptableListComponent;
  let fixture: ComponentFixture<PostecomptableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostecomptableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostecomptableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
