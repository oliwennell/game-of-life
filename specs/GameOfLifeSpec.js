
describe("A live cell", function () {

    describe("dies", function () {

        it("when it has no live neighbours", function () {
            var nextGeneration = GameOfLife.step([
                0, 0, 0,
                0, 1, 0,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(0);
        });

        it("when it has one live neighbour", function () {
            var nextGeneration = GameOfLife.step([
                0, 0, 0,
                0, 1, 1,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(0);
        });

        it("when it has more than three live neighbours", function () {
            var nextGeneration = GameOfLife.step([
                1, 1, 1,
                1, 1, 0,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(0);
        });
    });

    describe("stays alive", function () {

        it("when it has two live neighbours", function () {
            var nextGeneration = GameOfLife.step([
                0, 0, 0,
                1, 1, 1,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(1);
        });

        it("when it has three live neighbours", function () {
            var nextGeneration = GameOfLife.step([
                1, 0, 0,
                1, 1, 1,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(1);
        });
    });
});

describe("A dead cell", function () {

    describe("comes alive", function () {

        it("when it has three live neighbours", function () {
            var nextGeneration = GameOfLife.step([
                1, 0, 0,
                1, 0, 1,
                0, 0, 0
            ]);

            expect(nextGeneration[4]).toBe(1);
        });
    });
});