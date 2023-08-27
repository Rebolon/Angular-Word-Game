import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
  } from '@angular/forms';
import { GameType, GameType2LabelMapping } from './game.model'
import { gameValidator } from './game.validator.form';

// Hack because i cannot have a class property used inside constructor whereas i must call super before its usage
const gameOptions: GameType[] = [GameType.Alphabet, GameType.Boggle];

export class GameSelectorForm extends FormGroup {
  readonly game = this.get('game') as FormControl<GameType>;

  constructor(
    readonly formBuilder: FormBuilder = new FormBuilder()
  ) {
    const formControls = formBuilder.group({
      game: new FormControl<number>(
        -1,
        [Validators.required, gameValidator(gameOptions)]
      )
    }, {
      updateOn: "change"
    }).controls;

    super(
      formControls
    );
  }

  getGamesKeys(): GameType[] {
    return gameOptions;
  }

  getGameValue(gameTypeKey: GameType): string {
    return GameType2LabelMapping[gameTypeKey];
  }
}