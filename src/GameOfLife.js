
var GameOfLife = {

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

            for (var index = 0; index < liveCells.length; ++index) {
                var liveCell = liveCells[index];
                cells[GameOfLife.cellIndexFromCoordinates(liveCell.x, liveCell.y, height)] = 1;
            }

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
    },

    start: function(sizeInCells, cellSize) {
    
        var grid = GameOfLife.GridCreator.create(sizeInCells, sizeInCells, [

            { x: 2, y: 11 },
            { x: 5, y: 11 },
            { x: 6, y: 12 },
            { x: 6, y: 13 },
            { x: 6, y: 14 },
            { x: 5, y: 14 },
            { x: 4, y: 14 },
            { x: 3, y: 14 },
            { x: 2, y: 13 },

            { x: 12, y: 14 },
            { x: 15, y: 14 },
            { x: 16, y: 12 },
            { x: 16, y: 12 },
            { x: 16, y: 11 },
            { x: 15, y: 11 },
            { x: 14, y: 11 },
            { x: 13, y: 11 },
            { x: 12, y: 12 }
        ]);

        var lastTimeUpdated = null;

        update = function () {
            var now = new Date().getTime();
            
            requestAnimationFrame(update);

            if (lastTimeUpdated != null && now - lastTimeUpdated < 50) {
                return;
            }

            lastTimeUpdated = now;
            
            grid = GameOfLife.Simulation.step(grid);

            var canvas = document.getElementById('gol-display');
            canvas.width = canvas.height = sizeInCells * cellSize;

            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            var cellsToDraw = [];
            for (var y = 0; y < grid.height; ++y) {
                for (var x = 0; x < grid.width; ++x) {
                    var cellValue = grid.cells[GameOfLife.cellIndexFromCoordinates(x, y, grid.height)];
                    if (cellValue == 0)
                        continue;

                    cellsToDraw.push({ x: x, y: y });
                }
            }

            context.fillStyle = 'black';
            context.beginPath();
            for (var index = 0; index < cellsToDraw.length; ++index) {
                var cell = cellsToDraw[index];
                context.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            }
        }

        update();

    }
}