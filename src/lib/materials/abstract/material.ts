import { VertexShader } from "../../shaders/vertex-shader"
import { FragmentShader } from "../../shaders/fragment-shader"
import { ShaderProgram } from "../../shaders/shader-program"

import * as glm from "gl-matrix";

export abstract class Material {

	protected _gl: WebGL2RenderingContext;
	protected _vertexShader: VertexShader;
	protected _frgmentShader: FragmentShader;
	protected _program: ShaderProgram;

	public _lightProjectionMatrix: glm.mat4;
	public _lightViewMatrix: glm.mat4;
	public _depthMap: WebGLTexture | null;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;
	}

	makeActive() {

		this._gl.useProgram(this._program.getProgram());
	}
}
