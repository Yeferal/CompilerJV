import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorybarComponent } from './directorybar.component';

describe('DirectorybarComponent', () => {
  let component: DirectorybarComponent;
  let fixture: ComponentFixture<DirectorybarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorybarComponent]
    });
    fixture = TestBed.createComponent(DirectorybarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
