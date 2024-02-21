import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

import { CharactersService } from '../../services/characters.service';
import { ICharacter, DefaultCharacter } from '../../interfaces/character';
import { CharacterCardComponent } from '../characters-list/character-card/character-card.component';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    RouterLink
  ],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
  animations: [
    trigger('showHide', [
      state('hide', style({
        opacity: 0,
      })),
      state('show', style({
        opacity: 1,
      })),
      transition('show <=> hide', [
        animate('1s')
      ])
    ])
  ]
})
export class CharacterDetailsComponent implements OnInit, OnDestroy {
  character: ICharacter = new DefaultCharacter();
  id: number;
  showInfo: boolean = false;
  destroy$: Subject<void> = new Subject<void>();
  get infoBtnText(): string {
    return `${this.showInfo ? 'Hide' : 'Show'} More Info`;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly charactersService: CharactersService,
    private readonly toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.charactersService.getCharacter(this.id)
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({
        next: (char: ICharacter) => {
          this.character = char;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error.error, 'Error');
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }
}
