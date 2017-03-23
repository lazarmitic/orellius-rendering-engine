import { VertexShader } from "./vertex-shader"
import { FragmentShader } from "./fragment-shader"
import { Vector3 } from "../util/vector3"
import { Color4 } from "../util/color4"

import * as glm from "gl-matrix"

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

	public setVertexAttribute(attributeName: string) {

		this._gl.vertexAttribPointer(this.getAttributeLocation(attributeName), 2, this._gl.FLOAT, false, 0, 0);
		this._gl.enableVertexAttribArray(this.getAttributeLocation(attributeName));
	}

	public setVector3Attribute(value: Vector3, attributeName: string) {

		this._gl.vertexAttrib3f(this.getAttributeLocation(attributeName), value.x, value.y, value.z);
	}

	public setFloatAttribute(value: number, attributeName: string) {

		this._gl.vertexAttrib1f(this.getAttributeLocation(attributeName), value);
	}

	public setMatrix4Uniform(matrix: glm.mat4, uniformName: string) {

		this._gl.uniformMatrix4fv(<WebGLUniformLocation>this.getUniformLocation(uniformName), false, matrix);
	}

	public setVector4Uniform(value: Color4, uniformName: string) {

		this._gl.uniform4f(this.getUniformLocation(uniformName), value.r, value.g, value.b, value.a);
	}

	public getAttributeLocation(attribute: string) {

		return this._gl.getAttribLocation(this._program, attribute);
	}

	public getUniformLocation(uniform: string) {

		return this._gl.getUniformLocation(this._program, uniform);
	}
}