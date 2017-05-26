
import { ShaderProgram } from "../../shaders/shader-program"

export abstract class Light {

	constructor() {

	}

	abstract uploadDataToGPU(program: ShaderProgram, lightIndex: number, forced: boolean): void;
}
