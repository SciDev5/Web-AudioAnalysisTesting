/**@type {HTMLCanvasElement}*/ var canvas;
/**@type {CanvasRenderingContext2D}*/ var ctx;
/**@type {number}*/ var width, height;

/**@type {AudioContext}*/ var actx;
/**@type {AnalyserNode}*/ var analyserNode;
/**@type {AnalyserNode}*/ var micNode;

function init() {
    canvas = document.getElementById("cnv"); width = canvas.width; height = canvas.height;
    ctx = canvas.getContext("2d");
}
async function actxInit(e) {
    removeEventListener("click",actxInit);
    clearScreenAndTransforms();
    if (!navigator.mediaDevices) {
        alert("Your browser does not support microphone use.");
        return;
    }
    var stream;
    
    try {
        //stream = await navigator.mediaDevices.getUserMedia ({audio: true, video: false})
        stream = await navigator.mediaDevices.getDisplayMedia({video:true, audio: true})
    } catch (e) {
        console.error("Error opening microphone stream:",e);
        alert("Problem opening microphone stream. See console for details.")
    }
    actx = new AudioContext();
    micNode = actx.createMediaStreamSource(stream);
    analyserNode = actx.createAnalyser();
    micNode.connect(analyserNode);
    console.log(analyserNode);
}

function loop() {
    clearMatrixStack();

    if (actx) {
        const nChunks = 200;
        const chunkRenderSize = height/nChunks;
        ctx.drawImage(canvas,-chunkRenderSize,0);

        var data = getLogFFTData(nChunks,0,0,nChunks);

        
        var sortedData = data.map(v=>v).sort(), min = sortedData[0], max = sortedData[data.length-1];
        data = data.map(v=>(v-min)/(max-min));
        for (var i = 0; i < height; i++) {
            //var color = `hsl(${Math.floor(360*data[i])},100%,50%)`;
            var color = `#${(0x010101*Math.floor(255*data[i])).toString(16)}`
            fillRect(width-chunkRenderSize,i*chunkRenderSize,chunkRenderSize,chunkRenderSize,color);
        }
    } else {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "50px monospace"
        ctx.fillText("CLICK ANYWHERE TO START",width/2,height/2,width*0.8);
    }
}


// ------------- Drawing Helpers ------------- //


/** The matrix stack, responsible for holding transforms to revert to. 
 * @type {DOMMatrix[]}
 */
const matrixStack = [];
/** Push the current transformation to the matrix stack. */
function pushMatrix() { matrixStack.push(ctx.getTransform()); }
/** Revert the most recent pushed transformation and remove it from the stack. */
function popMatrix() { ctx.setTransform(matrixStack.splice(matrixStack.length-1)[0]); }
/** Clear the matrix stack. (DOES NOT CHANGE APPLIED TRANSFORM) */
function clearMatrixStack() { matrixStack.splice(0); }
/** Clear all transformations and the matrix stack. */
function clearScreenAndTransforms() { clearMatrixStack(); clearScreen(); ctx.resetTransform(); }

/** Clears everything on the canvas but leaves the transformation unchanged */
function clearScreen() {
    pushMatrix();
    ctx.resetTransform();
    ctx.clearRect(0,0,width,height);
    popMatrix();
}

/**
 * Draw a rectangle with a specific fill color.
 * @param {number} x The X-coordinate of the top-left corner of the rectangle.
 * @param {number} y The Y-coordinate of the top-left corner of the rectangle.
 * @param {number} w The width of the rectangle.
 * @param {number} h The height of the rectangle.
 * @param {string} fill The solid fill color of the rectangle.
 */
function fillRect(x,y,w,h,fill) {
    var oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = fill;
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = oldFillStyle;
}


// ------------- Math Utilities ------------- //


/**
 * Generate a ranfom number between `min` (inclusive) and `max` (exclusive).
 * @param {number} min [INT] The minimum value for the rng (inclusive).
 * @param {number} max [INT] The maximum value for the rng (exclusive).
 * @returns {number} A random integer between min and max.
 */
function randInt(min,max) { return Math.floor((max-min)*Math.random())+min; }



function getLogFFTData(nDivs,fMin,fMax,linearDivs) {
    var linearData = new Float32Array(linearDivs);
    analyserNode.getFloatFrequencyData(linearData);
    var logData = new Float32Array(nDivs);

    logData = linearData
    
    //logData.map((_,i)=>linearData[i]);

    return logData;
}

// ------------- Events ------------- //

addEventListener("load",init);
addEventListener("click",actxInit);
setInterval(loop,10);