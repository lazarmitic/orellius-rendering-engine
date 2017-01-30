class WebGLRenderer {

    private _canvas: HTMLCanvasElement;
    private _gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement) {

        this._canvas = canvas;

        this._initializeWebGLContext();
    }

    private _initializeWebGLContext(): void {

        this._gl = <WebGLRenderingContext>this._canvas.getContext("webgl");
    }

    public setClearColor(r: number, g: number, b: number, a: number): void {

        this._gl.clearColor(r, g, b, a);
    }

    public clearColor(): void {

        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    public getContext(): WebGLRenderingContext {

        return this._gl;
    }

    public render(scene: Scene) {

        let sceneMeshes = scene.getMeshes();
        for(let i = 0; i < sceneMeshes.length; i++) {

            sceneMeshes[i].render(this._gl);
        }
    }
}

class ShaderProgram {

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

abstract class Shader {

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

class VertexShader extends Shader {

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

class FragmentShader extends Shader {

    constructor(sourceFileURL: string, gl: WebGLRenderingContext) {
        super(sourceFileURL, gl);
    }

    protected _compile() {

        this._shader = <WebGLShader>this._gl.createShader(this._gl.FRAGMENT_SHADER);
        this._gl.shaderSource(this._shader, this._shaderSource);
        this._gl.compileShader(this._shader);

        super._checkForCompileErrors();
    }
}

abstract class Mesh {

    constructor() {

    }

    public abstract render(gl: WebGLRenderingContext): void;
} 

class Vector3 {

    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x: number, y: number, z: number) {

        this._x = x;
        this._y = y;
        this._z = z;
    }

    public set(x: number, y: number, z: number) {

        this._x = x;
        this._y = y;
        this._z = z;
    } 
}

class Color4 {

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    constructor(r: number, g: number, b: number, a:number) {

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public set(r: number, g: number, b: number, a:number) {

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }
}

class PointMesh extends Mesh {

    private _position: Vector3; 
    private _material: PointMaterial;

    constructor() {
        super();

        this._position = new Vector3(0, 0, 0);
    }

    public setPosition(x: number, y: number, z: number) {

        this._position.set(x, y, z);
    }

    public setMaterial(material: PointMaterial) {

        this._material = material;
    }

    public render(gl: WebGLRenderingContext) {

        this._material.makeActive();
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

abstract class Material {

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

class PointMaterial extends Material {

    private _color: Color4;
    

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        this._color = new Color4(0, 0, 0, 1);
        this._vertexShader = new VertexShader("./src/lib/shaders/point-material.vert", gl);
        this._frgmentShader = new FragmentShader("./src/lib/shaders/point-material.frag", gl);
        this._program = new ShaderProgram(this._vertexShader, this._frgmentShader, gl);
    }

    public setColor(r: number, g: number, b: number, a:number) {

        this._color.set(r, g, b, a);
    }
}

class Scene {

    private _objects: Mesh[];

    constructor() {

        this._objects = [];
    }

    public add(mesh: Mesh) {

        this._objects.push(mesh);
    }

    public getMeshes() {

        return this._objects;
    }
}

function main(): void {

    let canvas = <HTMLCanvasElement>document.getElementById("webgl-canvas");

    let webGLRenderer = new WebGLRenderer(canvas);
    webGLRenderer.setClearColor(0.39, 0.58, 0.93, 1);
    
    let pointMaterial = new PointMaterial(webGLRenderer.getContext());
    pointMaterial.setColor(1, 0, 0, 1);

    let pointMesh = new PointMesh();
    pointMesh.setPosition(0, 0, 0);
    pointMesh.setMaterial(pointMaterial);

    let scene = new Scene();
    scene.add(pointMesh);

    let render = function() {

        webGLRenderer.clearColor();
        webGLRenderer.render(scene);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// page 30;