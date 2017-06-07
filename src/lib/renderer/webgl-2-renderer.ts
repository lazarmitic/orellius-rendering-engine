import { Scene } from "../scene/scene";
import { OrbitCamera } from "../cameras/orbit-camera";
import { Light } from "../lights/abstract/light";

import * as glm from "gl-matrix";

export class WebGL2Renderer {

	private _canvas: HTMLCanvasElement;
	private _gl: WebGL2RenderingContext;
	private _currentlyActiveMaterial: string;

	constructor(canvas: HTMLCanvasElement) {

		this._canvas = canvas;
		this._currentlyActiveMaterial = "";

		this._initializeWebGLContext();
	}

	private _initializeWebGLContext(): void {

		this._gl = <WebGL2RenderingContext>this._canvas.getContext("webgl2");

		this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, 1);
		this._gl.enable(this._gl.DEPTH_TEST);
		this._gl.enable(this._gl.CULL_FACE);
		this._gl.depthFunc(this._gl.LEQUAL);
		this._gl.depthMask(true);
		this._gl.clearDepth(1.0);
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

	public getContext(): WebGL2RenderingContext {

		return this._gl;
	}

	public renderDirectionalShadowMap(scene: Scene, light: Light) {

		light.depthMaterial.makeActive();
		this._gl.viewport(0, 0, 512, 512);
		light.depthMaterial.activateMaterialAttributes();
		light.depthMaterial.setViewMatrix();
		light.depthMaterial.setProjectionMatrix();

		this._gl.cullFace(this._gl.BACK)
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, light.depthMaterial.fbo);
		this._gl.clear(this._gl.DEPTH_BUFFER_BIT);

		let sceneMeshes = scene.meshes;
		for(let i = 0; i < sceneMeshes.length; i++) {

			sceneMeshes[i].bindGeometry();
			light.depthMaterial.setModelMatrix(sceneMeshes[i].modelMatrix);

			this._gl.drawElements(this._gl.TRIANGLES, sceneMeshes[i].geometry.indices.length, this._gl.UNSIGNED_SHORT, 0);
		}

		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
		this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
		this._gl.cullFace(this._gl.BACK)
	}

	public render(scene: Scene, camera: OrbitCamera) {

		let sceneMeshes = scene.meshes;
		let directionalLights = scene.directionalLights;
		let pointLights = scene.pointLights;
		let spotLights = scene.spotLights;

		for(let i = 0; i < directionalLights.length; i++) {

			this.renderDirectionalShadowMap(scene, directionalLights[i]);

			this._currentlyActiveMaterial = "depth-material";
		}

		for(let i = 0; i < sceneMeshes.length; i++) {

			if(this._currentlyActiveMaterial === "" || sceneMeshes[i].material.uniqueMaterialName !== this._currentlyActiveMaterial) {

				sceneMeshes[i].material.makeActive();
				sceneMeshes[i].material.activateMaterialAttributes();

				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);

				sceneMeshes[i].material.program.setIntUniform(directionalLights.length, "numberOfActiveDirectionalLights");
				for(let k = 0; k < directionalLights.length; k++) {

					directionalLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, true);
				}
				sceneMeshes[i].material.program.setIntUniform(pointLights.length, "numberOfActivePointLights");
				for(let k = 0; k < pointLights.length; k++) {

					pointLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, true);
				}
				sceneMeshes[i].material.program.setIntUniform(spotLights.length, "numberOfActiveSpotLights");
				for(let k = 0; k < spotLights.length; k++) {

					spotLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, true);
				}

				sceneMeshes[i].material.program.setMatrix4Uniform(directionalLights[0].depthMaterial._lightViewMatrix, "u_LightProjectionMatrix");
				sceneMeshes[i].material.program.setMatrix4Uniform(directionalLights[0].depthMaterial._lightProjectionMatrix, "u_LightViewMatrix");

				this._gl.activeTexture(this._gl.TEXTURE4);
				this._gl.bindTexture(this._gl.TEXTURE_2D, directionalLights[0].depthMaterial._depthMap);
				sceneMeshes[i].material.program.bindTextureUnitToSampler("u_shadowMap", 4);

				sceneMeshes[i].material.setViewPosition(camera.position);

				this._currentlyActiveMaterial = sceneMeshes[i].material.uniqueMaterialName;
				camera.projectionMatrixDirty = false;
				camera.viewMatrixDirty = false;
			}

			sceneMeshes[i].material.program.setIntUniform(directionalLights.length, "numberOfActiveDirectionalLights");
			for(let k = 0; k < directionalLights.length; k++) {

				directionalLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, false);
			}
			sceneMeshes[i].material.program.setIntUniform(pointLights.length, "numberOfActivePointLights");
			for(let k = 0; k < pointLights.length; k++) {

				pointLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, false);
			}
			sceneMeshes[i].material.program.setIntUniform(spotLights.length, "numberOfActiveSpotLights");
			for(let k = 0; k < spotLights.length; k++) {

				spotLights[k].uploadDataToGPU(sceneMeshes[i].material.program, k, true);
			}

			sceneMeshes[i].bindGeometry();
			sceneMeshes[i].material.bindTextures();

			if(camera.projectionMatrixDirty === true) {
				
				sceneMeshes[i].material.setProjectionMatrix(camera.projectionMatrix);
				camera.projectionMatrixDirty = false;
			}

			if(camera.viewMatrixDirty === true) {

				sceneMeshes[i].material.setViewMatrix(camera.viewMatrix);
				sceneMeshes[i].material.setViewPosition(camera.position);
				camera.viewMatrixDirty = false;
			}

			sceneMeshes[i].modelMatrix = glm.mat4.rotate(sceneMeshes[i].modelMatrix, sceneMeshes[i].modelMatrix, 0.001, [0, 1, 0]);

			sceneMeshes[i].material.setModelMatrix(sceneMeshes[i].modelMatrix);
			
			this._gl.drawElements(this._gl.TRIANGLES, sceneMeshes[i].geometry.indices.length, this._gl.UNSIGNED_SHORT, 0);
		}
	}
}