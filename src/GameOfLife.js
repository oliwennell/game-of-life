
var GameOfLife = GameOfLife || {

    cellIndexFromCoordinates: function (x, y, height) {
        return y + x * height;
    },

    GridCreator: {

        createFromCells: function(cells) {
            return new GameOfLife.Grid(cells);
        },

        create: function (width, height, liveCells) {
            var cells = [];
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    cells[GameOfLife.cellIndexFromCoordinates(x, y, height)] = 0;
                }
            }

            let cellCoordinates = [
                    [2, 4],
                    [2, 5],
                    [2, 6],
                    [3, 1],
                    [3, 2],
                    [3, 3],
                    [3, 4],
                    [3, 6],
                    [4, 4],
                    [4, 5],
                    [4, 6],
                    
                    [5, 8],
                    [6, 7],
                    [6, 8],
                    [6, 9],
                    [7, 7],
                    [7, 8],
                    [7, 9],
                    
                    [8,11],
                    [8,13],
                    [9,11],
                    [10,11],
                    [11,11],
                    [11,13],
                    
                    [13,15],
                    [13,16],
                    [13,19],
                    [14,14],
                    [14,17],
                    [15,15],
                    [15,16],
                    [15,19]
            ];
            cellCoordinates.forEach(c => {
                cells[GameOfLife.cellIndexFromCoordinates(c[0], c[1], height)] = 1
            });

            return new GameOfLife.Grid(cells);
        }
    },

    Grid: function(cells) {
        var self = this;

        self.cells = cells;
    
        self.width;
        self.height;
        self.width = self.height = Math.sqrt(self.cells.length);

        self.isAlive = function (x, y) {
            return self.cells[GameOfLife.cellIndexFromCoordinates(x, y, self.height)] == 1;
        }

        self.getNumLiveNeighbours = function (x, y) {
            var neighbours = [
                [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
                [x - 1, y], [x + 1, y],
                [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
            ];

            var numLiveNeighbours = 0;

            for (var index = 0; index < neighbours.length; ++index) {
                var neighbour = neighbours[index];

                if (neighbour[0] < 0 || neighbour[0] >= self.width)
                    continue;

                if (neighbour[1] < 0 || neighbour[1] >= self.height)
                    continue;

                if (self.isAlive(neighbour[0], neighbour[1]))
                    numLiveNeighbours++;
            }

            return numLiveNeighbours;
        }
    },
    
    Simulation: {

        step: function(inputGrid) {
            var result = inputGrid.cells.slice(0);

            for (var x = 0; x < inputGrid.width; ++x) {

                for (var y = 0; y < inputGrid.height; ++y) {

                    var isAlive = inputGrid.isAlive(x, y);
                    var numLiveNeighbours = inputGrid.getNumLiveNeighbours(x, y);
                    var isAliveAfterStep;

                    if (isAlive) {
                        isAliveAfterStep = numLiveNeighbours == 2 || numLiveNeighbours == 3;
                    }
                    else {
                        isAliveAfterStep = numLiveNeighbours == 3;
                    }

                    result[GameOfLife.cellIndexFromCoordinates(x, y, inputGrid.height)] = isAliveAfterStep ? 1 : 0;
                }
            }

            return GameOfLife.GridCreator.createFromCells(result);
        }
    }
}
