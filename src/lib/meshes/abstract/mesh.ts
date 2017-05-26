export abstract class Mesh {

	protected _gl: WebGL2RenderingContext;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;
	}
}
