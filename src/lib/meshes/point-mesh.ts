import { Mesh } from "./abstract/mesh"
import { Vector3 } from "../util/vector3"
import { PointMaterial } from "../materials/point-material"

export class PointMesh extends Mesh {

	private _position: Vector3;
	private _material: PointMaterial;
	private _size: number;

	constructor(gl: WebGLRenderingContext) {
		super(gl);

		this._position = new Vector3(0, 0, 0);
		this._size = 10;
	}

	public setPosition(x: number, y: number, z: number) {

		this._position.set(x, y, z);
	}

	public setMaterial(material: PointMaterial) {

		this._material = material;
	}

	public setSize(size: number) {

		this._size = size;
	}

	public render(gl: WebGLRenderingContext) {

		this._material.makeActive();
		this._material.setPointPosition(this._position);
		this._material.setPointSize(this._size);
		this._material.setPointColor();
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}