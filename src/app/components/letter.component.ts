import { Component, Input } from '@angular/core';
import { BoardCase } from '../services/alphabet-game.interface';

@Component({
  selector: 'my-letter',
  standalone: true,
  template: `
    <div class="flex-item">{{value}}</div>
  `,
  styleUrls: ['./letter.scss'],
})
export class LetterComponent {
  @Input({ required: true }) value!: BoardCase;
}
