// --- 1. ファビコン（🤎）の自動注入 ---
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
// 絵文字がど真ん中に来るようにSVGで調整（font-sizeを少し下げて余白を確保）
faviconLink.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='53%' font-size='75' text-anchor='middle' dominant-baseline='central'>🤎</text></svg>";
document.getElementsByTagName('head')[0].appendChild(faviconLink);

// --- 2. 共通ヘッダーの注入 ---
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

// --- 3. 共通フッターの注入 ---
const footerArea = document.getElementById('common-footer');
if (footerArea) {
    footerArea.innerHTML = `
    <footer>
        <div class="copyright">Copyright &copy; Kiss-U JAPAN. All Rights Reserved.</div>
    </footer>
    `;
}

// --- 4. ローディング制御 ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        setTimeout(() => { loader.classList.add('loaded'); }, 800);
    }
});