

var cellIndexFromCoordinates = function (x, y, height) {
    return x + y * height;
}

var GridCreator = {

    createFromCells: function(cells) {
        return new Grid(cells);
    },

    create: function (width, height, liveCells) {
        var cells = [];
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                cells[cellIndexFromCoordinates(x, y, height)] = false;
            }
        }

        for (var index = 0; index < liveCells.length; ++index) {
            var liveCell = liveCells[index];
            cells[cellIndexFromCoordinates(liveCell.x, liveCell.y, height)] = true;
        }

        return new Grid(cells);
    }
}

function Grid(cells) {
    var self = this;

    self.cells = cells;
    
    self.width;
    self.height;
    self.width = self.height = Math.sqrt(self.cells.length);

    self.isAlive = function (x, y) {
        return self.cells[cellIndexFromCoordinates(x, y, self.height)];
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
}
    
var GameOfLife = {

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

                result[cellIndexFromCoordinates(x, y, inputGrid.height)] = isAliveAfterStep;
            }
        }

        return GridCreator.createFromCells(result);
    }
};