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

			sceneMeshes[i].sendGeometryToGPU();

			if(this._currentlyActiveMaterial === "" || sceneMeshes[i].material.uniqueMaterialName !== this._currentlyActiveMaterial) {

				sceneMeshes[i].material.makeActive();
				sceneMeshes[i].material.activateMaterialAttributes();
				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);

				this._currentlyActiveMaterial = sceneMeshes[i].material.uniqueMaterialName;
				camera.projectionMatrixDirty = false;
				camera.viewMatrixDirty = false;
			}

			if(camera.projectionMatrixDirty === true) {
				
				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				camera.projectionMatrixDirty = false;
			}

			if(camera.viewMatrixDirty === true) {

				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);
				camera.viewMatrixDirty = false;
			}

			sceneMeshes[i].material.setModelMatrix(sceneMeshes[i].modelMatrix);
			
			this._gl.drawArrays(this._gl.TRIANGLES, 0, sceneMeshes[i].geometry.vertices.length / 6);
		}
	}
}