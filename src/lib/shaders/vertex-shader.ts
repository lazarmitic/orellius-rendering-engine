import { Shader } from "./abstract/shader"

export class VertexShader extends Shader {

    constructor(sourceFileURL: string, gl: WebGLRenderingContext) {
        super(sourceFileURL, gl);
    }

    protected _compile() {

        this._shader = <WebGLShader>this._gl.createShader(this._gl.VERTEX_SHADER);
        this._gl.shaderSource(this._shader, this._shaderSource);
        this._gl.compileShader(this._shader);

        super._checkForCompileErrors();
    }

}