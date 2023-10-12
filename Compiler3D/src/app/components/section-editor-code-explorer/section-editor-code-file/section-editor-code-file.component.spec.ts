import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorCodeFileComponent } from './section-editor-code-file.component';

describe('SectionEditorCodeFileComponent', () => {
  let component: SectionEditorCodeFileComponent;
  let fixture: ComponentFixture<SectionEditorCodeFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorCodeFileComponent]
    });
    fixture = TestBed.createComponent(SectionEditorCodeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
