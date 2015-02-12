window.addEventListener('DOMContentLoaded', function () {
	//When the page structure is loaded...

	var ROWS = 90, COLS = 90,
		cellProto,
		getLiveNeighbours,
		nextCycle,
		createCanvas,
		createCell,
		init,
		appendListeners,
		isPending = false,
		cycleTimeout,
		cells;

	cellProto = {
        isAlive: function () {
            return this.alive;
        },
        die: function () {
            this.alive = false;
            this.dom.classList.remove('alive');
        },
        live: function () {
            this.alive = true;
            this.dom.classList.add('alive');
        }
	};

	appendListeners = function (container, startBtn, stopBtn, clearBtn) {
        container.addEventListener('click', function (e) {
            var cell;
            if (isPending) {
                return
            }
            if (e.target.classList.contains('cell')) {
                cell = cells[e.target.dataset.index];

                if (cell.isAlive()) {
                    cell.die();
                } else {
                    cell.live();
                }
            }
        });

        startBtn.addEventListener('click', function (e) {
            nextCycle(cells);
            isPending = true;
        });

        stopBtn.addEventListener('click', function (e) {
            window.clearTimeout(cycleTimeout);
            isPending = false;
        });

        clearBtn.addEventListener('click', function (e) {
            window.clearTimeout(cycleTimeout);
            cells.forEach(function (cell) {
                cell.die()
            });
        })

	};

	init = function (xRows, yRows) {
		var container = document.querySelector('#game-canvas');
		cells = createCanvas(container, xRows, yRows).map(createCell);
		appendListeners(
			container,
			document.querySelector('.start'),
			document.querySelector('.stop'),
			document.querySelector('.clear')
		);
	};

	createCanvas = function (container, rows, colls) {
        var i, a, cellE1,
            fakeElement = document.createDocumentFragment(),
            baseCellE1 = document.createElement('div'), elements = [];

        baseCellE1.classList.add('cell');

        for (i = 0; i < rows; i++) {
            for (a = 0; a < colls; a++) {
                cellE1 = baseCellE1.cloneNode(true);
                cellE1.style.top = (i * 10) + 'px';
                cellE1.style.left = (a * 10) + 'px';

                var index = rows * i + a;
                cellE1.setAttribute('data-index', index.toString());

                elements.push(cellE1);
                container.appendChild(cellE1);
            }
        }
        container.appendChild(fakeElement);
        return elements;
	};

	createCell = function (domEl) {
        var cell = Object.create(cellProto);
        cell.alive = false;
        cell.dom = domEl;
        return cell;
	};

	getLiveNeighbours = function (index, cells) {
		return [
			index - 1,
			index + 1,
			index - COLS - 1,
			index - COLS,
			index - COLS + 1,
			index + COLS - 1,
			index + COLS,
            index + COLS + 1
		].filter(function (cellInd) {
			return cellInd >= 0 && cellInd < COLS * ROWS;
		}).reduce(function (preValue, cellInd) {
			return preValue + (cells[cellInd].isAlive() ? 1 : 0);
		}, 0);
	};

	nextCycle = function (cells) {
		cycleTimeout = window.setTimeout(function () {
			cells.map(function (cell, index) {
				return getLiveNeighbours(index, cells);
			}).forEach(function (neighbours, index) {
				if (cells[index].isAlive()) {
					if (neighbours < 2 || neighbours > 3) {
						cells[index].die();
					}
				} else if (neighbours === 3) {
					cells[index].live();
				}
			});
			nextCycle(cells);
		}, 150);
	};

	init(ROWS, COLS);
});
