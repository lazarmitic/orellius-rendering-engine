import { Mesh } from "./abstract/mesh"
import { Vector3 } from "../util/vector3"
import { StandardMaterial } from "../materials/standard-material"
import { StandardGeometry } from "../geometries/standard-geometry"

import * as glm from "gl-matrix";

export class StandardMesh extends Mesh {

	private _position: Vector3;
	private _material: StandardMaterial;
	private _geometry: StandardGeometry;
	private _vbo: WebGLBuffer | null;
	private _ebo: WebGLBuffer | null;
	private _modelMatrix: glm.mat4;

	constructor(gl: WebGLRenderingContext, material: StandardMaterial, geometry: StandardGeometry) {
		super(gl);

		this._material = material;
		this._geometry = geometry;

		this._position = new Vector3(0, 0, 0);
		this._modelMatrix = glm.mat4.create();

		this._vbo = this._gl.createBuffer();
		this._ebo = this._gl.createBuffer();
	}

	get material(): StandardMaterial {
		return this._material;
	}
	get modelMatrix(): glm.mat4 {
		return this._modelMatrix;
	}
	get geometry(): StandardGeometry {
		return this._geometry;
	}

	public setPosition(x: number, y: number, z: number) {

		this._position.set(x, y, z);

		glm.mat4.identity(this._modelMatrix);
		glm.mat4.translate(this._modelMatrix, this._modelMatrix, [this._position.x, this._position.y, this._position.z]);
	}

	public sendGeometryToGPU() {

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, this._geometry.vertices, this._gl.STATIC_DRAW);

		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._ebo);
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._geometry.indices, this._gl.STATIC_DRAW);
	}
}