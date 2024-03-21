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
import { LoadingService } from "../loading/loading.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // TYPICAL REACTIVE STYLE COMPONENT - all variables are observables
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private httpService: HttpService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.reloadCourses(); // We are loading data once component was initialized
  }

  // We are reloading data each time this data was edited and saved
  reloadCourses() {
    // We are simplifying Loading Spinner usage by getting rid of loadingOn(), loadingOff() methods and finalize operator
    // and using only ShowLoaderUntilCompleted() method instead

  

    // We add $ sign to the end of variable, which represents an Observable
    // So we declare courses$ variable and asign to it httpServices, which returns an Observable
    const courses$ = this.httpService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo))); // Sort all courses by Sequence No with sortCoursesBySeqNo function
  
    // ShowLoaderUntilCompleted() takes observable as an input argument
    // We want to pass courses$ observable to this method to add Loading indicator capabilities to this observable
    // So ShowLoaderUntilCompleted() method takes courses$ observable as an input parameter and then returns observable with Loading indicator capabilities,
    // which we assigne to loadCourses$
    const loadCourses$ = this.loadingService.ShowLoaderUntilCompleted(courses$);

    // SHARE REPLAY OPERATOR - used to avoid duplicated Http requests
    // By default we have http requests made per each subscription. So for below 2 observables beginnerCourses$ and advancedCourses$ we will have
    // 2 separate http requests. Remember- we subscribe to these 2 observables in html part with async pipe (advancedCourses$ | async).
    // if we will make 3-rd subscription in here with
    courses$.subscribe((val) => console.log(val)); // we will see 3 http requests in Network tab
    // Our goal is to make Http request only once and then reuse it multiple times. We achieve this with shareReplay() operator in http-services.ts file

    this.beginnerCourses$ = loadCourses$.pipe(
      map(
        (courses) => courses.filter((course) => course.category == "BEGINNER") // Filter all courses by category BEGINNER
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map(
        (courses) => courses.filter((course) => course.category == "ADVANCED") // Filter all courses by category ADVANCED
      )
    );
  }
}
