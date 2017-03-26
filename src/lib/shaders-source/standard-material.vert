precision highp float;

attribute vec3 a_Position;
attribute vec3 a_Color;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;

varying vec3 v_Color;

void main() {

	gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position.x, a_Position.y, a_Position.z, 1);
	v_Color = a_Color;
}
