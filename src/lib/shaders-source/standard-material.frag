#version 300 es

precision highp float;

struct DirectionalLight {

	vec3 directionVector;
	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
};
uniform DirectionalLight directionalLights[5];
uniform int numberOfActiveDirectionalLights;

vec3 calculateDirectionalLight(DirectionalLight directionalLight, vec3 normal, vec3 fragmentToCameraDirection);

struct PointLight {

	vec3 position;

	float constant;
	float linear;
	float quadratic;

	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
};
uniform PointLight pointLights[5];
uniform int numberOfActivePointLights;

vec3 calculatePointLight(PointLight pointLight, vec3 normal, vec3 fragmentPosition, vec3 fragmentToCameraDirection);

struct SpotLight {

	vec3 position;
	vec3 direction;

	float innerCutOffAngle;
	float outerCutOffAngle;

	float constant;
	float linear;
	float quadratic;

	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
};
uniform SpotLight spotLights[5];
uniform int numberOfActiveSpotLights;

vec3 calculateSpotLight(SpotLight spotLight, vec3 normal, vec3 fragmentPosition, vec3 fragmentToCameraDirection);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

uniform sampler2D u_DiffuseTexture;
uniform vec3 u_viewPosition;

in vec2 v_UV;
in vec3 v_Normal;
in vec3 v_FragmentPosition;

out vec4 o_fragColor;

void main() {

	vec3 normalizedNormal = normalize(v_Normal);
	vec3 fragmentToViewDirection = normalize(u_viewPosition - v_FragmentPosition);

	vec3 result = vec3(0.0, 0.0, 0.0);

	for(int i = 0; i < numberOfActiveDirectionalLights; i++) {

		result += calculateDirectionalLight(directionalLights[i], normalizedNormal, fragmentToViewDirection);
	}

	for(int i = 0; i < numberOfActivePointLights; i++) {

		result += calculatePointLight(pointLights[i], normalizedNormal, v_FragmentPosition, fragmentToViewDirection);
	}

	for(int i = 0; i < numberOfActiveSpotLights; i++) {

		result += calculateSpotLight(spotLights[i], normalizedNormal, v_FragmentPosition, fragmentToViewDirection);
	}

	o_fragColor = vec4(result, 1.0);
}

vec3 calculateDirectionalLight(DirectionalLight directionalLight, vec3 fragmentNormal, vec3 fragmentToCameraDirection) {

	vec3 fragmentToLightDirection = normalize(-directionalLight.directionVector);
	vec3 fragmentToLightDirectionReflected = reflect(-fragmentToLightDirection, fragmentNormal);

	// Diffuse factor
	float diffuseFactor = max(dot(fragmentNormal, fragmentToLightDirection), 0.0);

	// Specular factor
	float specularFactor = pow(max(dot(fragmentToCameraDirection, fragmentToLightDirectionReflected), 0.0), 32.0);

	// Combine results
	vec3 ambient = directionalLight.ambientColor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 diffuse = directionalLight.diffuseColor * diffuseFactor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 specular = directionalLight.specularColor * specularFactor * vec3(0.5, 0.5, 0.5);

	return ambient + diffuse + specular;
}

vec3 calculatePointLight(PointLight pointLight, vec3 normal, vec3 fragmentPosition, vec3 fragmentToCameraDirection) {

	vec3 fragmentToLightDirection = normalize(pointLight.position - fragmentPosition);
	vec3 fragmentToLightDirectionReflected = reflect(-fragmentToLightDirection, normal);
	float fragmentToLightDistance = length(pointLight.position - fragmentPosition);

	// Diffuse factor
	float diffuseFactor = max(dot(normal, fragmentToLightDirection), 0.0);

	// Specular factor
	float specularFactor = pow(max(dot(fragmentToCameraDirection, fragmentToLightDirectionReflected), 0.0), 32.0);

	// Attenuation factor
	float attenuationFactor = 1.0 / (pointLight.constant +
									pointLight.linear * fragmentToLightDistance +
									pointLight.quadratic * (fragmentToLightDistance * fragmentToLightDistance));

	// Combine results
	vec3 ambient = pointLight.ambientColor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 diffuse = pointLight.diffuseColor * diffuseFactor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 specular = pointLight.specularColor * specularFactor * vec3(0.5, 0.5, 0.5);

	ambient *= attenuationFactor;
	diffuse *= attenuationFactor;
	specular *= attenuationFactor;

	return ambient + diffuse + specular;
}

vec3 calculateSpotLight(SpotLight spotLight, vec3 normal, vec3 fragmentPosition, vec3 fragmentToCameraDirection) {

	vec3 fragmentToLightDirection = normalize(spotLight.position - fragmentPosition);
	vec3 fragmentToLightDirectionReflected = reflect(-fragmentToLightDirection, normal);
	float fragmentToLightDistance = length(spotLight.position - fragmentPosition);

	// Diffuse factor
	float diffuseFactor = max(dot(normal, fragmentToLightDirection), 0.0);

	// Specular factor
	float specularFactor = pow(max(dot(fragmentToCameraDirection, fragmentToLightDirectionReflected), 0.0), 32.0);

	// Attenuation factor
	float attenuationFactor = 1.0 / (spotLight.constant +
									spotLight.linear * fragmentToLightDistance +
									spotLight.quadratic * (fragmentToLightDistance * fragmentToLightDistance));

	// Spotlight intensity
	float theta = dot(fragmentToLightDirection, normalize(-spotLight.direction));
	float epsilon = spotLight.innerCutOffAngle - spotLight.outerCutOffAngle;
	float intensity = clamp((theta - spotLight.outerCutOffAngle) / epsilon, 0.0, 1.0);

	// Combine results
	vec3 ambient = spotLight.ambientColor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 diffuse = spotLight.diffuseColor * diffuseFactor * vec3(texture(u_DiffuseTexture, v_UV));
	vec3 specular = spotLight.specularColor * specularFactor * vec3(0.5, 0.5, 0.5);

	ambient *= attenuationFactor * intensity;
	diffuse *= attenuationFactor * intensity;
	specular *= attenuationFactor * intensity;

	return ambient + diffuse + specular;
}
