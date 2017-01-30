export class Color4 {

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    constructor(r: number, g: number, b: number, a:number) {

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public set(r: number, g: number, b: number, a:number) {

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }
}