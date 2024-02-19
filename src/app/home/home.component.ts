import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // TYPICAL REACTIVE STYLE COMPONENT - all variables are observables
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private httpService: HttpService, private dialog: MatDialog) {}

  ngOnInit() {
    // We add $ sign to the end of variable, which represents an Observable
    // So we declare courses$ variable and asign to it httpServices, which returns an Observable
    const courses$ = this.httpService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo))); // Sort all courses by Sequence No with sortCoursesBySeqNo function

    // SHARE REPLAY OPERATOR - used to avoid duplicated Http requests
    // By default we have http requests made per each subscription. So for below 2 observables beginnerCourses$ and advancedCourses$ we will have
    // 2 separate http requests. Remember- we subscribe to these 2 observables in html part with async pipe (advancedCourses$ | async).
    // if we will make 3-rd subscription in here with
    courses$.subscribe((val) => console.log(val)); // we will see 3 http requests in Network tab
    // Our goal is to make Http request only once and then reuse it multiple times. We achieve this with shareReplay() operator in http-services.ts file

    this.beginnerCourses$ = courses$.pipe(
      map(
        (courses) => courses.filter((course) => course.category == "BEGINNER") // Filter all courses by category BEGINNER
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map(
        (courses) => courses.filter((course) => course.category == "ADVANCED") // Filter all courses by category ADVANCED
      )
    );
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }
}
