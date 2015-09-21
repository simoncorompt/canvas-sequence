class CanvasSequence {

    constructor(canvas, sequencePath, sequenceLength, fileType, loadCallback) {

        this.sequence = [];

        this.canvas = document.getElementById(canvas);
        this.context = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.sequencePath = sequencePath;
        this.sequenceLength = sequenceLength;

        this.fileType = fileType || '.png';

        this.scrollHeight = document.body.scrollHeight;
        this.scrollOffset = document.body.scrollTop;
        this.clientHeight = window.innerHeight;

        this.loadCallback = loadCallback || function() {};

        this.loadSequence();
    }

    addLeadingZeros(n) {
        var length = this.sequenceLength.toString().length;
        var str = (n > 0 ? n : -n) + "";
        var zeros = "";
        for (var i = length - str.length; i > 0; i--)
            zeros += "0";
        zeros += str;
        return n >= 0 ? zeros : "-" + zeros;
    }

    loadSequence() {

        for(var i = 0; i < this.sequenceLength; i++) {

            var frameNumber = this.addLeadingZeros(i);
            var filename = this.sequencePath + frameNumber + this.fileType;
            var img = new Image;
            img.src = filename;

            img.onload = () => {
             this.loadedCounter++;
             if(this.loadedCounter === this.sequenceLength) {
             this.loadCallback();
             this.renderFrame();
             }
             };

            this.sequence.push(img);
        }
    }

    getNextFrameNumber() {
        var scrollPercentage = (this.scrollOffset/(this.scrollHeight-this.clientHeight))*100;
        var currentFrameNumber = Math.round(scrollPercentage*this.sequenceLength/100);
        return currentFrameNumber;
    }

    syncScrollPosition() {
        this.scrollOffset = document.body.scrollTop;
    }

    drawImage(frame) {

        if(frame >= 0 && frame < this.sequence.length) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if(this.sequence[frame].complete) {
                this.context.drawImage(this.sequence[frame], 0, 0, this.canvas.width, this.canvas.height);
            } else {
                console.log("The current frame has not been loaded. Please ensure all images are loaded before updating the canvas.")
            }
        }

    }

    renderFrame() {

        this.syncScrollPosition();

        requestAnimationFrame(() => {
            this.renderFrame();
        });

        this.previousFrame = this.currentFrame;
        this.currentFrame = this.getNextFrameNumber();

        if( (this.currentFrame != this.previousFrame) || this.firstLoad) {
            this.drawImage(this.currentFrame);
        }

        this.firstLoad = false;
    }

}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

if (typeof define === 'function' && define.amd) {
    define('CanvasSequence', CanvasSequence);
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasSequence;
} else {
    window.CanvasSequence = CanvasSequence;
}