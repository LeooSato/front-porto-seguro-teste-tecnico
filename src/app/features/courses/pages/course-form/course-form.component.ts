import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Course, CoursePayload } from '../../../../shared/models/course.model';

const trimRequired = (control: AbstractControl<string>): ValidationErrors | null => {
  return control.value.trim().length > 0 ? null : { required: true };
};

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() title = 'Criar curso';
  @Input() submitLabel = 'Salvar';
  @Input() isLoading = false;
  @Input() course: Course | null = null;

  @Output() formSubmit = new EventEmitter<CoursePayload>();
  @Output() formCancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, trimRequired]],
    description: ['', [Validators.required, trimRequired]]
  });

  get name() {
    return this.form.controls.name;
  }

  get description() {
    return this.form.controls.description;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      this.form.reset({
        name: this.course?.name ?? '',
        description: this.course?.description ?? ''
      });
    }
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    this.formSubmit.emit({
      name: payload.name.trim(),
      description: payload.description.trim()
    });
  }

  cancel(): void {
    this.formCancel.emit();
  }

}
