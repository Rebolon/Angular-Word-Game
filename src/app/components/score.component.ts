import { Component, Input } from '@angular/core';
import { GameScoring } from '../services/word-game.interface';

@Component({
  selector: 'my-score',
  standalone: true,
  template: `
    <h2>Score : {{ gameScoring.calculateScore(words)}}</h2>
  `,
})
export class ScoreComponent {
  @Input({ required: true }) words!: string[];
  
  @Input({ required: true }) gameScoring!: GameScoring;
}
