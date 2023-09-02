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

    it('can not click outside the board', () => {
        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 10, y: 10}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeFalse();
    });

    it('can click anywhere in an empty board', () => {
        sut = new CaseBehavior(boardConfig);
        const boardCase = new BoardCase(sut, {x: 0, y: 0}, caseValue, CaseStatus.CLEAR);
        expect(sut.canSelectCase(boardCase)).toBeTrue();
    });

    it('can click on an unselected case aside last clicked case', () => {
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

    it('cannot click on an unselected case not aside the last clicked case', () => {
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

    it('can click on the last clicked selected case', () => {
        sut = new CaseBehavior(boardConfig);
        const clickedCases = [
            new BoardCase(sut, {x: 1, y: 2}, {value: "A"}, CaseStatus.CLICKED),
            new BoardCase(sut, {x: 2, y: 2}, {value: "B"}, CaseStatus.CLICKED),
            new BoardCase(sut, {x: 3, y: 2}, {value: "C"}, CaseStatus.CLICKED),
        ];
        clickedCases.forEach(boardCase => sut.selectCase(boardCase));
        expect(sut.canUnSelectCase(clickedCases[2])).toBeTrue();
    });

    it('cannot click on not last clicked selected case', () => {
        sut = new CaseBehavior(boardConfig);
        const clickedCases = [
            new BoardCase(sut, {x: 1, y: 2}, {value: "A"}, CaseStatus.CLICKED),
            new BoardCase(sut, {x: 2, y: 2}, {value: "B"}, CaseStatus.CLICKED),
            new BoardCase(sut, {x: 3, y: 2}, {value: "C"}, CaseStatus.CLICKED),
        ];
        clickedCases.forEach(boardCase => sut.selectCase(boardCase));

        expect(sut.canUnSelectCase(clickedCases[0])).toBeFalse();
        expect(sut.canUnSelectCase(clickedCases[1])).toBeFalse();
    })
});