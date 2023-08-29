import { Component, Input } from '@angular/core';
import { BoardCase, CaseStatus } from '../services/alphabet-game.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'my-letter',
  standalone: true,
  imports: [NgClass],
  template: `
    <div 
      class="flex-item" 
      [ngClass]="{hover: mouseOver, clicked: isClicked()}" 
      (mouseover)="mouseOver = true" 
      (mouseout)="mouseOver = false"
      (click)="case.selectCase(case)">{{case.value.value}}</div>
  `,
  styleUrls: ['./letter.scss'],
})
export class LetterComponent {
  @Input({ required: true }) case!: BoardCase;
  protected mouseOver = false;

  protected isClicked(): boolean {
    return this.case.getStatus() === CaseStatus.CLICKED;
  }
}
