import { Scene } from "../scene/scene";
import { OrbitCamera } from "../cameras/orbit-camera";

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

		this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, 1);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.depthFunc(this._gl.LESS);
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

	public render(scene: Scene, camera: OrbitCamera) {

		let sceneMeshes = scene.getMeshes();
		for(let i = 0; i < sceneMeshes.length; i++) {

			if(this._currentlyActiveMaterial === "" || sceneMeshes[i].material.uniqueMaterialName !== this._currentlyActiveMaterial) {

				sceneMeshes[i].material.makeActive();
				sceneMeshes[i].material.activateMaterialAttributes();
				
				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);

				this._currentlyActiveMaterial = sceneMeshes[i].material.uniqueMaterialName;
				camera.projectionMatrixDirty = false;
				camera.viewMatrixDirty = false;
			}

			sceneMeshes[i].bindGeometry();
			sceneMeshes[i].material.bindTexture();

			if(camera.projectionMatrixDirty === true) {
				
				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				camera.projectionMatrixDirty = false;
			}

			if(camera.viewMatrixDirty === true) {

				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);
				camera.viewMatrixDirty = false;
			}

			sceneMeshes[i].material.setModelMatrix(sceneMeshes[i].modelMatrix);
			
			this._gl.drawElements(this._gl.TRIANGLES, sceneMeshes[i].geometry.indices.length, this._gl.UNSIGNED_SHORT, 0);
			//this._gl.drawArrays(this._gl.TRIANGLES, 0, sceneMeshes[i].geometry.vertices.length / 5);
		}
	}
}