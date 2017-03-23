import { PerspectiveCamera } from "./../../cameras/perspective-camera"

export abstract class Mesh {

    protected _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {

        this._gl = gl;
    }

    public abstract render(gl: WebGLRenderingContext, camera: PerspectiveCamera): void;
} 