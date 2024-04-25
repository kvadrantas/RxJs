import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { HttpService } from "../services/http-service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  // ON PUSH CHANGE DETECTION
  // is an optimized, faster chagne detection mode. In default change detection mode Angular will check each template and expressions (egzample: [courses]="beginnerCourses$ | async") used in them
  // in order to determen, if a given component should be rerendered or not. When you have a lot of data to show to the user with a lot of
  // template expressions you might want to enable OnPush change detection in some of the components to make user interface more responsive.
  
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  // TYPICAL REACTIVE STYLE COMPONENT - all variables are observables
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor( private coursesStore: CoursesStore ) {}

  ngOnInit() {
    this.reloadCourses(); // We are loading data once component was initialized
  }

  // We are reloading data each time this data was edited and saved
  reloadCourses() {
    // Moving some of the logic to State management service
    this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER');

    this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED');
  }
}
