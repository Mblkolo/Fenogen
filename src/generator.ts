
export enum HubType {
    None,
    LL,
    LR,
    RL,
    RR
}

export enum ThreadType {
    Down,
    Left,
    Right
}

export class Generator {
    width: number;
    height: number;

    getHubType(x: number, y: number): HubType {
        this._validateHubPositon(x, y);
        return this._hubsField[y][x];
    }

    getHubNo(x: number, y: number): string | null {
        this._validateHubPositon(x, y);
        return Generator.getHubColorByTopThreads(this._hubsField[y], this._threadField[y], x);
    }

    setHubType(x: number, y: number, hubType: HubType) {
        this._validateHubPositon(x, y);
        this._hubsField[y][x] = hubType;
        this.recalculateThreadColors();
    }

    getThreadNo(x: number, y: number): string {
        return this._threadField[y][x];
    }

    nextHubType(x: number, y: number) {
        this._validateHubPositon(x, y);
        
        var a:  { [index: number] : HubType } = {};
        a[HubType.None] = HubType.None;
        a[HubType.RL] = HubType.LL;
        a[HubType.LL] = HubType.LR;
        a[HubType.LR] = HubType.RR;
        a[HubType.RR] = HubType.RL;

        this._hubsField[y][x] = a[this._hubsField[y][x]];
        this.recalculateThreadColors();
    }

    getColors(): string[] {
        return this._threadField[0];
    }

    setThreadColor(threadNo: number, color: string) {
        this._threadField[0][threadNo] = color;
        this.recalculateThreadColors();
    }

    //Размеры задаются в хабах
    constructor(width: number, heigth: number) {
        this.width = width;
        this.height = heigth;
        this._createField();
        this.recalculateThreadColors();
    }

    removeThread() {
        if(this.width > 1)
        {
            this.width--;
            this._threadField.forEach(row => {
                row.pop();
            });
            this._hubsField.forEach(row => {
                row.pop();
            });

            this.recalculateThreadColors();
        }
    }

    addThread() {
        this.width++;
        this._threadField.forEach(row => {
            row.push("#ffffff");
        });
        this._hubsField.forEach((row, index) => {
            row.push(this.getNewHub(index, row.length));
        });

        this.recalculateThreadColors();
    }

    addHubRow() {
        this.height += 2;
        for (let y = this.height-2; y < this.height; ++y) {
            this._hubsField.push([]);
            for (let x = 0; x < this.width; ++x) {
                this._hubsField[y].push(this.getNewHub(y, x));
            }
        }

        for (let y = 0; y < 2; ++y) {
            const newRow = [];
            for (let x = 0; x < this.width + 1; ++x) {
                newRow.push("#ffffff");
            }
            this._threadField.push(newRow);
        }

        this.recalculateThreadColors();
    }

    removeHubRow() {
        if(this.height > 2) {
            this.height -= 2;
            
            this._hubsField.pop();
            this._hubsField.pop();

            this._threadField.pop();
            this._threadField.pop();

            this.recalculateThreadColors();
        }
    }
    
    public getState() : GeneratorState {
        return {
            width: this.width,
            height: this.height,
            colors: [...this._threadField[0]],
            hubs: this._hubsField.map(x => [...x])
        }
    }

    private _hubsField: HubType[][] = [];
    private _threadField: string[][] = [];

    private _validateHubPositon(x: number, y: number) {

        if (x < 0 || x >= this.width) {
            throw new Error("Неверное задана ширина x");
        }

        if (y < 0 || y >= this.height) {
            throw new Error("Неверное задана высота y");
        }
    }

    private _createField() {
        const hubTypes = [HubType.LL, HubType.LR, HubType.RL, HubType.RR];

        for (let y = 0; y < this.height; ++y) {
            this._hubsField.push([]);
            for (let x = 0; x < this.width; ++x) {
                this._hubsField[y].push(this.getNewHub(y, x));
            }
        }

        const colors = ['#ffffff', '#00ffff', '#ff00ff', '#ffff00', '#0000ff', '#ff0000']

        for (let y = 0; y < this.height + 1; ++y) {
            this._threadField.push([]);
            for (let x = 0; x < this.width + 1; ++x) {
                this._threadField[y].push( getRandom(colors));
            }
        }
    }

    private getNewHub(row: number, no: number) {
        const isNone = (row + no) % 2 == 1;
        return (isNone ? HubType.None : HubType.LL);
    }

    private recalculateThreadColors()
    {
        for (let y = 1; y < this.height + 1; ++y) {
            const hubRow = this._hubsField[y-1];
            const threadRow = this._threadField[y-1];

            this._threadField[y] = Generator.getNextThreadRow(threadRow, hubRow);
        }
    }

    private static getNextThreadRow(threadRow: string[], hubRow: HubType[]) {
        return threadRow.map((_, index) => Generator.getParentColor(threadRow, hubRow, index));
    }


    private static getParentColor(threadRow: string[], hubRow: HubType[], x: number) : string
    {
        if(x > 0){
            const leftTopHub = hubRow[x-1];

            if(leftTopHub === HubType.LR || leftTopHub === HubType.RL)
                 return threadRow[x-1];
        }

        if(x < hubRow.length){
            const rightTopHub = hubRow[x];
            if(rightTopHub === HubType.LR || rightTopHub === HubType.RL)
                 return threadRow[x+1];
        }

        return threadRow[x];
    }

    private static getHubColorByTopThreads(hubRow: HubType[], threads: string[], hubNo: number) {
        const hubType = hubRow[hubNo];
        if(hubType === HubType.None)
            return null;

        if(hubType === HubType.LL || hubType === HubType.LR)
            return threads[hubNo];
        else
            return threads[hubNo+1];
    }

    private static getThreadRowByTopThreads(hubRow: HubType[], threads: string[]) {

    }

    getHubPreview(length: number): (string | null) [][] {
        let currentHubRow = this._hubsField[0];
        let currentThreadsColors = this._threadField[0];

        const result: (string|null)[][] = [];

        for(let i=0; i<length; ++i) {
            const hubRow = currentHubRow.map((hub, index) => {
                return Generator.getHubColorByTopThreads(currentHubRow, currentThreadsColors, index)
            });
            result.push(hubRow);

            currentThreadsColors = Generator.getNextThreadRow(currentThreadsColors, currentHubRow);
            currentHubRow = this._hubsField[ (i+1) % this._hubsField.length];
        }

        return result;
    }
}

function getRandom<T>(data: T[])
{
    return data[Math.floor(Math.random()*data.length)] 
}

export interface GeneratorState {
    width: number,
    height: number,
    colors: string[],
    hubs: HubType[][]
}