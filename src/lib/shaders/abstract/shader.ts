export abstract class Shader {

    protected _sourceFileURL: string;
    protected _shaderSource: string;
    protected _shader: WebGLShader;
    protected _xmlHttpRequest: XMLHttpRequest;
    protected _gl: WebGLRenderingContext;

    constructor(sourceFileURL: string, gl: WebGLRenderingContext) {

        this._sourceFileURL = sourceFileURL;
        this._gl = gl;

        this._loadFromURL();
        this._compile();
    }

    private _loadFromURL() {

        this._xmlHttpRequest = new XMLHttpRequest();
        this._xmlHttpRequest.onreadystatechange = () => {

            if(this._xmlHttpRequest.readyState === 4 && this._xmlHttpRequest.status !== 404) {
                this._shaderSource = this._xmlHttpRequest.responseText;
            }   
        }
        this._xmlHttpRequest.open("GET", this._sourceFileURL, false);
        this._xmlHttpRequest.send();
    }

    protected abstract _compile(): void;

    protected _checkForCompileErrors() {

        let compiled = this._gl.getShaderParameter(this._shader, this._gl.COMPILE_STATUS);
        if(!compiled) {
            var error = this._gl.getShaderInfoLog(this._shader);
            console.error("Failed to compile shader: " + error);
            this._gl.deleteShader(this._shader);
        }
    }

    public getShader() {

        return this._shader;
    }
}