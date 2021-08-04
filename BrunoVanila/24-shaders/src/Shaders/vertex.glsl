 uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
        
void main()
{
//   vec2 foo = vec2(1.0,2.0);
//   vec3 bar = vec3(foo, 3.0);
//   vec2 plane = bar.xy;
// vec4 foo = vec4(1.0,2.0,3.0,4.0);
// float bar = foo.w;
 


          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}