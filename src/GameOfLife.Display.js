
var GameOfLifeDisplay = GameOfLifeDisplay || {

    init: function(canvasElement) {
    
        var canvas = canvasElement;
            
        var cellSize = 5;
        var widthInCells = Math.floor(canvasElement.width / cellSize);

        var liveCells = [];
        var grid = null;

        var lastTimeUpdated = null;
        var autoStep = false;
        
        render = function () {

            //canvas.width = canvas.height = widthInCells * cellSize;

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
                context.fillRect(
                    cell.x * cellSize,
                    cell.y * cellSize,
                    cellSize,
                    cellSize);
            }
        }

        update = function () {
            var now = new Date().getTime();
            
            requestAnimationFrame(update);

            if (lastTimeUpdated != null && now - lastTimeUpdated < 50) {
                return;
            }

            lastTimeUpdated = now;
            
            if (autoStep)
                grid = GameOfLife.Simulation.step(grid);

            render();
        }

        createInitialLiveCells = function () {
            for (var i = 0; i < widthInCells; ++i) {
                liveCells.push({ x: i, y: i });
                liveCells.push({ x: widthInCells - 1 - i, y: i });
            }

            grid = GameOfLife.GridCreator.create(widthInCells, widthInCells, liveCells);
        }

        init = function () {

            createInitialLiveCells();

            canvasElement.onclick = function () {
                autoStep = !autoStep;
            };
            update();
        }
        init();
    }
}