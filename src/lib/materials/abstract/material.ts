import { VertexShader } from "../../shaders/vertex-shader"
import { FragmentShader } from "../../shaders/fragment-shader"
import { ShaderProgram } from "../../shaders/shader-program"

export abstract class Material {

	protected _gl: WebGLRenderingContext;
	protected _vertexShader: VertexShader;
	protected _frgmentShader: FragmentShader;
	protected _program: ShaderProgram;

	constructor(gl: WebGLRenderingContext) {

		this._gl = gl;
	}

	makeActive() {

		this._gl.useProgram(this._program.getProgram());
	}
}
