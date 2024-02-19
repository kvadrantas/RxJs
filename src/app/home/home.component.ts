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
