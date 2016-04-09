window.onload = () => {
    let el: any = document.getElementById("pane");
    let context: CanvasRenderingContext2D = el.getContext("2d");

    let width = el.width;
    let height = el.height;
    // context.strokeRect(0, 0, width, height);

    let g = new Generator(10, 50);
    let r = new Render(g, context);
    r.draw();
};

enum HubType {
    LL,
    LR,
    RL,
    RR
}


class Render {

    draw() {
        this._context.lineWidth = 2;

        let h = this._generator.height;

        for (let y = 0; y < h; ++y) {
            let w = this._generator.getRowWidht(y);
            let offset = (y % 2) * 6;

            for (let x = 0; x < w; ++x) {
                this._context.strokeRect(x * 12 + offset, y * 5, 6, 10);
            }
        }

    }

    constructor(generator: Generator, context: CanvasRenderingContext2D) {
        this._generator = generator;
        this._context = context;
    }

    private _generator: Generator;
    private _context: CanvasRenderingContext2D;
}


class Generator {
    width: number;
    height: number;

    getHubType(x: number, y: number): HubType {
        this._validatePositon(x, y);
        return this._field[y][x];
    }

    setHubType(x: number, y: number, hubType: HubType) {
        this._validatePositon(x, y);
        this._field[y][x] = hubType;
    }

    getRowWidht(y: number): number {
        if (y % 2 === 0) {
            return this.width;
        }

        return this.width - 1;
    }

    constructor(width: number, heigth: number) {
        this.width = width;
        this.height = heigth;
        this._createField();
    }

    private _field: HubType[][];

    private _validatePositon(x: number, y: number) {

        if (x < 0 || x >= this.getRowWidht(y)) {
            throw new Error("Неверное задана ширина x");
        }

        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    }

    private _createField() {
        this._field = [];
        for (let y = 0; y < this.height; ++y) {
            this._field.push([]);
            let width = this.getRowWidht(y);

            for (let x = 0; x < width; ++x) {
                this._field[y].push(HubType.LL);
            }
        }
    }
}