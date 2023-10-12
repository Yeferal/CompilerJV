import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorReportComponent } from './section-editor-report.component';

describe('SectionEditorReportComponent', () => {
  let component: SectionEditorReportComponent;
  let fixture: ComponentFixture<SectionEditorReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorReportComponent]
    });
    fixture = TestBed.createComponent(SectionEditorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
