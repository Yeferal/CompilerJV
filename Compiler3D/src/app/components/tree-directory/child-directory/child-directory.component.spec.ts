import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDirectoryComponent } from './child-directory.component';

describe('ChildDirectoryComponent', () => {
  let component: ChildDirectoryComponent;
  let fixture: ComponentFixture<ChildDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildDirectoryComponent]
    });
    fixture = TestBed.createComponent(ChildDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
