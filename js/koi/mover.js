/**
 * A fish mover for moving fish through user input
 * @param {Constellation} constellation A constellation to move fish in
 * @constructor
 */
const Mover = function(constellation) {
    this.constellation = constellation;
    this.move = null;
    this.cursor = new Vector2();
    this.cursorPrevious = new Vector2();
    this.offset = new Vector2();
    this.cursorOffset = new Vector2();
};

/**
 * Update the mover
 */
Mover.prototype.update = function() {
    if (this.move)
        this.move.body.update(
            this.move.position,
            this.move.direction,
            this.move.speed);
};

/**
 * Render the mover
 * @param {Primitives} primitives The primitives renderer
 * @param {WebGLTexture} atlas The atlas texture
 * @param {Number} scale The render scale
 * @param {Number} time The interpolation factor since the last update
 */
Mover.prototype.render = function(primitives, atlas, scale, time) {
    if (this.move) {
        primitives.transformPush();
        primitives.getTransform().scale(scale, scale);
        primitives.setTexture(atlas);
        primitives.gl.enable(primitives.gl.BLEND);
        primitives.gl.blendFunc(primitives.gl.SRC_ALPHA, primitives.gl.ONE_MINUS_SRC_ALPHA);

        this.move.render(primitives, time);

        primitives.transformPop();
        primitives.gl.disable(primitives.gl.BLEND);
    }
};

/**
 * Move the cursor
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
Mover.prototype.touchMove = function(x, y) {
    this.cursorPrevious.set(this.cursor);
    this.cursor.x = x;
    this.cursor.y = y;

    if (this.move) {
        this.cursorOffset.set(this.cursor).add(this.offset);
        this.move.moveTo(this.cursorOffset);
    }
};

/**
 * Start a new move
 * @param {Fish} fish The fish that needs to be moved
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
Mover.prototype.pickUp = function(fish, x, y) {
    this.cursorPrevious.x = this.cursor.x = x;
    this.cursorPrevious.y = this.cursor.y = y;
    this.move = fish;
    this.offset.x = fish.position.x - this.cursor.x;
    this.offset.y = fish.position.y - this.cursor.y;
};

/**
 * Release any move
 */
Mover.prototype.drop = function() {
    if (this.move) {
        this.constellation.drop(this.move);
        this.move = null;
    }
};