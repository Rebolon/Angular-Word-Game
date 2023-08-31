import { BoardCase, BoardConfig, CaseStatus, CaseValue } from "./alphabet-game.interface";
import { CaseBehavior } from "./case-behavior.service";

describe('CaseBehavior', () => {
    let sut: CaseBehavior;
    let caseValue: CaseValue = {value: "A"};

    beforeEach(() => {});
  
    it('can click anywhere in an empty board', () => {
        const boardConfig: BoardConfig = {
            cols: 5,
            rows: 5
        }

        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 0, y: 0}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeTrue();
    });

    it('can not click outside the board', () => {
        const boardConfig: BoardConfig = {
            cols: 5,
            rows: 5
        }

        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 10, y: 10}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeFalse();
    })
});