import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { GameType } from "./game.model";

export function gameValidator(game: GameType[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        
        return !game.includes(value) ? {game: {value}} : null;
    };
}