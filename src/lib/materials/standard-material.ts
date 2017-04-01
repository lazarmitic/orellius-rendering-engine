import { ShaderProgram } from "../shaders/shader-program"
import { Material } from "./abstract/material"
import { VertexShader } from "../shaders/vertex-shader"
import { FragmentShader } from "../shaders/fragment-shader"
import { StandardTexture } from "../textures/standard-texture";

import * as glm from "gl-matrix";

export class StandardMaterial extends Material {

	public uniqueMaterialName = "standard-material";
	public image: HTMLImageElement;
	public texture: StandardTexture;

	constructor(gl: WebGLRenderingContext) {
		super(gl);

		this._vertexShader = new VertexShader("./src/lib/shaders-source/standard-material.vert", gl);
		this._frgmentShader = new FragmentShader("./src/lib/shaders-source/standard-material.frag", gl);
		this._program = new ShaderProgram(this._vertexShader, this._frgmentShader, gl);
	}

	public bindTexture() {

		this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this.texture.texture);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, this._gl.RGB, this._gl.UNSIGNED_BYTE, this.image);

		this.bindTexturesToSampler();
	}

	public activateMaterialAttributes() {

		this._program.activateVertexAttribute(0, 3, 5 * 4, 0 * 4);
		this._program.activateVertexAttribute(1, 2, 5 * 4, 3 * 4);
	}

	public bindTexturesToSampler() {

		this._program.bindTextureUnitToSampler("u_DiffuseTexture", 0);
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
