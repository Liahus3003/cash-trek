import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenSizeSubject = new BehaviorSubject<string>('desktop');

  constructor() {
    this.detectScreenSize();
    window.addEventListener('resize', () => {
      this.detectScreenSize();
    });
  }

  private detectScreenSize() {
    const width = window.innerWidth;
    let screenSize: string;

    if (width < 768) {
      screenSize = 'mobile';
    } else if (width >= 768 && width < 1200) {
      screenSize = 'tab';
    } else {
      screenSize = 'desktop';
    }

    this.screenSizeSubject.next(screenSize);
  }

  getScreenSize(): Observable<string> {
    return this.screenSizeSubject.asObservable();
  }
}
