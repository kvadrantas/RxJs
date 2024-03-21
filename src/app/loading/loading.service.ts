// We are creating here Loading Spinner service, which we will use in different components.
// The idea is to create PRIVATE Behavior Subject, so it's boolean value (true/valse) would be changed only withnig this service and
// other components would be able to change this value indirectly though loaingOn() and loadingOff() methods.
// Meanwhile loading$ observable will derive from this Behaviour Subject and we will make it public (in loading.component.ts) and we will
// use it's true or false in other components to decide to show spinner or not
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, concatMap, finalize } from "rxjs/operators";

@Injectable()
export class LoadingService {
    // Getting rid of Behavior Subject and loadingOn() and loadingOff() methods, which were used to change value of Subject
  private loadingSubject = new BehaviorSubject<boolean>(false);     // loadingSubject ir private and not accessible elsewhere

  // Here we are creating loading$ observable, which derives from loadingSubject. loadingSubject is BehaviorSubject, which is observable as well.
  // So whenever we change value for loadingSubject observable, loading$ observable will also know about this change.
  loading$: Observable<boolean> = this.loadingSubject.asObservable();   // loading$ will be public

    ShowLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        // We are taking obs$ observable as an input parameter in this ShowLoaderUntilCompleted() method and we are adding Loading indicator capabilities to obs$ observable
        // We are doing this firstly by creating default observable with "of(null)". null here is a default value for observable.
        // and secondly merging obs$ observable to our default observable with concatMap()
        // 
      return of(null)
          .pipe(
              tap(() => this.loadingOn()),  // We are turning on Loading Spinner, once our default observable receives initial value null and that happens instantly. tap() operator allows to execute additional things within observable without chanbging it's initial values
              concatMap(() => obs$),        // Merging obs$ observable (which we received as parameter) to our default observable, which we created with "of(null)". We perform merge with concatMap() operator
              finalize(() => this.loadingOff())     // Turning off Loading Spinner once obs$ observable completes and we know once it completes with finalize() operator
          );
  }

  loadingOn() {
    this.loadingSubject.next(true);     // Turning on spinner
  }

  loadingOff() {
    this.loadingSubject.next(false);    // Turning off spinner
  }
}
