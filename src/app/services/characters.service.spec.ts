import { TestBed } from '@angular/core/testing';

import { CharactersService } from './characters.service';
import { HttpClient } from '@angular/common/http';

describe('CharactersService', () => {
  let service: CharactersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy}]
    });
    service = TestBed.inject(CharactersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
