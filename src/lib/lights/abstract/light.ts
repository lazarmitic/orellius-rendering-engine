
import { ShaderProgram } from "../../shaders/shader-program"
import { DepthMaterial } from "../../materials/depth-material";

export abstract class Light {

	protected _depthMaterial: DepthMaterial;

	constructor(gl: WebGL2RenderingContext) {

		this._depthMaterial = new DepthMaterial(gl);
	}

	abstract uploadDataToGPU(program: ShaderProgram, lightIndex: number, forced: boolean): void;

	get depthMaterial(): DepthMaterial {
		return this._depthMaterial;
	}
}
