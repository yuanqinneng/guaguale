export default class draw {
    constructor(id, width, height) {
        this.id = id;
        this.isDraw = false;
        this.canvas = document.getElementById('canvas');
        this.width = width;
        this.height = height;
        this.rect = canvas.getBoundingClientRect();
        this.firstShowTips = false;
        this.init();
    }
    init() {
        let ctx = this.canvas.getContext('2d');
        ctx.save()
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.save()
        ctx.restore()
        ctx.fillStyle = 'darkgray';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.save()
        ctx.restore()
        // ctx.fillStyle = '#fff';
        // ctx.textBaseline = 'middle';
        // ctx.textAlign = 'center';
        // ctx.font = '30px Georgia';
        // ctx.fillText('来刮我呀', this.width/2, this.height/2);
        
        let bgImg = new Image();
        bgImg.src = './imgs/bg.png';
        bgImg.onload = () => {
            ctx.drawImage(bgImg, 10, 10, this.width-20, this.height-20);
        }
        ctx.restore()
        ctx.restore()

        this.addMobileEvent(this.canvas, ctx);
        this.addPcEvent(this.canvas, ctx);
    }
    addMobileEvent(canvas, ctx) {
        const This = this;
        canvas.ontouchstart = function (e) {
            This.onStartFn(e);
        };
        canvas.ontouchmove = function (e) {
            This.onMoveFn(e, ctx);
        };
        canvas.ontouchend = function () {
            This.onEndFn();
        };
    }
    addPcEvent(canvas, ctx) {
        const This = this;
        canvas.onmousedown = function (e) {
            This.onStartFn(e);
        };
        canvas.onmousemove = function (e) {
            This.onMoveFn(e, ctx, true);
        };
        canvas.onmouseup = function () {
            This.onEndFn();
        };
    }
    onStartFn(e) {
        e.preventDefault();
        this.isDraw = true;
    }
    onMoveFn(e, ctx, isPc = false) {
        e.preventDefault();
        if (!this.isDraw) return;
        const pageX = isPc ? e.pageX : e.touches[0].clientX,
            pageY = isPc ? e.pageY : e.touches[0].clientY,
            x = pageX - this.rect.left,
            y = pageY - this.rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        console.log(this.getTransparentPercent(ctx));
        if(this.moveCallback) this.moveCallback(this.getTransparentPercent(ctx))
    }
    onEndFn() {
        this.isDraw = false;
        this.winOrNot();
    }
    getTransparentPercent(ctx) {
        const imgData = ctx.getImageData(0, 0, this.width, this.height),
            pixles = imgData.data,
            transPixs = [];
        //   console.log('imgData', imgData,'pixles',pixles,'transPixs',transPixs);
        for (let i = 3; i < pixles.length; i += 4) {
            let alpha = pixles[i];
            if (alpha == 0) {
                transPixs.push(i);
            }
        }
        return parseInt(((transPixs.length / (pixles.length / 4)) * 100).toFixed(2));
    }
    erase() {
        let ctx = this.canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, this.width, this.height);
        console.log(111);
        for (let i = 3; i < imgData.data.length; i += 4) {
            imgData.data[i] = 0;
        }
        ctx.putImageData(imgData, 0, 0);
        if(this.moveCallback) this.moveCallback(this.getTransparentPercent(ctx))
        this.winOrNot();
    }
    winOrNot() {
        let ctx = this.canvas.getContext('2d');
        if (this.getTransparentPercent(ctx) > 80) {
            if (!this.firstShowTips) {
                this.firstShowTips = true
                // alert('很遗憾，老板您未中奖，欢迎您再来一张');
                document.querySelector('#winOrnot').style.display = 'inline-block'
                document.querySelector('#winOrnot').innerText = '很遗憾，您未能中奖'
            }
        } 
    }
}
