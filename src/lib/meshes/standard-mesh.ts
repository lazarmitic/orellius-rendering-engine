import { Mesh } from "./abstract/mesh"
import { StandardMaterial } from "../materials/standard-material"
import { StandardGeometry } from "../geometries/standard-geometry"

import * as glm from "gl-matrix";

export class StandardMesh extends Mesh {

	private _position: glm.vec3;
	private _material: StandardMaterial;
	private _geometry: StandardGeometry;
	private _vbo: WebGLBuffer | null;
	private _ebo: WebGLBuffer | null;
	private _modelMatrix: glm.mat4;

	constructor(gl: WebGL2RenderingContext, material: StandardMaterial, geometry: StandardGeometry) {
		super(gl);

		this._material = material;
		this._geometry = geometry;

		this._position = glm.vec3.create();
		glm.vec3.set(this._position, 0, 0, 0);
		this._modelMatrix = glm.mat4.create();

		this._vbo = this._gl.createBuffer();
		this._ebo = this._gl.createBuffer();

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, this._geometry.vertices, this._gl.STATIC_DRAW);

		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._ebo);
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, this._geometry.indices, this._gl.STATIC_DRAW);
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

		glm.vec3.set(this._position, x, y, z);

		glm.mat4.identity(this._modelMatrix);
		glm.mat4.translate(this._modelMatrix, this._modelMatrix, [this._position[0], this._position[1], this._position[2]]);
	}

	public bindGeometry() {

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._ebo);
	}
}