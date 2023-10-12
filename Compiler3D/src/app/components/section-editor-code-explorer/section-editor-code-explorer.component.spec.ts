import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorCodeExplorerComponent } from './section-editor-code-explorer.component';

describe('SectionEditorCodeExplorerComponent', () => {
  let component: SectionEditorCodeExplorerComponent;
  let fixture: ComponentFixture<SectionEditorCodeExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorCodeExplorerComponent]
    });
    fixture = TestBed.createComponent(SectionEditorCodeExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
