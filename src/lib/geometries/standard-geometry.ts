export class StandardGeometry {

	private _vertices: Float32Array;
	private _indices: Uint16Array;

	constructor() {

		this._vertices = new Float32Array([
			-0.5, 0.5, 0.0,	0.0, 1.0,
			0.5, 0.5, 0.0,	1.0, 1.0,
			0.5, -0.5, 0.0,	1.0, 0.0,
			-0.5, -0.5, 0.0,	0.0, 0.0
		]);

		this._indices = new Uint16Array([
			0, 3, 2,
			0, 2, 1
		]);
	}

	get vertices(): Float32Array {
		return this._vertices;
	}

	get indices(): Uint16Array {
		return this._indices;
	}
}