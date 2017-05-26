export class StandardTexture {

	private _gl: WebGL2RenderingContext;
	private _texture: WebGLTexture | null;

	constructor(gl: WebGL2RenderingContext) {

		this._gl = gl;

		this._texture = this._gl.createTexture();
	}

	get texture(): WebGLTexture | null {
		return this._texture;
	}
}