import { Scene } from "../scene/scene";
import { PerspectiveCamera } from "../cameras/perspective-camera";

export class WebGL2Renderer {

	private _canvas: HTMLCanvasElement;
	private _gl: WebGLRenderingContext;
	private _currentlyActiveMaterial: string;

	constructor(canvas: HTMLCanvasElement) {

		this._canvas = canvas;
		this._currentlyActiveMaterial = "";

		this._initializeWebGLContext();
	}

	private _initializeWebGLContext(): void {

		this._gl = <WebGLRenderingContext>this._canvas.getContext("webgl2");
	}

	public setClearColor(r: number, g: number, b: number, a: number): void {

		this._gl.clearColor(r, g, b, a);
	}

	public setViewport(x: number, y: number, width: number, height: number) {

		this._gl.viewport(x, y, width, height);
	}

	public clearColor(): void {

		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	public getContext(): WebGLRenderingContext {

		return this._gl;
	}

	public render(scene: Scene, camera: PerspectiveCamera) {

		let sceneMeshes = scene.getMeshes();
		for(let i = 0; i < sceneMeshes.length; i++) {

			if(this._currentlyActiveMaterial === "" || sceneMeshes[i].material.uniqueMaterialName !== this._currentlyActiveMaterial) {

				sceneMeshes[i].material.makeActive();
				this._currentlyActiveMaterial = sceneMeshes[i].material.uniqueMaterialName;

				console.log("New shader program bound: " + sceneMeshes[i].material.uniqueMaterialName);
			}

			
			sceneMeshes[i].material.setPointPosition();
			sceneMeshes[i].material.setModelMatrix(sceneMeshes[i].modelMatrix);
			sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
			sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);

			this._gl.drawArrays(this._gl.TRIANGLES, 0, sceneMeshes[i].geometry.vertices.length / 3);
		}
	}
}