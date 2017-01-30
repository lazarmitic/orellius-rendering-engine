import { VertexShader } from "./vertex-shader"
import { FragmentShader } from "./fragment-shader"

export class ShaderProgram {

    private _program: WebGLProgram;
    private _gl: WebGLRenderingContext;
    private _vertexShader: VertexShader;
    private _fragmentShader: FragmentShader;

    constructor(vertexShader: VertexShader, fragmentShader: FragmentShader, gl: WebGLRenderingContext) {

        this._vertexShader = vertexShader;
        this._fragmentShader = fragmentShader;
        this._gl = gl;

        this._build();
    }

    private _build() {

        this._program = <WebGLProgram>this._gl.createProgram();

        this._gl.attachShader(this._program, this._vertexShader.getShader());
        this._gl.attachShader(this._program, this._fragmentShader.getShader());

        this._gl.linkProgram(this._program);
        this._checkForLinkErrors();
    }

    private _checkForLinkErrors() {

        let linked = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
        if(!linked) {
            let error = this._gl.getProgramInfoLog(this._program);
            console.error("Failed to link program: " + error);
            this._gl.deleteProgram(this._program);
            this._gl.deleteShader(this._vertexShader.getShader());
            this._gl.deleteShader(this._fragmentShader.getShader());
        }
    }

    public getProgram() {

        return this._program;
    }
}