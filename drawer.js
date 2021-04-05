class Drawer {
    /** The matrix stack, responsible for holding transforms to revert to. 
     * @type {DOMMatrix[]}
     */
    matrixStack = [];
    /**@type {HTMLCanvasElement}*/
    cnv = null;
    /**@type {CanvasRenderingContext2D}*/
    ctx = null;
    constructor(canvas) {
        this.cnv = canvas;
        this.ctx = this.cnv.getContext("2d");
    }

    /**@type {number}*/
    get width() { return this.cnv.width; }
    /**@type {number}*/
    get height() { return this.cnv.height; }
    /**@type {HTMLCanvasElement}*/
    get canvas() { return this.cnv; }

    /** Push the current transformation to the matrix stack. */
    pushMatrix() { this.matrixStack.push(this.ctx.getTransform()); }
    /** Revert the most recent pushed transformation and remove it from the stack. */
    popMatrix() { this.ctx.setTransform(this.matrixStack.splice(this.matrixStack.length-1)[0]); }
    /** Clear the matrix stack. (DOES NOT CHANGE APPLIED TRANSFORM) */
    clearMatrixStack() { this.matrixStack.splice(0); }
    /** Clear all transformations and the matrix stack. */
    clearScreenAndTransforms() { this.clearMatrixStack(); this.clearScreen(); this.ctx.resetTransform(); }

    /** Clears everything on the canvas but leaves the transformation unchanged */
    clearScreen() {
        this.pushMatrix();
        this.ctx.resetTransform();
        this.ctx.clearRect(0,0,this.width,this.height);
        this.popMatrix();
    }

    /**
     * Draw a rectangle with a specific fill color.
     * @param {number} x The X-coordinate of the top-left corner of the rectangle.
     * @param {number} y The Y-coordinate of the top-left corner of the rectangle.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @param {string} fill The solid fill color of the rectangle.
     */
    fillRect(x,y,w,h,fill) {
        var oldFillStyle = this.ctx.fillStyle;
        this.ctx.fillStyle = fill;
        this.ctx.fillRect(x,y,w,h);
        this.ctx.fillStyle = oldFillStyle;
    }
}

export default Drawer;