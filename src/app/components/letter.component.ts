import { Component, Input } from '@angular/core';
import { BoardCase, CaseStatus, GameBehavior } from '../services/word-game.interface';
import { NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'my-letter',
    imports: [NgClass],
    template: `
    <div
      matRipple
      class="flex-item primary"
      [ngClass]="{hover: mouseOver, clicked: isClicked()}"
      (mouseover)="mouseOver = true"
      (mouseout)="mouseOver = false"
      (click)="click()">{{case.value.value}}</div>
  `,
    styleUrls: ['./letter.scss']
})
export class LetterComponent {
  @Input({ required: true }) behavior!: GameBehavior;
  @Input({ required: true }) case!: BoardCase;
  protected mouseOver = false;

  protected isClicked(): boolean {
    return this.case.getStatus() === CaseStatus.CLICKED;
  }

  protected click(): void {
    switch (this.case.getStatus()) {
      case CaseStatus.CLEAR:
        this.behavior.selectCase(this.case);
        break;
      case CaseStatus.CLICKED:
        this.behavior.unSelectCase(this.case);
        break;
      default:
        console.warn('LetterComponent', 'click', 'unknown case status', this.case.getStatus());
    }
  }
}
