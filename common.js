// --- 1. ファビコン管理 ---
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='53%' font-size='75' text-anchor='middle' dominant-baseline='central'>🤎</text></svg>";
document.getElementsByTagName('head')[0].appendChild(faviconLink);

// --- 2. グローバル音声エンジン (二重再生防止) ---
window.globalAudio = new Audio();
window.currentMusicData = null;
window.currentTrackIdx = 0;

// --- 3. ページ切り替えシステム ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0); 
    }
    // 詳細ページ以外ではミニプレーヤーを表示
    updateMiniPlayerVisibility(viewId);
}

function updateMiniPlayerVisibility(viewId) {
    const mini = document.getElementById('mini-player');
    if (!mini) return;
    // 楽曲詳細ページ(disco-detail-view)にいる時だけミニプレーヤーを隠す（大きい方があるから）
    if (viewId === 'disco-detail-view' || !window.globalAudio.src) {
        mini.classList.remove('visible');
    } else {
        mini.classList.add('visible');
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
                <li><a onclick="showView('home-view'); setTimeout(()=>document.getElementById('news').scrollIntoView({behavior:'smooth'}),100)" style="cursor:pointer;">News</a></li>
                <li><a onclick="showView('home-view'); setTimeout(()=>document.getElementById('profile-anchor').scrollIntoView({behavior:'smooth'}),100)" style="cursor:pointer;">Profile</a></li>
                <li><a onclick="showView('home-view'); setTimeout(()=>document.getElementById('disco-anchor').scrollIntoView({behavior:'smooth'}),100)" style="cursor:pointer;">Discography</a></li>
            </ul>
        </nav>
    </header>
    `;
}

// ミニプレーヤーHTML注入
const body = document.body;
const miniPlayerHTML = `
<div id="mini-player">
    <div class="mini-progress-bg"><div id="mini-progress-bar"></div></div>
    <div class="mini-content">
        <div class="mini-info">
            <img id="mini-jacket" src="" alt="">
            <div class="mini-text">
                <div id="mini-title">Song Title</div>
                <div id="mini-artist">Kiss-U</div>
            </div>
        </div>
        <div class="mini-ctrls">
            <i class="fa-solid fa-play" id="mini-play-btn" onclick="toggleGlobalPlay()"></i>
            <i class="fa-solid fa-xmark" onclick="closeMiniPlayer()" style="font-size:14px; margin-left:15px; opacity:0.5;"></i>
        </div>
    </div>
</div>
`;
body.insertAdjacentHTML('beforeend', miniPlayerHTML);

function toggleGlobalPlay() {
    const btn = document.getElementById('mini-play-btn');
    if (window.globalAudio.paused) {
        window.globalAudio.play();
        btn.className = 'fa-solid fa-pause';
    } else {
        window.globalAudio.pause();
        btn.className = 'fa-solid fa-play';
    }
}

function closeMiniPlayer() {
    window.globalAudio.pause();
    window.globalAudio.src = "";
    document.getElementById('mini-player').classList.remove('visible');
}

// フッター注入
const footerArea = document.getElementById('common-footer');
if (footerArea) {
    footerArea.innerHTML = `<footer><div class="copyright">Copyright &copy; Kiss-U JAPAN. All Rights Reserved.</div></footer>`;
}

// ローディング制御 (index.html用)
window.addEventListener('load', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        setTimeout(() => { loader.classList.add('loaded'); }, 800);
    }
});

// ミニプレーヤーの同期更新
window.globalAudio.ontimeupdate = () => {
    const bar = document.getElementById('mini-progress-bar');
    if (bar && !isNaN(window.globalAudio.duration)) {
        bar.style.width = (window.globalAudio.currentTime / window.globalAudio.duration * 100) + "%";
    }
};