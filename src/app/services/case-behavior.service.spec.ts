import { BoardCase, BoardConfig, CaseStatus, CaseValue } from "./alphabet-game.interface";
import { CaseBehavior } from "./case-behavior.service";

describe('CaseBehavior', () => {
    let sut: CaseBehavior;
    let caseValue: CaseValue = {value: "A"};
    let boardConfig: BoardConfig = {
        cols: 5,
        rows: 5
    };

    beforeEach(() => {});

    // is ok
    it('can not click outside the board', () => {
        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 10, y: 10}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeFalse();
    });

    // is ok
    it('can click anywhere in an empty board', () => {
        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 0, y: 0}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeTrue();
    });

    // is ok
    it('can click on a case aside already clicked case', () => {
        [
            {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, 
            {x: 1, y: 2}, {x: 3, y: 2},
            {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
        ].forEach(coordinates => {
            sut = new CaseBehavior(boardConfig);
            const clickedBoardCase = new BoardCase(sut, {x: 2, y: 2}, caseValue, CaseStatus.CLICKED);
            sut.selectCase(clickedBoardCase);
            const newBoardCase = new BoardCase(sut, coordinates, {value: "Z"}, CaseStatus.CLICKED);
            expect(sut.canSelectCase(newBoardCase)).toBeTrue();
        });
    });

    it('cannot click on a case not aside an already clicked case', () => {
        [
            {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, 
            {x: 0, y: 1}, {x: 4, y: 1},
            {x: 0, y: 2}, {x: 4, y: 2},
            {x: 0, y: 3}, {x: 4, y: 3},
            {x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4},  {x: 3, y: 4}, {x: 4, y: 4},
        ].forEach(coordinates => {
            sut = new CaseBehavior(boardConfig);
            const clickedBoardCase = new BoardCase(sut, {x: 2, y: 2}, caseValue, CaseStatus.CLICKED);
            sut.selectCase(clickedBoardCase);
            const newBoardCase = new BoardCase(sut, coordinates, {value: "Z"}, CaseStatus.CLICKED);
            expect(sut.canSelectCase(newBoardCase)).toBeFalse();
        });
    });
});