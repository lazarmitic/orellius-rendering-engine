import { VertexShader } from "../../shaders/vertex-shader"
import { FragmentShader } from "../../shaders/fragment-shader"
import { ShaderProgram } from "../../shaders/shader-program"

export abstract class Material {

	protected _gl: WebGL2RenderingContext;
	protected _vertexShader: VertexShader;
	protected _frgmentShader: FragmentShader;
	protected _program: ShaderProgram;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;
	}

	makeActive() {

		this._gl.useProgram(this._program.getProgram());
	}
}
