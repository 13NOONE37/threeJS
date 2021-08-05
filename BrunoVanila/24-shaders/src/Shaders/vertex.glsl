uniform mat4 modelMatrix; //doda transformacje do pozycji mesha takie jak skalowanie, obracanie, czy zmiana pozycji
uniform mat4 viewMatrix; //te same trasformacje tylko, że od kamery
uniform mat4 projectionMatrix;  ///https://learnopengl.com/Getting-started/Coordinate-Systems
//transformacje które musimy zaaplikować do po


attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;
varying vec2 vUV;
varying float vElevation;


uniform vec2 uFrequency;
uniform float uTime;
// varying float vRandom; //aby przekazac do fragment
        
void main()
{
//   vec2 foo = vec2(1.0,2.0);
//   vec3 bar = vec3(foo, 3.0);
//   vec2 plane = bar.xy;
// vec4 foo = vec4(1.0,2.0,3.0,4.0);
// float bar = foo.w;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) *0.1;
    elevation+=sin(modelPosition.y * uFrequency.y - uTime) *0.1;
    vElevation = elevation;
    
    modelPosition.z+=elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    vUV = uv;
    // vRandom = aRandom; //aby przekazac do fragment
}