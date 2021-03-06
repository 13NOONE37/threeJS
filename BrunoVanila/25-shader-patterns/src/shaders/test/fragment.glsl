#define M_PI 3.1415926535897932384626433832795


varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}


void main()
{
    // Pattern 3
    // float strength = vUv.x;

    // Pattern 4
    // float strength = vUv.y;

    // Pattern 5
    // float strength =1.0 -  vUv.y ;
    
    // Pattern 6
    // float strength = vUv.y *10.0;
    
    // Pattern 7
    // float strength = mod(vUv.y* 10.0, 1.0);
    
    // Pattern 8
    // float strength = mod(vUv.y* 10.0, 1.0);
    // strength = step(0.5, strength); //chyba zaokr??gla w g??re lub w d???? tj. 0.0 lub 1.0
    //strength = strength < 0.5 ? 0.0 : 1.0; //IFs are bad for performance so when we can we should use math solution

    // Pattern 9 
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 10 
    // float strength = mod(vUv.x  * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 11 - grid
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 12 - grid reverse
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 13 - grid rect
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 14 - angle 90deg
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0)); 
 
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0)); 
    
    // float strength = barX + barY;


    // Pattern 15 - plus grid
    // float barX = step(0.4, mod(vUv.x * 10.0 , 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0+0.2, 1.0)); 
 
    // float barY =  step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0)); 

    // float strength = barX + barY;

    //Pattern 16 
    // float strength = step(0.5, vUv.x*10.0);
    // float strength = abs(vUv.x - 0.5);

    //Pattern 17 
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    //Pattern 18 
    // float strength =step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    //Pattern 19 
    // float strength =step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    //Patter 20 step gradient
    // float strength = floor(vUv.x *10.0)/10.0; // zaokr??gla liczby pomno??one przez 10 w d???? czyli np b??dzie 1 = 1, 1.1 = 1, 1.9=1; a potem podzieli to przez 10 aby uzyska?? przedzia?? 0-1

    //Patter 21 step gradient
    // float strength = floor(vUv.x *10.0)/10.0; // zaokr??gla liczby pomno??one przez 10 w d???? czyli np b??dzie 1 = 1, 1.1 = 1, 1.9=1; a potem podzieli to przez 10 aby uzyska?? przedzia?? 0-1
    // strength *= floor(vUv.y *10.0)/10.0;

    //Patter 22 TVnoise
    // float strength = random(vUv); 

    //Patter 23 minecraft block
//    vec2 gridUv = vec2(
//         floor(vUv.x *10.0)/10.0,
//         floor(vUv.y *10.0)/10.0
//     );
//     float strength = random(gridUv);

    //Patter 24 minecraft block offset
//    vec2 gridUv = vec2(
//         floor(vUv.x *10.0)/10.0,
//         floor(vUv.y *10.0 + vUv.x*5.0)/10.0 
//     );
//     float strength = random(gridUv);

    //Patter 25 gradient
    // float strength = vUv.x+vUv.y;
    //lub
    // float strength = length(vUv);

    //Patter 26 radial gradient
    // float strength = length(vUv -0.5);
    //lub
    // float strength = distance(vUv, vec2(0.5));

    //Patter 27 radial gradient opposite
    // float strength =1.0 - distance(vUv, vec2(0.5));

    //Patter 28 radial gradient reverse
    // float strength =0.02 / distance(vUv, vec2(0.5) );

    //Patter 29 radial gradient reverse streched
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength =0.015 / distance(lightUv, vec2(0.5) );

    //Patter 30 star
    // vec2 lightUvX = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5) );

    // vec2 lightUvY = vec2(
    //     vUv.y * 0.1 + 0.45,
    //     vUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5) );


    // float strength =lightX * lightY;

    //Patter 31 star
    // vec2 rotatedUv = rotate(vUv, M_PI*0.25, vec2(0.5));

    // vec2 lightUvX = vec2(
    //     rotatedUv.x * 0.1 + 0.45,
    //     rotatedUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5) );

    // vec2 lightUvY = vec2(
    //     rotatedUv.y * 0.1 + 0.45,
    //     rotatedUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5) );


    // float strength =lightX * lightY;

    //Patter 32
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    //Patter 33
    // float strength = abs(distance(vUv, vec2(0.5)) -0.25);

    //Patter 34
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) -0.2));

    //Patter 35
    // float strength =1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) -0.2));

    //Patter 36
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength =sin(1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.2)));

    //Patter 37
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength =sin(1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.25)));

    //Patter 38
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength =sin(1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.25)));

    //Patter 39 angle
    // float angle = atan(vUv.x, vUv.y);
    // float strength =angle;

    //Patter 40 angle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength =angle;

    //Patter 41 conical gradient
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= M_PI *2.0;
    // angle +=0.5;

    // float strength =angle;

    //Patter 42 
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= M_PI *2.0;
    // angle +=0.5;
    // angle *=10.0;
    // angle = mod(angle, 1.0); //kiedy osiaga 1 zerujemy z powrotem czy cos takiego
    // float strength =angle;

    // //Patter 43 
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= M_PI *2.0;
    // angle +=0.5;
    // float strength =sin(angle*100.0);

    //Pattern 44
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= M_PI *2.0;
    // angle +=0.5;
    // float sinusoid=sin(angle*100.0);
    
    
    // float radius = 0.25 + sinusoid * 0.02;

    // float strength =1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) -radius));

    //Pattern 45 perrlin noise
    // float strength = cnoise(vUv * 10.0);

    //Pattern 46 perrlin noise
    // float strength =step(0.0, cnoise(vUv * 10.0));

    //Pattern 47 perrlin noise
    // float strength =1.0 - abs(cnoise(vUv * 10.0));

    //Pattern 48 perrlin noise
    // float strength =sin(cnoise(vUv * 10.0) * 20.0);

    //Pattern 49 perrlin noise
    float strength =step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    //Clamp the strength
    strength = clamp(strength, 0.0, 1.0); //wartosc, najmniejsza jaka moze byc, najwieksza jaka moze byc
    //Color version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.5);
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}