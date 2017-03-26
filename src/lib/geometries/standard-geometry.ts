export class StandardGeometry {

	_vertices: Float32Array;

	constructor() {

		this._vertices = new Float32Array([
			0, 0.5, 0.0, 1.0, 0.0, 0.0,
			-0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
			0.5, -0.5, 0.0, 0.0, 0.0, 1.0
		]);
	}

	get vertices(): Float32Array {
		return this._vertices;
	}
}