import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpService } from "../services/http-service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  // This course-dialog.component is opened by the angular material framework and it exists in a different component tree then our components
  // This is the reason why it cannot see and use <loading> spinner component, imported globally under app.component.html
  // Because of that, we are importing here separate local instance of the LoadinService, which will be accessible only in this component and it's childs
  // as our couse-dialog.component.ts cannot access and use <loading> component added globally to app.component.html
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    // We subscribe to saveCourse Observable to perform data save. saveCourse returns aither error or successful answer, depending
    // on how save atempt to backend server went. We catch this answer as a "val" variable and pass it to close dialog function
    // to provide closing reason


    // ShowLoaderUntilCompleted() takes observable as an input argument
    // We want to pass saveCourse$ observable to this method to add Loading indicator capabilities to this observable
    // So ShowLoaderUntilCompleted() method takes saveCourse$ observable as an input parameter and then returns observable with Loading indicator capabilities,
    // to which we subscribe and use
    // Generally speaking we see Loading Spinner once we are saving course, we have edited
    const saveCourse$ = this.httpService.saveCourse(this.course.id, changes)
      .pipe(
        // Error handling with the catchError RxJs operator
        catchError(err => {
          const message = "Could not save course";
          console.log(message, err);
          this.messagesService.showErrors(message);   // We are telling messagesService to show errors
          return throwError(err);   // We are throwing error and ending saveCourse observable lifecycle
      })
    )
    
    this.loadingService.ShowLoaderUntilCompleted(saveCourse$)
      .subscribe((val) => {
      this.dialogRef.close(val);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
