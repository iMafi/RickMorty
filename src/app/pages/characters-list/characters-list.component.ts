import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store } from "@ngrx/store";
import { ToastrService } from 'ngx-toastr';

import { filter, Observable, switchMap, takeUntil, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CharactersService } from '../../services/characters.service';
import { ICharacter, ICharacterResult } from "../../interfaces/character";
import { CharacterCardComponent } from "./character-card/character-card.component";
import { selectLoadingState } from '../../state/selectors/root';
import { loadEnd, loadStart } from '../../state/actions/root';


@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    CharacterCardComponent,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.scss'
})
export class CharactersListComponent implements OnInit, OnDestroy {
  charList: ICharacter[] = [];
  form: FormGroup;
  loading$: Observable<any>;
  pageParams: {
    next: string | null,
    prev: string | null,
    pages: number
  } = {
    next: null,
    prev: null,
    pages: 0
  };
  destroy$: Subject<void> = new Subject<void>();
  constructor(private readonly charactersService: CharactersService,
              private readonly fb: FormBuilder,
              private readonly store: Store,
              private readonly toastr: ToastrService) {
    this.loading$ = this.store.select(selectLoadingState);
    this.form = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.getAllCharacters();
    this.subscribeForSearchInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToPage(direction: 'prev' | 'next'): void {
    this.store.dispatch(loadStart());
    const params = direction === 'next' ? this.pageParams.next : this.pageParams.prev;
    this.getAllCharacters(params!);
  }

  jumpToPage(direction: 'prev' | 'next'): void {
    this.store.dispatch(loadStart());
    const searchValue = this.form.get('search')?.value
    const name = searchValue ? `name=${searchValue}&` : '';
    const page = direction === 'next' ? `page=${this.pageParams.pages}` : `page=1`;
    this.getAllCharacters(`${name}${page}`);
  }


  private subscribeForSearchInput(): void {
    this.form.controls['search'].valueChanges
      .pipe(
        debounceTime(500),
        filter((i: string) => i.length > 2),
        switchMap((i: string) => {
          this.store.dispatch(loadStart());
          return this.charactersService.getAllCharacters(`name=${i}`)
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (chars: ICharacterResult): void => {
          this.parseResults(chars);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.toastr.error(error.error.error, 'Error');
          this.store.dispatch(loadEnd());
          this.subscribeForSearchInput();
        }
      });
  }

  private parseResults(chars: ICharacterResult): void {
    this.store.dispatch(loadEnd());
    this.charList = chars.results;
    const info = chars.info;
    this.pageParams.prev = info.prev ? info.prev.split('?')[1] : null;
    this.pageParams.next = info.next ? info.next.split('?')[1] : null;
    this.pageParams.pages = info.pages;
  }

  private getAllCharacters(params?: string): void {
    this.charactersService.getAllCharacters(params)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
      next: (chars: ICharacterResult): void => {
        this.parseResults(chars);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.toastr.error(error.error.error, 'Error');
        this.store.dispatch(loadEnd());
      }
    });
  }
}
