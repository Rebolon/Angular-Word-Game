export enum GameType {
    Alphabet,
    Boggle,
}

export const GameType2LabelMapping: Record<GameType, string> = {
    [GameType.Alphabet]: "Alphabet",
    [GameType.Boggle]: "Boggle",
};