// Authentication store will keep in memory the value of the user profiles for logged in user

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = 'auth_data';     // We will save auth data to browsers local storage so that the user loggedin state would not be lost after refreshing browser

// Authentication state needs to be availabe to the whole application, so we are providing it to root
@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);  // Asigning null initial value, which means user is not logged in

    user$: Observable<User> = this.subject.asObservable();

    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));   // If we have exact user in user$ observable, then it means, that user is logged in
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));      // Setting isLoggedOut$ value opposite to isLoggedIn$

        // Checking if user exists in browser's local storage and if so- passing it to subject
        const user = localStorage.getItem(AUTH_DATA);

        if(user) {
            this.subject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<User> {
        // Validating with the server if email and password is correct
        return this.http.post<User>('/api/login', { email, password })
            .pipe(
                tap(user => {
                    this.subject.next(user);   // Adding user to subject, if we are getting this user from backend by provided email and password
                    localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                }),
                shareReplay()
            );
    }

    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }
}