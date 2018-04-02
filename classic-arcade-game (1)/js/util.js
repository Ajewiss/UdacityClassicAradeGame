// Dimensional constants to scale the movements in X and Y
const colSize = 101;
const rowSize = 83;
const rowOffset = -35;

// Helper methods to get back and forth from pixels to rows and columns
var rowsToPx = function(rows) {
    return rowSize * rows;
};

var colsToPx = function(cols) {
    return colSize * cols;
};

var pxToRows = function(px) {
    return Math.floor( px / rowSize );
};

var pxToCols = function(px) {
    return Math.floor( px / colSize );
};