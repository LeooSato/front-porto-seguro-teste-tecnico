import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CourseFormComponent } from './course-form.component';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit invalid trim-only fields', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');

    component.form.setValue({
      name: '   ',
      description: '   '
    });

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should submit with trimmed payload', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');

    component.form.setValue({
      name: '  Angular 19  ',
      description: '  Modern frontend  '
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Angular 19',
      description: 'Modern frontend'
    });
  });
});
