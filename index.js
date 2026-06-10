// ======= 功能 1：简单的轮播图切换逻辑 =======
const slides = document.querySelectorAll('.slider-slide');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.slider-arrow.next');
const prevBtn = document.querySelector('.slider-arrow.prev');
let currentIndex = 0;

function changeSlide(index) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

nextBtn.addEventListener('click', () => changeSlide(currentIndex + 1));
prevBtn.addEventListener('click', () => changeSlide(currentIndex - 1));
// 自动轮播
setInterval(() => changeSlide(currentIndex + 1), 4000);

// ======= 功能 2：无跳转弹窗登录注册逻辑 =======
window.addEventListener('DOMContentLoaded', () => {
    const userInfoBox = document.getElementById('user-info-box');

    const loginModal = document.getElementById('login-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalSubmitBtn = document.getElementById('modal-submit-btn');
    const modalSwitchText = document.getElementById('modal-switch-text');
    const authUsernameInput = document.getElementById('auth-username');
    const authPasswordInput = document.getElementById('auth-password');

    let currentMode = 'login';

    // 检查是否已经登录
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        userInfoBox.innerHTML = `
            <span style="color: #ff6700; font-weight: bold;">欢迎你，${loggedInUser}</span>
            <span class="sep">|</span>
            <a class="link" href="#" id="logout-btn">退出登录</a>
        `;
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload();
        });
    } else {
        userInfoBox.innerHTML = `
            <a class="link" href="javascript:;" id="nav-login-btn">登录</a>
            <span class="sep">|</span>
            <a class="link" href="javascript:;" id="nav-register-btn">注册</a>
        `;

        document.getElementById('nav-login-btn').addEventListener('click', () => {
            currentMode = 'login';
            modalTitle.innerText = '用户登录';
            modalSubmitBtn.innerText = '立即登录';
            modalSwitchText.innerText = '没有账号？立即注册';
            loginModal.style.display = 'flex';
        });

        document.getElementById('nav-register-btn').addEventListener('click', () => {
            currentMode = 'register';
            modalTitle.innerText = '账号注册';
            modalSubmitBtn.innerText = '立即注册';
            modalSwitchText.innerText = '已有账号？去登录';
            loginModal.style.display = 'flex';
        });
    }

    modalClose.addEventListener('click', () => { loginModal.style.display = 'none'; });

    modalSwitchText.addEventListener('click', () => {
        if (currentMode === 'login') {
            currentMode = 'register';
            modalTitle.innerText = '账号注册';
            modalSubmitBtn.innerText = '立即注册';
            modalSwitchText.innerText = '已有账号？去登录';
        } else {
            currentMode = 'login';
            modalTitle.innerText = '用户登录';
            modalSubmitBtn.innerText = '立即登录';
            modalSwitchText.innerText = '没有账号？立即注册';
        }
    });

    modalSubmitBtn.addEventListener('click', () => {
        const username = authUsernameInput.value.trim();
        const password = authPasswordInput.value.trim();

        if (!username || !password) {
            alert('账号或密码不能为空！');
            return;
        }

        if (currentMode === 'register') {
            const userAccount = { user: username, pwd: password };
            localStorage.setItem('registered_user_' + username, JSON.stringify(userAccount));
            alert('注册成功！正在切换到登录界面...');
            currentMode = 'login';
            modalTitle.innerText = '用户登录';
            modalSubmitBtn.innerText = '立即登录';
            modalSwitchText.innerText = '没有账号？立即注册';
            authPasswordInput.value = '';
        } else {
            const localData = localStorage.getItem('registered_user_' + username);
            if (!localData) {
                alert('该用户不存在，请先注册！');
                return;
            }
            const parsedAccount = JSON.parse(localData);
            if (parsedAccount.pwd === password) {
                alert('登录成功！欢迎回来');
                localStorage.setItem('currentUser', username);
                loginModal.style.display = 'none';
                location.reload();
            } else {
                alert('密码错误，登录失败！');
            }
        }
    });

    // ======= 功能 3：加入购物车逻辑 =======
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    addCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const goodsItem = e.target.closest('.goods-item');
            if (!goodsItem) return alert('商品格子未找到！');

            // 获取商品信息
            const goodsInfo = {
                name: goodsItem.dataset.name,
                price: goodsItem.dataset.price,
                img: goodsItem.dataset.img
            };

            if (!goodsInfo.name || !goodsInfo.price || !goodsInfo.img) {
                return alert('商品信息不完整，无法加入购物车！');
            }

            // 读取已有购物车
            let cart = JSON.parse(localStorage.getItem('my_center_cart')) || [];
            cart.push(goodsInfo);
            localStorage.setItem('my_center_cart', JSON.stringify(cart));

     alert(`${goodsInfo.name} 已加入购物车！`);
        });
    });
});
