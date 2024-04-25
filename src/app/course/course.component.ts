import {ChangeDetectionStrategy, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesStore } from '../services/courses.store';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
  private coursesStore: CoursesStore) {


  }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));    

    // const course$ = this.coursesStore.loadCourseById(courseId);
    const course$ = this.coursesStore.loadCourseById(courseId)
      .pipe(
        startWith(null)
      )

    // const lessons$ = this.coursesStore.loadAllCourseLessons(courseId);
    const lessons$ = this.coursesStore.loadAllCourseLessons(courseId)
      .pipe(
        startWith([])
      )

    // data$ observable is produced combining 2 separate observables in one: course$ and lessons$ with combineLatest() method
    // and with map we transform array to object: [course, lessons] => {course, lessons}
    // we will benefit from combining observables, as now we will not need to wait for both observables [course$, lessons$] to complete,
    // but instead, we will be able to display data$ even if only one observable completes and later on we will render remaining data for remaining completed observables.
    // but in order to achieve this we will need additionally add .pipe(startWith(null)) to our observables so it instantly provides null value to observable without waiting for it to complete
    // and this is SINGLE DATA OBSERVABLE PATTERN
    // as we combine all observables in single observable

    this.data$ = combineLatest([course$, lessons$])
      .pipe(
        map(([course, lessons]) => {
          return {
            course,
            lessons
          }
      })
    )
  }
}











