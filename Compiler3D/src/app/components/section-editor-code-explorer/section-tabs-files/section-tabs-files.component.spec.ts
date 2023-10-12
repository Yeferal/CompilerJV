import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTabsFilesComponent } from './section-tabs-files.component';

describe('SectionTabsFilesComponent', () => {
  let component: SectionTabsFilesComponent;
  let fixture: ComponentFixture<SectionTabsFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionTabsFilesComponent]
    });
    fixture = TestBed.createComponent(SectionTabsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
