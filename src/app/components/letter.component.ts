import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-letter',
  standalone: true,
  template: `
    <div class="flex-item">{{value}}</div>
  `,
  styleUrls: ['./letter.scss'],
})
export class LetterComponent {
  @Input({ required: true }) value!: string;
}
