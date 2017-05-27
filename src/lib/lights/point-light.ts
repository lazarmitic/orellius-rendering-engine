import { Light } from "./abstract/light";
import { ShaderProgram } from "../shaders/shader-program"

import * as glm from "gl-matrix";

export class PointLight extends Light {

	private _position: glm.vec3;
	private _constant: number;
	private _linear: number;
	private _quadratic: number;
	private _ambientColor: glm.vec3;
	private _diffuseColor: glm.vec3;
	private _specularColor: glm.vec3;
	private _positionDirty: boolean;
	private _constantDirty: boolean;
	private _linearDirty: boolean;
	private _quadraticDirty: boolean;
	private _ambientColorDirty: boolean;
	private _diffuseColorDirty: boolean;
	private _specularColorDirty: boolean;

	constructor(position: glm.vec3, constant: number, linear: number, quadratic: number,
				ambientColor: glm.vec3, diffuseColor: glm.vec3, specularColor: glm.vec3) {

		super();

		this._position = position;
		this._constant = constant;
		this._linear = linear;
		this._quadratic = quadratic;
		this._ambientColor = ambientColor;
		this._diffuseColor = diffuseColor;
		this._specularColor = specularColor;
		this._positionDirty = true;
		this._constantDirty = true;
		this._linearDirty = true;
		this._quadraticDirty = true;
		this._ambientColorDirty = true;
		this._diffuseColorDirty = true;
		this._specularColorDirty = true;
	}

	uploadDataToGPU(program: ShaderProgram, lightIndex: number, forced: boolean) {

		if(this._positionDirty || forced) {

			program.setVector3Uniform(this._position, "pointLights[" + lightIndex + "].position");
			this._positionDirty = false;
		}
		if(this._constantDirty || forced) {

			program.setFloatUniform(this._constant, "pointLights[" + lightIndex + "].constant");
			this._constantDirty = false;
		}
		if(this._linearDirty || forced) {

			program.setFloatUniform(this._linear, "pointLights[" + lightIndex + "].linear");
			this._linearDirty = false;
		}
		if(this._quadraticDirty || forced) {

			program.setFloatUniform(this._quadratic, "pointLights[" + lightIndex + "].quadratic");
			this._quadraticDirty = false;
		}
		if(this._ambientColorDirty || forced) {

			program.setVector3Uniform(this._ambientColor, "pointLights[" + lightIndex + "].ambientColor");
			this._ambientColorDirty = false;
		}
		if(this._diffuseColorDirty || forced) {

			program.setVector3Uniform(this._diffuseColor, "pointLights[" + lightIndex + "].diffuseColor");
			this._diffuseColorDirty = false;
		}
		if(this._specularColorDirty || forced) {

			program.setVector3Uniform(this._specularColor, "pointLights[" + lightIndex + "].specularColor");
			this._specularColorDirty = false;
		}
	}
}
