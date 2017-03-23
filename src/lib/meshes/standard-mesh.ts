import { Mesh } from "./abstract/mesh"
import { Vector3 } from "../util/vector3"
import { StandardMaterial } from "../materials/standard-material"

import * as glm from "gl-matrix";

export class StandardMesh extends Mesh {

	private _position: Vector3;
	private _material: StandardMaterial;
	private _vertices: Float32Array;
	private _vbo: WebGLBuffer | null;
	private _modelMatrix: glm.mat4;

	constructor(gl: WebGLRenderingContext) {
		super(gl);

		this._position = new Vector3(0, 0, 0);
		this._vertices = new Float32Array([
			0, 0.5, 0.0,
			-0.5, -0.5, 0.0,
			0.5, -0.5, 0.0
		]);
		this._modelMatrix = glm.mat4.create();

		glm.mat4.identity(this._modelMatrix);
		glm.mat4.translate(this._modelMatrix, this._modelMatrix, [this._position.x, this._position.y, this._position.z]);
		glm.mat4.scale(this._modelMatrix, this._modelMatrix, [1, 1, 1]);

		this._vbo = this._gl.createBuffer();

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertices, this._gl.STATIC_DRAW);
	}

	public setPosition(x: number, y: number, z: number) {

		this._position.set(x, y, z);
	}

	public setMaterial(material: StandardMaterial) {

		this._material = material;
	}

	public render(gl: WebGLRenderingContext) {

		this._material.makeActive();
		this._material.setPointPosition();
		this._material.setModelMatrix(this._modelMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, this._vertices.length / 3);
	}
}