export class Vector3 {

    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x: number, y: number, z: number) {

        this._x = x;
        this._y = y;
        this._z = z;
    }

    public set(x: number, y: number, z: number) {

        this._x = x;
        this._y = y;
        this._z = z;
    } 
}