//CS 425 Lab 1 
// Student Name: Hal Brynteson 
// Student NetID: hbrynt2

var gl; 
var points;
var theta = 0.0;
var program;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); //create white canvas
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var alphaVal = 0.5

    var vertices = [vec2(-0.5, -0.5), vec2(0.0,0.5), vec2(0.5, -0.5)];  
    var colors = [vec4(1.0,0.0,0.0,alphaVal), vec4(0.0,1.0,0.0,alphaVal), vec4(0.0,0.0,1.0,alphaVal)];
    
    points = 3;

    // Load the data into the GPU
    // Load position to GPU
    var vPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate vPosition shader variable with vPosition data buffer
    var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

    // add null bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Load Color to GPU
    var vColorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vColorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate vColor shader variable with vColor data buffer
    var vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );

    // add null bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    render();
};


function render() {

    requestAnimationFrame(render);

    gl.clear( gl.COLOR_BUFFER_BIT );

    var rotSpeed = 1;
    
    theta += rotSpeed;

    var transMat = rotateZ(theta);

    var uTransMatLoc = gl.getUniformLocation(program, "uTransMat");
    gl.uniformMatrix4fv(uTransMatLoc, false, flatten(transMat));

    //gl.drawArrays(mode, first_index, point_count)
    gl.drawArrays( gl.TRIANGLES, 0, points);

}

function initShaders( gl, vertexShaderId, fragmentShaderId )
{
    var vertShdr;
    var fragShdr;

    var vertElem = document.getElementById( vertexShaderId );
    if ( !vertElem ) { 
        alert( "Unable to load vertex shader " + vertexShaderId );
        return -1;
    }
    else {
        vertShdr = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertShdr, vertElem.text );
        gl.compileShader( vertShdr );
        if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
            var msg = "Vertex shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var fragElem = document.getElementById( fragmentShaderId );
    if ( !fragElem ) { 
        alert( "Unable to load vertex shader " + fragmentShaderId );
        return -1;
    }
    else {
        fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragShdr, fragElem.text );
        gl.compileShader( fragShdr );
        if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
            var msg = "Fragment shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }

    return program;
}