import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICharacter, ICharacterResult} from '../interfaces/character';
import { CacheService } from './cache.service';
import { API } from './api.const';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  private url = '/character';

  constructor(
    private readonly http: HttpClient,
    private readonly cacheService: CacheService
  ) { }

  getAllCharacters(params?: string): Observable<ICharacterResult> {
    const options = { params: new HttpParams({ fromString: params })}
    return this.cacheService.getCachedObservable(
      `AllCharacters${params}`,
      this.http.get<ICharacterResult>(`${API}${this.url}`, options)
    );
  }

  getCharacter(id: number): Observable<ICharacter> {
    return this.cacheService.getCachedObservable(
      `character-${id}`,
      this.http.get<ICharacter>(`${API}${this.url}/${id}`)
    );
  }
}
