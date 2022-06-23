// 两个参数，第一个轮播图区域，第二个是配置
export default function bannerArea(areaDom, options) {
    var imgArea = document.createElement('div');
    var numberArea = document.createElement('div');
    var curIndex = 0; //第几张轮播图
    var changeTimer = null;
    var changeDuration = 30000; //间隔
    var timer = null;

    initImg(); //创建一个区域来显示图片

    initNumber(); //创建区域显示角标

    setStatus(); //设置状态

    autoChange(); //自动切换

    //下面是局部函数

    //创建图片，并且设置样式
    function initImg() {
        imgArea.style.width = '100%';
        imgArea.style.height = '100%';
        imgArea.style.overflow = 'hidden';
        for (let i = 0; i < options.length; i++) {
            var obj = options[i];
            var img = document.createElement('img');
            img.src = obj.imgUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.margin = '0';
            img.addEventListener('click', function () {
                location.href = options[i].link;
            });
            imgArea.appendChild(img);
        }
        imgArea.addEventListener('mouseenter', function () {
            clearInterval(changeTimer);
            changeTimer = null;
        });
        imgArea.addEventListener('mouseleave', function () {
            autoChange();
        });
        areaDom.appendChild(imgArea);
    }
    //创建角标元素和设置样式
    function initNumber() {
        numberArea.style.textAlign = 'center';
        numberArea.style.marginTop = '-25px';
        for (let i = 0; i < options.length; i++) {
            var sp = document.createElement('span');
            sp.style.width = '12px';
            sp.style.height = '12px';
            sp.style.background = 'lightgray';
            sp.style.display = 'inline-block';
            sp.style.margin = '0 7px';
            sp.style.borderRadius = '50%';
            sp.style.cursor = 'pointer';
            sp.addEventListener('click', function () {
                curIndex = i;
                setStatus();
            });
            numberArea.appendChild(sp);
        }
        areaDom.appendChild(numberArea);
    }

    //设置角标区域状态
    function setStatus() {
        //设置圆圈的背景颜色
        for (var i = 0; i < options.length; i++) {
            if (i === curIndex) {
                //设置背景颜色为选择
                numberArea.children[i].style.background = 'rgb(222 57 57)';
            } else {
                //非选择
                numberArea.children[i].style.background = 'lightgray';
            }
        }
        //显示图片
        var start = parseInt(imgArea.children[0].style.marginLeft);
        var end = curIndex * -100;
        var dis = end - start;
        var duration = 500;
        var speed = dis / duration;
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            start += speed * 20;
            imgArea.children[0].style.marginLeft = start + '%';
            if (Math.abs(end - start) < 1) {
                imgArea.children[0].style.marginLeft = end + '%';
                imgArea.children[1].style.marginLeft = end + '%';
                clearInterval(timer);
            }
        }, 20);
    }
    //自动切换
    function autoChange() {
        if (changeTimer) {
            return;
        }
        changeTimer = setInterval(function () {
            if (curIndex === options.length - 1) {
                curIndex = 0;
            } else {
                curIndex++;
            }
            setStatus();
        }, changeDuration);
    }
}
