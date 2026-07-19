// --- 1. ファビコン管理 ---
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='53%' font-size='75' text-anchor='middle' dominant-baseline='central'>🤎</text></svg>";
document.getElementsByTagName('head')[0].appendChild(faviconLink);

// --- 2. ページ（View）切り替えシステム ---
// functionで定義することで、どこからでも確実に呼べるようにします
function showView(viewId) {
    console.log("Switching to view:", viewId);
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0); 
    }
}

// ヘッダー注入
const headerArea = document.getElementById('common-header');
if (headerArea) {
    headerArea.innerHTML = `
    <header>
        <div class="logo" onclick="showView('home-view')" style="cursor:pointer;">Kiss-U</div>
        <nav>
            <ul class="nav-links">
                <li><a onclick="showView('news-view')" style="cursor:pointer;">News</a></li>
                <li><a onclick="showView('home-view'); setTimeout(()=>document.getElementById('profile-anchor').scrollIntoView({behavior:'smooth'}),100)" style="cursor:pointer;">Profile</a></li>
                <li><a onclick="showView('home-view'); setTimeout(()=>document.getElementById('disco-anchor').scrollIntoView({behavior:'smooth'}),100)" style="cursor:pointer;">Discography</a></li>
            </ul>
        </nav>
    </header>
    `;
}

// フッター注入
const footerArea = document.getElementById('common-footer');
if (footerArea) {
    footerArea.innerHTML = `<footer><div class="copyright">Copyright &copy; Kiss-U JAPAN. All Rights Reserved.</div></footer>`;
}

// ローディング制御
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) setTimeout(() => { loader.classList.add('loaded'); }, 800);
});