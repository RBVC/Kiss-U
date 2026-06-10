// 共通ヘッダーの注入
const headerArea = document.getElementById('common-header');
if (headerArea) {
    headerArea.innerHTML = `
    <header>
        <a href="index.html" class="logo">Kiss-U</a>
        <nav>
            <ul class="nav-links">
                <li><a href="index.html#news">News</a></li>
                <li><a href="index.html#profile">Profile</a></li>
                <li><a href="index.html#discography">Discography</a></li>
            </ul>
        </nav>
    </header>
    `;
}

// 共通フッターの注入
const footerArea = document.getElementById('common-footer');
if (footerArea) {
    footerArea.innerHTML = `
    <footer>
        <div class="copyright">Copyright &copy; Kiss-U JAPAN. All Rights Reserved.</div>
    </footer>
    `;
}

// ローディング画面の制御（index.htmlに要素がある場合のみ実行）
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 800);
    }
});