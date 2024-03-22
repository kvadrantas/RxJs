// STATE MANAGEMENT SERVICE - STORE


// Building Stateless Observable Services we are ending up each time fetching data from backend servers while using web applications and navigating between different pages and components used in it.

// While lots of applications can be build that way and you will not notice any issues, there might be a problem with longer taking network requests (taking longer than couple of seconds), as the user jumping between pages will need to wait each time for data to be loaded.

// To give better user experience with less network requests and less Loading Spinners showed to the users, we might need to implement State Management.

// Best practice is to try to keep your application stateless and only add State Management if you really need to improve the user experience, if you have network requests, that are very  slow, if you are showing lots of Loading Spinners to the users, if you have long backend delays.

// STATELESS SERVICE is a service, which does not keep in memory the data, which was retrieved from backend server, instead, It returns the data to the caller.

// STATEFUL SERVICE is a service, which keeps some state in memory.

// REACTIVE PROGRAMMING is an asynchronous programming using observables that makes it easier to compose asynchronous or callback-based code. 
// And RxJS (Reactive Extensions for JavaScript) is a library for reactive programming.

// State management is the process of managing the states of user controls. It helps developers build large-scale applications with heavy data communications while sustaining high application performance.

// Optimistic UI (optimistic data modification) - is a pattern that you can use to simulate the results of a mutation and update the UI even before receiving a response from the server. Once the response is received from the server, optimistic result is thrown away and replaced with the actual result.


import { provideCloudinaryLoader } from "@angular/common";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

// We want to have only one single instance of State and this is why it provide it to root
@Injectable({
    providedIn: 'root'
})
    
export class CoursesStore {
    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loading: LoadingService,
        private messages: MessagesService
    ) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response['payload']),
                catchError(err => {
                    const message = 'Could not load courses';
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            );
        this.loading.ShowLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // Copy of old not changed all courses list
        const courses = this.subject.getValue();
        // Finding index of exact course, we are changing
        const index = courses.findIndex(course => course.id == courseId);
        // Updates only a single course with the change. For example name of the course was changed.
        // So we find and take exact course we are changing and merging it with changes.
        const newCourse = {
            ...courses[index],
            ...changes
        }

        // Creating copy of new updated all courses list. slice(0) creates full copy of the array
        const newCourses: Course[] = courses.slice(0);

        newCourses[index] = newCourse;

        // Emit newCourses value to the rest of the application, that user interface imidiatly reflect the changes, we have made
        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                // Error handling with the catchError RxJs operator
                catchError(err => {
                    const message = "Could not save course";
                    console.log(message, err);
                    this.messages.showErrors(message);   // We are telling messagesService to show errors
                    return throwError(err);   // We are throwing error and ending saveCourse observable lifecycle
                }),
                shareReplay()                
        )
    }


    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => 
                    courses.filter(course => course.category == category)
                    .sort(sortCoursesBySeqNo)
                )
        )
    }
}