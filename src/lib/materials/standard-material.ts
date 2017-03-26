import { ShaderProgram } from "../shaders/shader-program"
import { Material } from "./abstract/material"
import { Color4 } from "../util/color4"
import { VertexShader } from "../shaders/vertex-shader"
import { FragmentShader } from "../shaders/fragment-shader"

import * as glm from "gl-matrix";

export class StandardMaterial extends Material {

	public uniqueMaterialName = "standard-material";

	private _color: Color4;

	constructor(gl: WebGLRenderingContext) {
		super(gl);

		this._color = new Color4(0, 0, 0, 1);
		this._vertexShader = new VertexShader("./src/lib/shaders-source/standard-material.vert", gl);
		this._frgmentShader = new FragmentShader("./src/lib/shaders-source/standard-material.frag", gl);
		this._program = new ShaderProgram(this._vertexShader, this._frgmentShader, gl);
	}

	set color(color: Color4) {
		
		this._color = color;
	}

	public activateMaterialAttributes() {

		this._program.activateVertexAttribute("a_Position", 3, 6 * 4, 0 * 4);
		this._program.activateVertexAttribute("a_Color", 3, 6 * 4, 3 * 4);
	}

	public setModelMatrix(matrix: glm.mat4) {

		this._program.setMatrix4Uniform(matrix, "u_ModelMatrix");
	}

	public setProjectionMatrix(matrix: glm.mat4) {

		this._program.setMatrix4Uniform(matrix, "u_ProjectionMatrix");
	}

	public setViewMatrix(matrix: glm.mat4) {

		this._program.setMatrix4Uniform(matrix, "u_ViewMatrix");
	}
}
