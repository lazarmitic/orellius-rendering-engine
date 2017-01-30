import { Mesh } from "./mesh"
import { Vector3 } from "../util/vector3"
import { PointMaterial } from "../materials/point-material"

export class PointMesh extends Mesh {

    private _position: Vector3; 
    private _material: PointMaterial;

    constructor() {
        super();

        this._position = new Vector3(0, 0, 0);
    }

    public setPosition(x: number, y: number, z: number) {

        this._position.set(x, y, z);
    }

    public setMaterial(material: PointMaterial) {

        this._material = material;
    }

    public render(gl: WebGLRenderingContext) {

        this._material.makeActive();
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}