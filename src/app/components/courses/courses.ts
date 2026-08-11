import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { COURSE_TEACHER, COURSE_TEACHER_PHOTO, COURSES } from '../../shared/catalog';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  readonly courses = COURSES;
  readonly teacher = COURSE_TEACHER;
  readonly teacherPhoto = COURSE_TEACHER_PHOTO;
}
