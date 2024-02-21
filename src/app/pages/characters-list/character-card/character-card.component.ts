import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss'
})
export class CharacterCardComponent {
  @Input() pictureUrl: string = '';
  @Input() name: string = '';
  @Input() width: number = 300;
  @Input() height: number = 300;

  constructor(
  ) {}
}
