import { ShaderProgram } from "../shaders/shader-program"
import { Material } from "./abstract/material"
import { VertexShader } from "../shaders/vertex-shader"
import { FragmentShader } from "../shaders/fragment-shader"

import * as glm from "gl-matrix";

export class DepthMaterial extends Material {

	public uniqueMaterialName = "depth-material";

	private _fbo: WebGLFramebuffer | null;
	public _depthMap: WebGLTexture | null;
	public _lightProjectionMatrix: glm.mat4;
	public _lightViewMatrix: glm.mat4;

	constructor(gl: WebGL2RenderingContext) {
		super(gl);

		this._vertexShader = new VertexShader("./src/lib/shaders-source/depth-material.vert", gl);
		this._frgmentShader = new FragmentShader("./src/lib/shaders-source/depth-material.frag", gl);
		this._program = new ShaderProgram(this._vertexShader, this._frgmentShader, gl);

		this._initializeDepthMap();
		this._initializeFramebuffer();
		this._initializeLightView();
	}

	get program(): ShaderProgram {
		return this._program;
	}
	get fbo(): WebGLFramebuffer | null {
		return this._fbo;
	}

	private _initializeFramebuffer() {

		this._fbo = this._gl.createFramebuffer();

		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._fbo);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.TEXTURE_2D, this._depthMap, 0);
		this._gl.drawBuffers([]);
		this._gl.readBuffer(this._gl.NONE);
	}

	private _initializeDepthMap() {

		this._depthMap = this._gl.createTexture();

		this._gl.activeTexture(this._gl.TEXTURE4);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._depthMap);
		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.DEPTH_COMPONENT32F, 512, 512, 0, this._gl.DEPTH_COMPONENT, this._gl.FLOAT, null);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
	}

	private _initializeLightView() {

		this._lightProjectionMatrix = glm.mat4.create();
		this._lightProjectionMatrix = glm.mat4.ortho(this._lightProjectionMatrix, -20, 20, -20, 20, 1, 40);

		this._lightViewMatrix = glm.mat4.create();
		this._lightViewMatrix = glm.mat4.lookAt(this._lightViewMatrix, [6, 18, -17], [0, 0, 0], [0, 1, 0]);
	}

	public activateMaterialAttributes() {

		this._program.activateVertexAttribute(0, 3, 14 * 4, 0 * 4);
	}

	public setModelMatrix(matrix: glm.mat4) {

		this._program.setMatrix4Uniform(matrix, "u_ModelMatrix");
	}

	public setViewMatrix() {

		this._program.setMatrix4Uniform(this._lightViewMatrix, "u_ViewMatrix");
	}

	public setProjectionMatrix() {

		this._program.setMatrix4Uniform(this._lightProjectionMatrix, "u_ProjectionMatrix");
	}
}
