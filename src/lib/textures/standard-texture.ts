export class StandardTexture {

	private _gl: WebGLRenderingContext;
	private _texture: WebGLTexture | null;

	constructor(gl: WebGLRenderingContext) {

		this._gl = gl;

		this._texture = this._gl.createTexture();
	}

	get texture(): WebGLTexture | null {
		return this._texture;
	}
}