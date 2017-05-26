import { Light } from "./abstract/light";
import { ShaderProgram } from "../shaders/shader-program"

import * as glm from "gl-matrix";

export class DirectionalLight extends Light {

	private _directionVector: glm.vec3;
	private _ambientColor: glm.vec3;
	private _diffuseColor: glm.vec3;
	private _specularColor: glm.vec3;
	private _directionVectorDirty: boolean;
	private _ambientColorDirty: boolean;
	private _diffuseColorDirty: boolean;
	private _specularColorDirty: boolean;

	constructor(directionVector: glm.vec3, ambientColor: glm.vec3, diffuseColor: glm.vec3, specularColor: glm.vec3) {

		super();

		this._directionVector = directionVector;
		this._ambientColor = ambientColor;
		this._diffuseColor = diffuseColor;
		this._specularColor = specularColor;
		this._directionVectorDirty = true;
		this._ambientColorDirty = true;
		this._diffuseColorDirty = true;
		this._specularColorDirty = true;
	}

	uploadDataToGPU(program: ShaderProgram, lightIndex: number, forced: boolean) {

		if(this._directionVectorDirty || forced) {

			program.setVector3Uniform(this._directionVector, "directionalLights[" + lightIndex + "].directionVector");
			this._directionVectorDirty = false;
		}
		if(this._ambientColorDirty || forced) {

			program.setVector3Uniform(this._ambientColor, "directionalLights[" + lightIndex + "].ambientColor");
			this._ambientColorDirty = false;
		}
		if(this._diffuseColorDirty || forced) {

			program.setVector3Uniform(this._diffuseColor, "directionalLights[" + lightIndex + "].diffuseColor");
			this._diffuseColorDirty = false;
		}
		if(this._specularColorDirty || forced) {

			program.setVector3Uniform(this._specularColor, "directionalLights[" + lightIndex + "].specularColor");
			this._specularColorDirty = false;
		}
	}
}
