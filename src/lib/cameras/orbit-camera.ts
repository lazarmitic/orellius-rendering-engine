import * as glm from "gl-matrix";

export class OrbitCamera {

	private _prevFrameXMousePos: number;
	private _prevFrameYMousePos: number;
	private _rotate: boolean;
	private _theta: number;
	private _phi: number;
	private _canvas: HTMLCanvasElement;
	private _target: glm.vec3;
	private _projectionMatrixDirty: boolean;
	private _viewMatrixDirty: boolean;
	private _viewMatrix: glm.mat4;
	private _projectionMatrix: glm.mat4;
	private _position: glm.vec3;
	private _radius: number;

	constructor(target: glm.vec3, radius: number, theta: number, phi: number, canvas: HTMLCanvasElement) {

		this._prevFrameXMousePos = 0;
		this._prevFrameYMousePos = 0;
		this._rotate = false;
		this._theta = theta;
		this._phi = phi;
		this._canvas = canvas;
		this._target = target;
		this._projectionMatrixDirty = true;
		this._viewMatrixDirty = true;
		this._radius = radius;

		this._position = glm.vec3.create();
		glm.vec3.set(this._position, this._target[0] + this._radius * Math.cos(this._phi) * Math.sin(this._theta),
							this._target[1] + this._radius * Math.sin(this._phi) * Math.sin(this._theta),
							this._target[2] + this._radius * Math.cos(this._theta));

		this._viewMatrix = glm.mat4.create();
		glm.mat4.identity(this._viewMatrix);
		glm.mat4.lookAt(this._viewMatrix, this._position, this._target, [0, 1, 0]);

		this._projectionMatrix = glm.mat4.create();
		glm.mat4.perspective(this._projectionMatrix, 45, this._canvas.width / this._canvas.height, 0.1, 1000.0);

		this._canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
		this._canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
		this._canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
		this._canvas.addEventListener("mousewheel", this._onMouseWheel.bind(this));
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

	get viewMatrixDirty(): boolean {
		return this._viewMatrixDirty;
	}
	set viewMatrixDirty(viewMatrixDirty: boolean) {
		this._viewMatrixDirty = viewMatrixDirty;
	}

	private _onMouseUp(event: MouseEvent) {

		if(event.buttons === 1) {

			this._rotate = false;
		}
	}

	private _onMouseDown(event: MouseEvent) {

		if(event.buttons === 1) {

			this._prevFrameXMousePos = event.clientX;
			this._prevFrameYMousePos = event.clientY;
			this._rotate = true;
		}
	}

	private _onMouseMove(event: MouseEvent) {

		if(event.buttons === 1 && this._rotate === true) {

			this._theta += (event.clientX - this._prevFrameXMousePos) * 0.1;
			this._phi += -(event.clientY - this._prevFrameYMousePos) * 0.1;

			if(this._phi < -85) this._phi = -85;
			if(this._phi > 85) this._phi = 85;

			glm.vec3.set(this._position, this._radius * -Math.sin(this._theta * (Math.PI / 180)) * Math.cos((this._phi) * (Math.PI / 180)),
							this._radius * -Math.sin((this._phi) * (Math.PI / 180)),
							-this._radius * -Math.cos((this._theta) * (Math.PI / 180)) * Math.cos((this._phi) * (Math.PI / 180)));

			glm.mat4.identity(this._viewMatrix);
			glm.mat4.lookAt(this._viewMatrix, this._position, this._target, [0, 1, 0]);

			this._viewMatrixDirty = true;
		}

		this._prevFrameXMousePos = event.clientX;
		this._prevFrameYMousePos = event.clientY;
	}

	private _onMouseWheel(event: MouseWheelEvent) {

		if (event.deltaY < 0) {

			this._radius -= 1;
		}
		if (event.deltaY > 0) {

			this._radius += 1;
		}

		glm.vec3.set(this._position, this._radius * -Math.sin(this._theta * (Math.PI / 180)) * Math.cos((this._phi) * (Math.PI / 180)),
							this._radius * -Math.sin((this._phi) * (Math.PI / 180)),
							-this._radius * -Math.cos((this._theta) * (Math.PI / 180)) * Math.cos((this._phi) * (Math.PI / 180)));

		glm.mat4.identity(this._viewMatrix);
		glm.mat4.lookAt(this._viewMatrix, this._position, this._target, [0, 1, 0]);

		this._viewMatrixDirty = true;
	}
}