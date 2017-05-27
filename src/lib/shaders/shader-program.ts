import { VertexShader } from "./vertex-shader"
import { FragmentShader } from "./fragment-shader"

import * as glm from "gl-matrix"

export class ShaderProgram {

	private _program: WebGLProgram;
	private _gl: WebGL2RenderingContext;
	private _vertexShader: VertexShader;
	private _fragmentShader: FragmentShader;

	constructor(vertexShader: VertexShader, fragmentShader: FragmentShader, gl: WebGL2RenderingContext) {

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

		this._gl.deleteShader(this._vertexShader.getShader());
		this._gl.deleteShader(this._fragmentShader.getShader());
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

	public bindTextureUnitToSampler(samplerName: string, textureUnit: number) {

		let samplerPosition = this.getUniformLocation(samplerName);

		this._gl.uniform1i(samplerPosition, textureUnit);
	}

	public activateVertexAttribute(attributePosition: number, size: number, stride: number, offset: number) {

		this._gl.vertexAttribPointer(attributePosition, size, this._gl.FLOAT, false, stride, offset);
		this._gl.enableVertexAttribArray(attributePosition);
	}

	public setVector3Attribute(value: glm.vec3, attributeName: string) {

		this._gl.vertexAttrib3f(this.getAttributeLocation(attributeName), value[0], value[1], value[2]);
	}

	public setFloatAttribute(value: number, attributeName: string) {

		this._gl.vertexAttrib1f(this.getAttributeLocation(attributeName), value);
	}

	public setIntUniform(value: number, uniformName: string) {

		this._gl.uniform1i(this.getUniformLocation(uniformName), value);
	}

	public setFloatUniform(value: number, uniformName: string) {

		this._gl.uniform1f(this.getUniformLocation(uniformName), value);
	}

	public setMatrix4Uniform(matrix: glm.mat4, uniformName: string) {

		this._gl.uniformMatrix4fv(<WebGLUniformLocation>this.getUniformLocation(uniformName), false, matrix);
	}

	public setVector4Uniform(value: glm.vec4, uniformName: string) {

		this._gl.uniform4f(this.getUniformLocation(uniformName), value[0], value[1], value[2], value[3]);
	}

	public setVector3Uniform(value: glm.vec3, uniformName: string) {

		this._gl.uniform3f(this.getUniformLocation(uniformName), value[0], value[1], value[2]);
	}

	public getAttributeLocation(attribute: string) {

		return this._gl.getAttribLocation(this._program, attribute);
	}

	public getUniformLocation(uniform: string) {

		return this._gl.getUniformLocation(this._program, uniform);
	}
}