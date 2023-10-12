import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDirectoryComponent } from './tree-directory.component';

describe('TreeDirectoryComponent', () => {
  let component: TreeDirectoryComponent;
  let fixture: ComponentFixture<TreeDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreeDirectoryComponent]
    });
    fixture = TestBed.createComponent(TreeDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
