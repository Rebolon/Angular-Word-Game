import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid.component';
import { Boggle } from './services/boggle.service';
import { Alphabet } from './services/alphabet.service';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, GridComponent],
  providers: [Alphabet, Boggle],
  template: `
  <my-grid [game]="game"></my-grid>
  `,
})
export class AppComponent {
  protected game = inject(Boggle);
}
