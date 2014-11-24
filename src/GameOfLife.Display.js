

    (function() {

        var q/*cellIndexFromCoordinates*/ = function (x, y, height) {
            return y + x * height;
        };

        var create = function (width, liveCells) {
            var cells = [];
            var height = width;
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    cells[q/*cellIndexFromCoordinates*/(x, y, height)] = 0;
                }
            }

            for (var index = 0; index < liveCells.length; ++index) {
                var liveCell = liveCells[index];
                cells[q/*cellIndexFromCoordinates*/(liveCell.x, liveCell.y, height)] = 1;
            }

            return new Grid(cells, width);
        };

        var Grid = function(cells, width) {
            var self = this;

            self.a/*cells*/ = cells;
        
            self.w = width;
            self.h = width;

            self.e/*isAlive*/ = function (x, y) {
                return self.a/*cells*/[q/*cellIndexFromCoordinates*/(x, y, self.h)] == 1;
            }

            self.n/*cellIndexFromCoordinates*/ = function (x, y) {
                var neighbours = [
                    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
                    [x - 1, y], [x + 1, y],
                    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
                ];

                var numLiveNeighbours = 0;

                for (var index = 0; index < neighbours.length; ++index) {
                    var neighbour = neighbours[index];

                    if (neighbour[0] >= 0 && neighbour[0] < self.w)
                        if (neighbour[1] >=0 && neighbour[1] < self.h)
                            if (self.e/*isAlive*/(neighbour[0], neighbour[1]))
                                numLiveNeighbours++;
                }

                return numLiveNeighbours;
            }
        };
        

        var s/*step*/ = function(inputGrid) {
            var result = inputGrid.a/*cells*/.slice(0);

            for (var x = 0; x < inputGrid.w; ++x) {

                for (var y = 0; y < inputGrid.h; ++y) {

                    var isAlive = inputGrid.e/*isAlive*/(x, y);
                    var numLiveNeighbours = inputGrid.n/*cellIndexFromCoordinates*/(x, y);
                    var isAliveAfterStep;

                    if (isAlive) {
                        isAliveAfterStep = numLiveNeighbours == 2 || numLiveNeighbours == 3;
                    }
                    else {
                        isAliveAfterStep = numLiveNeighbours == 3;
                    }

                    result[q/*cellIndexFromCoordinates*/(x, y, inputGrid.h)] = isAliveAfterStep ? 1 : 0;
                }
            }

            return new Grid(result, inputGrid.w);
        };

        var canvas = document.getElementById('gol-display');
        var context = canvas.getContext('2d');
        context.fillStyle = 'black';
            
        var widthInCells = /*Math.floor(canvas.width / 2)*/200;

        var liveCells = [];
        var grid = null;

        var lastTimeUpdated = 0;

        u/*update*/ = function () {
            var now = new Date().getTime();
            
            requestAnimationFrame(u/*update*/);

            if (now - lastTimeUpdated >= 30)
            {
                lastTimeUpdated = now;
                grid = s/*step*/(grid);
                
                context.clearRect(0, 0, canvas.width, canvas.height);

                var cellsToDraw = [];
                for (var y = 0; y < grid.h; ++y) {
                    for (var x = 0; x < grid.w; ++x) {
                        var cellValue = grid.a/*cells*/[q/*cellIndexFromCoordinates*/(x, y, grid.h)];
                        if (cellValue != 0)
                            cellsToDraw.push({ x: x, y: y });
                    }
                }

                context.beginPath();
                for (var i = 0; i < cellsToDraw.length; ++i) {
                    var cell = cellsToDraw[i];
                    context.fillRect(cell.x *2, cell.y * 2, 2, 2);
                }
            }
        }

        for (var i = 0; i < widthInCells; ++i) {
            liveCells.push({ x: i, y: i });
            liveCells.push({ x: widthInCells - 1 - i, y: i });
        }
        grid = create(widthInCells, liveCells);
        u/*update*/();
    })();
