// A shallow relief of the illustrated exterior. Image-space distance bands
// distinguish the garden, glazed facade and sky as the viewer moves.
export function mountDepthView(plane) {
  const photo = plane.querySelector('img');
  if (!photo.complete || !photo.naturalWidth) return;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:true});
  if (!gl) return;
  const resources = [];
  const onRelease = fn => resources.push(fn);
  function release() {
    while (resources.length) resources.pop()();
    canvas.remove();
  }
  try {
    function shader(type,source) {
      const item = gl.createShader(type);
      onRelease(()=>gl.deleteShader(item));
      gl.shaderSource(item,source);
      gl.compileShader(item);
      if (!gl.getShaderParameter(item,gl.COMPILE_STATUS)) throw Error('Shader unavailable');
      return item;
    }
    const vertex = shader(gl.VERTEX_SHADER,`
      attribute vec2 position;
      varying vec2 screen;
      void main(){screen=position*.5+.5;gl_Position=vec4(position,0.,1.);}`);
    const fragment = shader(gl.FRAGMENT_SHADER,`
      precision mediump float;
      varying vec2 screen;
      uniform sampler2D plate;
      uniform vec2 crop;
      uniform vec2 eye;
      void main(){
        vec2 uv=(screen-vec2(.5,.45))*crop+vec2(.5,.45);
        vec2 p=vec2(uv.x,1.-uv.y);
        float lawn=smoothstep(.66,1.,p.y);
        float tree=(1.-smoothstep(.06,.38,p.x))*(1.-smoothstep(.05,.75,p.y));
        float roof=mix(.70,.14,smoothstep(.25,.91,p.x));
        float wall=smoothstep(roof-.025,roof+.025,p.y)*smoothstep(.25,.58,p.x);
        float depth=clamp(.08+.72*lawn+.47*tree+.30*wall,0.,1.);
        gl_FragColor=texture2D(plate,clamp(uv+eye*(depth-.35)*.013,0.001,.999));
      }`);
    const program = gl.createProgram();
    onRelease(()=>gl.deleteProgram(program));
    gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error('Program unavailable');
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    onRelease(()=>gl.deleteBuffer(buffer));
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program,'position');
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const texture = gl.createTexture();
    onRelease(()=>gl.deleteTexture(texture));
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);
    const crop = gl.getUniformLocation(program,'crop');
    const eye = gl.getUniformLocation(program,'eye');
    let frame = 0, x = 0, y = 0, inView = true;
    function draw() {
      frame = 0;
      if (!inView || document.hidden) return;
      const w = plane.clientWidth, h = plane.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1,1.4,1800/w);
      const width = Math.max(1,Math.round(w*ratio)), height = Math.max(1,Math.round(h*ratio));
      if (canvas.width!==width || canvas.height!==height) { canvas.width=width;canvas.height=height; }
      gl.viewport(0,0,width,height);
      const aspect = (w/h)/(photo.naturalWidth/photo.naturalHeight);
      gl.uniform2f(crop,Math.min(1,aspect),Math.min(1,1/aspect));
      gl.uniform2f(eye,x,y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    function schedule() { if (!frame && inView && !document.hidden) frame=requestAnimationFrame(draw); }
    const region = plane.closest('.property-opening');
    function move(event) {
      const rect=region.getBoundingClientRect();
      x=2*(event.clientX-rect.left)/rect.width-1;y=1-2*(event.clientY-rect.top)/rect.height;
      schedule();
    }
    const reset=()=>{x=0;y=0;schedule();};
    const visibility = new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;schedule();});
    visibility.observe(region);
    const resize = new ResizeObserver(schedule);resize.observe(plane);
    region.addEventListener('pointermove',move);region.addEventListener('pointerleave',reset);
    canvas.addEventListener('webglcontextlost',release,{once:true});
    canvas.className='depth-view';canvas.setAttribute('aria-hidden','true');plane.append(canvas);
    draw();
    onRelease(()=>{
      cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();
      region.removeEventListener('pointermove',move);region.removeEventListener('pointerleave',reset);
      canvas.removeEventListener('webglcontextlost',release);
    });
    return release;
  } catch { release(); }
}
