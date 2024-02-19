import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  // STATELESS OBSERVABLE BASED SERVICE - it means, that this service does not hold any data and it means, that it does not use any memory to store
  // this data. Instead service returns Observable and the data is actually read in the components, where you subscirbe to this
  // service.
  loadAllCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>("/api/courses")
      .pipe(map((res) => res["payload"]));
  }
}
