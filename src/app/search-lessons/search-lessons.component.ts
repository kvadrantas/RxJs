// Master-Detail UI Pattern – type of user interface pattern, where we are displaying a master table and we can click on that table rows and see related details in a separate component.
// Very often used in search results and in any other situations, where we want to have master table containing a list of results, that we want again to click on and view in more detail in a separate screen.

  
import { ChangeDetectionStrategy, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesStore } from '../services/courses.store';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;
  activeLesson: Lesson;

  constructor(private coursesStore: CoursesStore) {


  }

  ngOnInit() {


  }

  onSearch(search: string) {
   this.searchResults$ = this.coursesStore.searchLessons(search);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch(): void {
    this.activeLesson = null;
  }
}











