import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject non-multiple of 30 time', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');
    component.form.setValue({
      date: '2026-03-22',
      category: 'PESQUISA',
      description: 'Task description',
      timeSpent: 45
    });

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.timeSpent.hasError('multipleOf30')).toBeTrue();
  });

  it('should reject zero or negative time', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');
    component.form.setValue({
      date: '2026-03-22',
      category: 'PESQUISA',
      description: 'Task description',
      timeSpent: 0
    });

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.timeSpent.hasError('min')).toBeTrue();
  });

  it('should submit valid payload', () => {
    const emitSpy = spyOn(component.formSubmit, 'emit');
    component.form.setValue({
      date: '2026-03-22',
      category: 'PRATICA',
      description: '  Build feature  ',
      timeSpent: 90
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({
      date: '2026-03-22',
      category: 'PRATICA',
      description: 'Build feature',
      timeSpent: 90
    });
  });
});
