
(function() {

    var cellCoordinatesFromIndex = function(grid, index) {
        var _y = Math.floor(index / grid.w);
        var _x = index - (_y * grid.w);
        return {
            y: _y,
            x: _x
        };
    };

    var isCellAlive = function (x, y, grid) {
        return grid.c[y + x * grid.h] == 1
    }

    var getNumLiveNeighbours = function (x, y, grid) {
        var neighbours = [
            [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y], [x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
        ];

        var numLiveNeighbours = 0;

        for (var index = 0; index < neighbours.length; ++index) {
            var neighbour = neighbours[index];

            if (neighbour[0] >= 0 && neighbour[0] < grid.w)
                if (neighbour[1] >=0 && neighbour[1] < grid.h)
                    if (isCellAlive(neighbour[0], neighbour[1], grid))
                        numLiveNeighbours++;
        }

        return numLiveNeighbours;
    };

    var step = function(inputGrid) {
        var result = inputGrid.c.slice(0);

        for (var i=0; i<inputGrid.c.length; ++i) {
            var cell = cellCoordinatesFromIndex(inputGrid, i);

            var isAlive = isCellAlive(cell.x, cell.y, inputGrid);
            
            var numLiveNeighbours = getNumLiveNeighbours(cell.x, cell.y, inputGrid);
            var isAliveAfterStep;

            if (isAlive) {
                isAliveAfterStep = numLiveNeighbours == 2 || numLiveNeighbours == 3;
            }
            else {
                isAliveAfterStep = numLiveNeighbours == 3;
            }

            result[i] = isAliveAfterStep ? 1 : 0;
        }

        return {
            c: result,
            w: inputGrid.w,
            h: inputGrid.w
        };
    };

    var canvas = document.getElementById('gol');
    var context = canvas.getContext('2d');
      
    var widthInCells = /*Math.floor(canvas.width / 2)*/200;

    var liveCells = [];
    var grid = null;

    var lastTimeUpdated = 0;

    var update = function () {
        var now = new Date().getTime();
        
        requestAnimationFrame(update);

        if (now - lastTimeUpdated >= 30)
        {
            lastTimeUpdated = now;
            grid = step(grid);
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            
            for (var j=0; j<grid.c.length; ++j) {
                var cellValue = grid.c[j];
                if (cellValue != 0) {
                    var cell = cellCoordinatesFromIndex(grid, j);
                    context.fillRect(cell.x*2, cell.y*2, 2, 2);  
                }
            }
        }
    }


    var i;
    var cells = new Array(widthInCells*widthInCells);
    for (i=0; i<cells.length; ++i) {
        cells[i] = 0;
    }
    for (i=0; i<widthInCells; ++i) {
        cells[i*(widthInCells+1)] = 1;
        cells[(i+1)*(widthInCells-1)] = 1;
    }
    grid = { 
        c: cells,
        w: widthInCells, 
        h: widthInCells 
    };

    update();

})();
