import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CoursesListComponent } from './courses-list.component';

describe('CoursesListComponent', () => {
  let component: CoursesListComponent;
  let fixture: ComponentFixture<CoursesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesListComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no courses and not loading', () => {
    component.isLoading = false;
    component.courses = [];

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No courses found');
  });

  it('should render admin actions and create button for admin role', () => {
    component.isAdmin = true;
    component.courses = [{ id: '1', name: 'Angular', description: 'Frontend' }];

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Criar curso');
    expect(fixture.nativeElement.textContent).toContain('Editar');
    expect(fixture.nativeElement.textContent).toContain('Excluir');
  });

  it('should emit enroll action for student role', () => {
    const emitSpy = spyOn(component.enrollClick, 'emit');
    component.isAdmin = false;
    component.courses = [{ id: '1', name: 'Angular', description: 'Frontend' }];
    fixture.detectChanges();

    const enrollButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find((item) => item.nativeElement.textContent.includes('Enroll'));

    expect(enrollButton).toBeDefined();

    enrollButton?.nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith({ id: '1', name: 'Angular', description: 'Frontend' });
  });
});
