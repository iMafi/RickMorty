import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cacheMap: Map<
    string,
    Observable<any>
  > = new Map();
  constructor() {}

  getCachedObservable<T>(key: string, source: Observable<T>): Observable<T> {
    if (!this.cacheMap.has(key)) {
      this.cacheMap.set(key, source.pipe(shareReplay(1)));
    }

    return this.cacheMap.get(key) as Observable<T>;
  }
}
