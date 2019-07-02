class CanvasSequence {

    constructor(canvas, sequencePath, sequenceStart, sequenceEnd, fileType, loadCallback) {

        this.sequence = [];

        this.canvas = document.getElementById(canvas);

        if(this.canvas !== null) {
            this.context = this.canvas.getContext('2d');
        } else {
            console.log("Please ensure the lib is loaded when DOM is loaded.")
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.sequencePath = sequencePath;
        this.sequenceStart = sequenceStart;
        this.sequenceEnd = sequenceEnd;
        this.sequenceLength = this.sequenceEnd - this.sequenceStart;

        this.fileType = fileType || '.png';

        var documentHeight = $(document).height();
        this.scrollHeight = documentHeight;

        this.scrollOffset = window.pageYOffset || document.documentElement.scrollTop,
        
        this.clientHeight = window.innerHeight;

        this.loadCallback = loadCallback || function() {};

        this.loadSequence();
    }

    addLeadingZeros(n) {
        var length = this.sequenceEnd.toString().length;
        var str = (n > 0 ? n : -n) + "";
        var zeros = "";
        for (var i = length - str.length; i > 0; i--)
            zeros += "0";
        zeros += str;
        return n >= 0 ? zeros : "-" + zeros;

    }

    loadSequence() {

        var promises = [];

        for(var i = this.sequenceStart; i <= this.sequenceEnd; i++) {

            var frameNumber = this.addLeadingZeros(i);
            var filename = this.sequencePath + frameNumber + this.fileType;
            var img = new Image;
            img.src = filename;

            var promise = new Promise(function(resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
            });

            promises.push(promise);

            this.sequence.push(img);
        }

        Promise.all(promises).then(() => {
            this.renderFrame();
            this.loadCallback();
        }).catch((e) => {
            console.log(e);
        });

    }

    getNextFrameNumber() {
        
        var scrollPercentage = (this.scrollOffset/(this.scrollHeight-this.clientHeight))*100;
        var currentFrameNumber = Math.round(scrollPercentage*this.sequenceLength/100);
        return currentFrameNumber;
    }

    syncScrollPosition() {
        this.scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
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