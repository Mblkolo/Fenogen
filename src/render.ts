import {Generator, HubType} from "./generator"

interface Point {
    x: number;
    y: number;
}

export class PreviewRender {
    private _generator: Generator;
    private _context: CanvasRenderingContext2D;

    constructor(generator: Generator, context: CanvasRenderingContext2D) {
        this._generator = generator;
        this._context = context;
    }

    draw() {
        const ctx = this._context;
        ctx.lineWidth =0.5;

        const  preview = this._generator.getHubPreview(30);
        for(let rowNo=0; rowNo<preview.length; ++ rowNo) {
            const hubRow = preview[rowNo];
            for(let hubNo = 0; hubNo < hubRow.length; ++hubNo) {
                const hubColor = hubRow[hubNo];
                if(hubColor  == null)
                    continue;

                ctx.fillStyle = hubColor;
                // ctx.beginPath();
                // ctx.arc(hubNo * 5, rowNo * 7 + 5, 4.5, 0, 2 * Math.PI);
                // ctx.closePath();

                // ctx.fill();
                // ctx.stroke();

                // ctx.fillRect(hubNo * 6, rowNo * 5, 6, 10);
                // ctx.strokeRect(hubNo * 6, rowNo * 5, 6, 10);

                const size = 6;

                ctx.beginPath();
                ctx.moveTo(hubNo * size, rowNo * size);
                ctx.lineTo(hubNo * size + size, rowNo * size + size)
                ctx.lineTo(hubNo * size , rowNo * size + 2 * size)
                ctx.lineTo(hubNo * size - size, rowNo * size + size)
                ctx.closePath();

                ctx.fill();
                ctx.stroke();

            }
        }
    }
}

export class EditorRender {

    draw() {
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height)

        let h = this._generator.height;
        let w = this._generator.width;

        for (let y = 0; y < h + 1; ++y) {
            for (let x = 0; x < w + 1; ++x) {
                this._drawThreads(x, y);
            }
        }

        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                this._drawHub(x, y);
            }
        }
    }

    constructor(generator: Generator, context: CanvasRenderingContext2D) {
        this._generator = generator;
        this._context = context;
    }

    private _generator: Generator;
    private _context: CanvasRenderingContext2D;

    public readonly step: number = 27;
    public readonly hubSize = 6;


    private _drawThreads(x: number, y: number) {
        let color = this._generator.getThreadNo(x, y);
        let ctx = this._context;
        let step = this.step;
        const size = this.hubSize;

        ctx.lineWidth = 1;
        
        let y0 = (y + 0) * step - size;
        let y1 = (y + 1) * step - size;
        let y2 = (y + 1) * step + size;
        let y3 = (y + 0) * step + size;

        let x0: number, x1: number;
        if ((x + y) % 2 === 0) {
            x0 = (x + 0) * step;
            x1 = (x + 1) * step;
        }
        else {
            x0 = (x + 1) * step;
            x1 = (x + 0) * step;
        }

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x0, y3);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
    }

    private _drawHub(x: number, y: number) {
        const ctx = this._context;
        const size = 8;
        const step = this.step;

        const hubType = this._generator.getHubType(x, y);
        const hubColor = this._generator.getHubNo(x, y);
        if(hubColor === null)
            return;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = hubColor;
        
        ctx.beginPath();
        ctx.arc((x + 1) * step, (y + 1) * step, size * 1.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        this.drawHubDirection(hubType, size, x, y);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        this.drawHubDirection(hubType, size, x, y);
    }

    private drawHubDirection(hubType: HubType, size: number, x: number, y: number )
    {
        const ctx = this._context;
        const step = this.step;
        
        ctx.beginPath();
        if (hubType === HubType.LL || hubType === HubType.LR) {
            ctx.moveTo((x + 1) * step - (size - 2), (y + 1) * step - (size - 2));
        }
        else {
            ctx.moveTo((x + 1) * step + (size - 2), (y + 1) * step - (size - 2));
        }

        ctx.lineTo((x + 1) * step, (y + 1) * step);

        if (hubType === HubType.LL || hubType == HubType.RL) {
            ctx.lineTo((x + 1) * step - (size - 2), (y + 1) * step + (size - 2));
        }
        else {
            ctx.lineTo((x + 1) * step + (size - 2), (y + 1) * step + (size - 2));
        }

        ctx.stroke();
    }
}