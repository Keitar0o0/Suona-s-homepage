// 定义 iUp 对象
var iUp = (function () {
    var time = 0,
        duration = 150;

    // 清除计时器
    var clean = function () {
        time = 0;
    };

    // 元素上移
    var up = function (element) {
        setTimeout(function () {
            element.classList.add("up");
        }, time);
        time += duration;
    };

    // 元素下移
    var down = function (element) {
        element.classList.remove("up");
    };

    // 切换元素的上移状态
    var toggle = function (element) {
        setTimeout(function () {
            element.classList.toggle("up");
        }, time);
        time += duration;
    };

    // 公开的方法
    return {
        clean: clean,
        up: up,
        down: down,
        toggle: toggle
    };
})();

// DOMContentLoaded 事件
document.addEventListener('DOMContentLoaded', function () {
    // 获取元素
    const panel = document.querySelector('#panel');
    const musicHint = document.getElementById('musicHint');

    // 预加载背景图片
    const imgUrl = "assets/media/FlowerDance.gif";
    const img = new Image();
    img.src = imgUrl;
    panel.style.background = `url('${img.src}') center center no-repeat #666`;
    panel.style.backgroundSize = "cover";

    // 定义播放的函数
    function unmuteAudio() {
        const img = new Image();
        img.src = imgUrl + "?1";
        const audio = new Audio();
        audio.src = "assets/media/FlowerDance.mp3";
        audioLoaded = false;
        imgLoaded = false;

        function checkAndPlay() {
            if (imgLoaded && audioLoaded) {
                panel.style.background = `url('${img.src}') center center no-repeat #666`;
                panel.style.backgroundSize = "cover";
                audio.play();
            }
        }

        // 设置音频加载完成后的处理
        audio.oncanplaythrough = function () {
            audioLoaded = true;
            checkAndPlay();
        };

        img.onload = function () {
            imgLoaded = true;
            checkAndPlay();
        };

        // 移除事件监听器，以防止重复触发
        window.removeEventListener('click', unmuteAudio);
        window.removeEventListener('keydown', unmuteAudio);
    }

    // 添加事件监听器
    window.addEventListener('click', unmuteAudio);
    window.addEventListener('keydown', unmuteAudio);

    // 定义隐藏提示信息的函数
    function hideHint() {
        musicHint.style.display = 'none'; // 将提示信息隐藏
    }

    // 添加事件监听器，在用户点击页面时隐藏提示信息
    document.addEventListener('click', hideHint);
    // 添加事件监听器，在用户按下键盘时隐藏提示信息
    document.addEventListener('keydown', hideHint);

    // 获取 shengjing.json 数据
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var shengjing = JSON.parse(this.responseText);
            // 随机选取一句话
            var randomIndex = Math.floor(Math.random() * shengjing.length);
            var randomQuote = shengjing[randomIndex];

            // 显示在网页上
            document.getElementById('description').innerHTML = randomQuote;
        }
    };
    xhr.open("GET", "assets/json/shengjing.json", true);
    xhr.send();

    // 初始化点赞按钮
    var iUpElements = document.querySelectorAll(".iUp");
    iUpElements.forEach(function (element) {
        iUp.up(element);
    });

    // 图片加载完成后显示头像
    var avatarElement = document.querySelector(".js-avatar");
    avatarElement.addEventListener('load', function () {
        avatarElement.classList.add("show");
    });

    // 移动设备菜单按钮点击事件
    var btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');
    var navigationWrapper = document.querySelector('.navigation-wrapper');

    btnMobileMenu.addEventListener('click', function () {
        // 切换菜单可见性
        navigationWrapper.classList.toggle('visible');

        // 切换菜单动画效果
        navigationWrapper.classList.toggle('animated');
        navigationWrapper.classList.toggle('bounceInDown');

        // 切换按钮图标
        btnMobileMenu.classList.toggle('icon-list');
        btnMobileMenu.classList.toggle('icon-angleup');
        btnMobileMenu.classList.toggle('fadeIn');
    });

    // 获取顶部信息的容器元素
    const topInfo = document.getElementById('topInfo');

    // 更新天气信息的函数
    function updateWeather() {
        // 替换成你自己的 OpenWeatherMap API 密钥
        const apiKey = '17c08dfceda44680765ec6003976dbb7';
        const city = 'Anshan'; // 替换成你想要获取天气信息的城市

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`;

        // 发起 API 请求
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络寄了');
                }
                return response.json();
            })
            .then(data => {
                // 处理返回的数据
                console.log('Weather data:', data);
                // 在这里可以根据需要处理返回的天气信息，例如更新页面上的天气信息等
                const weather = data.weather[0].description; // 天气描述信息
                const weatherIcon = data.weather[0].icon; // 天气图标代码
                const weatherInfoElement = document.getElementById('weather-info'); // 获取页面中用于显示天气信息的元素
                // 将天气信息更新到页面中
                weatherInfoElement.innerHTML = `吉吉国天气 ${weather}<img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weather}">`;
            })
            .catch(error => {
                console.error('爆了', error);
            });
    }

    // 更新日期和时间的函数
    function updateDateTime() {
        // 在这里添加更新日期和时间的代码
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const dateTimeElement = document.getElementById('date-time'); // 获取页面中用于显示日期和时间的元素
        // 更新日期和时间到页面中
        dateTimeElement.textContent = `${year} ${month} ${day} ${hour}:${minute}:${second}`;
    }

    // 页面加载完成时执行一次更新日期、时间和天气信息
    window.onload = function () {
        updateDateTime();
        updateWeather();
    };

    // 每隔一秒钟更新一次日期和时间
    setInterval(updateDateTime, 1000); // 1000毫秒 = 1秒钟

    // 每隔一小时更新一次天气信息
    setInterval(updateWeather, 3600000); // 3600000毫秒 = 1小时
});
