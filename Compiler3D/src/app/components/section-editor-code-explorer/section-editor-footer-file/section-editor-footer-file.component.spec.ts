import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorFooterFileComponent } from './section-editor-footer-file.component';

describe('SectionEditorFooterFileComponent', () => {
  let component: SectionEditorFooterFileComponent;
  let fixture: ComponentFixture<SectionEditorFooterFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorFooterFileComponent]
    });
    fixture = TestBed.createComponent(SectionEditorFooterFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
