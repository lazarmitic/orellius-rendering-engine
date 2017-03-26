#version 300 es

precision highp float;

uniform sampler2D u_DiffuseTexture;

in vec2 v_UV1;

out vec4 fragColor;

void main() {

	fragColor = texture(u_DiffuseTexture, v_UV1);
}
