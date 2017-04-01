#version 300 es

precision highp float;

layout (location = 0) in vec3 a_Position;
layout (location = 1) in vec2 a_UV1;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;

out vec2 v_UV1;

void main() {

	gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position.x, a_Position.y, a_Position.z, 1);
	v_UV1 = a_UV1;
}
