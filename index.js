
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

   // ======= 功能 2：真正的无跳转弹窗登录注册逻辑 =======
        window.addEventListener('DOMContentLoaded', () => {
            const userInfoBox = document.getElementById('user-info-box');
            
            // 1. 获取弹窗相关的 DOM 节点
            const loginModal = document.getElementById('login-modal');
            const modalClose = document.getElementById('modal-close');
            const modalTitle = document.getElementById('modal-title');
            const modalSubmitBtn = document.getElementById('modal-submit-btn');
            const modalSwitchText = document.getElementById('modal-switch-text');
            const authUsernameInput = document.getElementById('auth-username');
            const authPasswordInput = document.getElementById('auth-password');

            let currentMode = 'login'; // 标记当前是 'login'(登录) 还是 'register'(注册)

            // 2. 初始状态渲染：判断用户是否已登录
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
                // 💡 核心优化：把 href 改掉，阻止它们跳转页面，而是绑定点击弹窗事件
                userInfoBox.innerHTML = `
                    <a class="link" href="javascript:;" id="nav-login-btn">登录</a>
                    <span class="sep">|</span>
                    <a class="link" href="javascript:;" id="nav-register-btn">注册</a>
                `;

                // 绑定顶栏“登录”按钮
                document.getElementById('nav-login-btn').addEventListener('click', () => {
                    currentMode = 'login';
                    modalTitle.innerText = '用户登录';
                    modalSubmitBtn.innerText = '立即登录';
                    modalSwitchText.innerText = '没有账号？立即注册';
                    loginModal.style.display = 'flex';
                });

                // 绑定顶栏“注册”按钮
                document.getElementById('nav-register-btn').addEventListener('click', () => {
                    currentMode = 'register';
                    modalTitle.innerText = '账号注册';
                    modalSubmitBtn.innerText = '立即注册';
                    modalSwitchText.innerText = '已有账号？去登录';
                    loginModal.style.display = 'flex';
                });
            }

            // 3. 弹窗内部交互逻辑
            modalClose.addEventListener('click', () => { loginModal.style.display = 'none'; }); // 关闭弹窗
            
            // 弹窗底部的“登录/注册”模式切换链接
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

            // 4. 核心功能：点击提交按钮（真正的登录或注册）
            modalSubmitBtn.addEventListener('click', () => {
                const username = authUsernameInput.value.trim();
                const password = authPasswordInput.value.trim();

                if (!username || !password) {
                    alert('账号或密码不能为空！');
                    return;
                }

                if (currentMode === 'register') {
                    // 【真正的注册流程】：把账号密码当成一个对象存进浏览器
                    const userAccount = { user: username, pwd: password };
                    localStorage.setItem('registered_user_' + username, JSON.stringify(userAccount));
                    alert('注册成功！正在切换到登录界面...');
                    
                    // 自动帮用户切到登录模式
                    currentMode = 'login';
                    modalTitle.innerText = '用户登录';
                    modalSubmitBtn.innerText = '立即登录';
                    modalSwitchText.innerText = '没有账号？立即注册';
                    authPasswordInput.value = ''; // 清空密码框
                } else {
                    // 【真正的登录流程】：去浏览器里查找有没有这个账号
                    const localData = localStorage.getItem('registered_user_' + username);
                    if (!localData) {
                        alert('该用户不存在，请先注册！');
                        return;
                    }
                    
                    const parsedAccount = JSON.parse(localData);
                    // 比对密码是否一致
                    if (parsedAccount.pwd === password) {
                        alert('登录成功！欢迎回来');
                        localStorage.setItem('currentUser', username); // 写入登录态
                        loginModal.style.display = 'none';
                        location.reload(); // 刷新页面，让顶栏变身
                    } else {
                        alert('密码错误，登录失败！');
                    }
                }
            });
        });
