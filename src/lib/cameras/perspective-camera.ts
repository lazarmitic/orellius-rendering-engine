import * as glm from "gl-matrix";

export class PerspectiveCamera {

	private _projectionMatrixDirty: boolean;
	private _viewMatrix: glm.mat4;
	private _projectionMatrix: glm.mat4;
	private _position: glm.vec3;

	constructor(aspect: number) {

		this._projectionMatrixDirty = true;

		this._viewMatrix = glm.mat4.create();
		glm.mat4.identity(this._viewMatrix);
		glm.mat4.lookAt(this._viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

		this._projectionMatrix = glm.mat4.create();
		glm.mat4.perspective(this._projectionMatrix, 45, aspect, 0.1, 1000.0);

		this._position = glm.vec3.create();
		glm.vec3.set(this._position, 0, 0, 0);
	}

	get projectionMatrix(): glm.mat4 {
		return this._projectionMatrix;
	}

	get projectionMatrixDirty(): boolean {
		return this._projectionMatrixDirty;
	}
	set projectionMatrixDirty(projectionMatrixDirty: boolean) {
		this._projectionMatrixDirty = projectionMatrixDirty;
	}

	get viewMatrix(): glm.mat4 {
		return this._viewMatrix;
	}
}