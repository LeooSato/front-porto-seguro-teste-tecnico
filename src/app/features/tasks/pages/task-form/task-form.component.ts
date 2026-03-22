import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { EnrollmentOption, Task, TaskCategory, TaskPayload } from '../../../../shared/models/task.model';

const validTimeSpent = (control: AbstractControl<number | null>): ValidationErrors | null => {
  if (control.value === null || control.value === undefined) {
    return null;
  }

  const value = Number(control.value);

  return value > 0 && value % 30 === 0 ? null : { invalidTimeSpent: true };
};

const trimRequired = (control: AbstractControl<string>): ValidationErrors | null => {
  return control.value.trim().length > 0 ? null : { required: true };
};

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() title = 'Nova tarefa';
  @Input() submitLabel = 'Salvar';
  @Input() isLoading = false;
  @Input() task: Task | null = null;
  @Input() enrollmentOptions: EnrollmentOption[] = [];

  @Output() formSubmit = new EventEmitter<TaskPayload>();
  @Output() formCancel = new EventEmitter<void>();

  readonly categories: TaskCategory[] = ['PESQUISA', 'PRATICA', 'ASSISTIR_VIDEOAULA'];

  readonly form = this.fb.nonNullable.group({
    enrollmentId: ['', [Validators.required]],
    date: ['', [Validators.required]],
    category: this.fb.control<TaskCategory>('PESQUISA', { validators: [Validators.required], nonNullable: true }),
    description: ['', [Validators.required, trimRequired]],
    timeSpentMinutes: this.fb.control<number | null>(null, [Validators.required, validTimeSpent])
  });

  get enrollmentId() {
    return this.form.controls.enrollmentId;
  }

  get date() {
    return this.form.controls.date;
  }

  get category() {
    return this.form.controls.category;
  }

  get description() {
    return this.form.controls.description;
  }

  get timeSpent() {
    return this.form.controls.timeSpentMinutes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enrollmentOptions'] && !this.task && !this.enrollmentId.value && this.enrollmentOptions.length > 0) {
      this.enrollmentId.setValue(this.enrollmentOptions[0].id);
    }

    if (changes['task']) {
      this.form.reset({
        enrollmentId: this.task?.enrollmentId ?? this.enrollmentOptions[0]?.id ?? '',
        date: this.task?.date ?? '',
        category: this.task?.category ?? 'PESQUISA',
        description: this.task?.description ?? '',
        timeSpentMinutes: this.task?.timeSpent ?? null
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
      enrollmentId: payload.enrollmentId,
      date: payload.date,
      category: payload.category,
      description: payload.description.trim(),
      timeSpentMinutes: Number(payload.timeSpentMinutes)
    });
  }

  cancel(): void {
    this.formCancel.emit();
  }

}
