// We are creating here Loading Spinner service, which we will use in different components.
// The idea is to create PRIVATE Behavior Subject, so it's boolean value (true/valse) would be changed only withnig this service and
// other components would be able to change this value indirectly though loaingOn() and loadingOff() methods.
// Meanwhile loading$ observable will derive from this Behaviour Subject and we will make it public (in loading.component.ts) and we will
// use it's true or false in other components to decide to show spinner or not
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);     // loadingSubject ir private and not accessible elsewhere

  // Here we are creating loading$ observable, which derives from loadingSubject. loadingSubject is BehaviorSubject, which is observable as well.
  // So whenever we change value for loadingSubject observable, loading$ observable will also know about this change.
  loading$: Observable<boolean> = this.loadingSubject.asObservable();   // loading$ will be public

  ShowLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() {
    this.loadingSubject.next(true);     // Turning on spinner
  }

  loadingOff() {
    this.loadingSubject.next(false);    // Turning off spinner
  }
}
