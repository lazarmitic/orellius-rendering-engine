import { ShaderProgram } from "../shaders/shader-program"
import { Material } from "./material"
import { Color4 } from "../util/color4"
import { VertexShader } from "../shaders/vertex-shader"
import { FragmentShader } from "../shaders/fragment-shader"
import { Vector3 } from "../util/vector3"

export class PointMaterial extends Material {

	private _color: Color4;

	constructor(gl: WebGLRenderingContext) {
		super(gl);

		this._color = new Color4(0, 0, 0, 1);
		this._vertexShader = new VertexShader("./src/lib/shaders-source/point-material.vert", gl);
		this._frgmentShader = new FragmentShader("./src/lib/shaders-source/point-material.frag", gl);
		this._program = new ShaderProgram(this._vertexShader, this._frgmentShader, gl);
	}

	set color(color: Color4) {
		
		this._color = color;
	}

	public setPointPosition(vector3: Vector3) {

		this._program.setVector3Attribute(vector3, "a_Position");
	}

	public setPointSize(size: number) {

		this._program.setFloatAttribute(size, "a_Size");
	}

	public setPointColor() {

		this._program.setVector4Uniform(this._color, "u_PointColor");
	}
}