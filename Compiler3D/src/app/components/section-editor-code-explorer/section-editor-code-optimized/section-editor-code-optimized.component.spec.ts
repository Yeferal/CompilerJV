import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEditorCodeOptimizedComponent } from './section-editor-code-optimized.component';

describe('SectionEditorCodeOptimizedComponent', () => {
  let component: SectionEditorCodeOptimizedComponent;
  let fixture: ComponentFixture<SectionEditorCodeOptimizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionEditorCodeOptimizedComponent]
    });
    fixture = TestBed.createComponent(SectionEditorCodeOptimizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
