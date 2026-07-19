const mountPlayer = (data) => {
    const playerArea = document.getElementById('player-mount');
    if (!playerArea || !data) return;

    playerArea.innerHTML = `
        <div class="player-box">
            <div class="player-top-controls">
                <div class="p-meta">
                    <h2 id="p-title">Loading...</h2>
                    <p id="p-album">${data.title}</p>
                </div>
                <div class="seek-bar-container" style="margin-top:20px;">
                    <div class="time-info">
                        <span id="curr-time">0:00</span>
                        <span id="dur-time">0:00</span>
                    </div>
                    <input type="range" id="seek-bar" value="0">
                </div>
                <div class="player-controls-grid">
                    <!-- 左：音量 -->
                    <div class="grid-left">
                        <i class="fa-solid fa-volume-low" id="mute-btn"></i>
                        <input type="range" id="volume-bar" min="0" max="1" step="0.05" value="0.7">
                    </div>
                    <!-- 中：再生 -->
                    <div class="grid-center">
                        <i class="fa-solid fa-backward-step ctrl-icon" id="prev-btn"></i>
                        <i class="fa-solid fa-play ctrl-icon play-btn-main" id="play-btn"></i>
                        <i class="fa-solid fa-forward-step ctrl-icon" id="next-btn"></i>
                    </div>
                    <!-- 右：シャッフル・リピート -->
                    <div class="grid-right">
                        <i class="fa-solid fa-shuffle ctrl-icon" id="shuffle-btn"></i>
                        <div style="position:relative; display:flex; align-items:center;">
                            <i class="fa-solid fa-repeat ctrl-icon" id="repeat-btn"></i>
                            <span id="repeat-indicator"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="player-track-list" id="track-container"></div>
        </div>
    `;

    // 内部ロジック
    const audio = new Audio();
    const playBtn = document.getElementById('play-btn');
    const seekBar = document.getElementById('seek-bar');
    const repeatIndicator = document.getElementById('repeat-indicator');
    const trackContainer = document.getElementById('track-container');
    const volBar = document.getElementById('volume-bar');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    
    let currentIdx = 0; let isShuffle = false; let repeatMode = 0;

    data.tracks.forEach((t, i) => {
        const row = document.createElement('div'); row.className = 'track-row'; row.id = `t-${i}`;
        row.innerHTML = `<span>${t.num}. ${t.name}</span>`;
        row.onclick = () => loadTrack(i, true); trackContainer.appendChild(row);
    });

    function loadTrack(i, play) {
        currentIdx = i; audio.src = data.tracks[i].file;
        document.getElementById('p-title').innerText = data.tracks[i].name;
        document.querySelectorAll('.track-row').forEach(el => el.classList.remove('active'));
        document.getElementById(`t-${i}`).classList.add('active');
        if (play) { audio.play(); playBtn.className = 'fa-solid fa-pause ctrl-icon play-btn-main'; }
    }

    playBtn.onclick = () => {
        if (audio.paused) { audio.play(); playBtn.className = 'fa-solid fa-pause ctrl-icon play-btn-main'; }
        else { audio.pause(); playBtn.className = 'fa-solid fa-play ctrl-icon play-btn-main'; }
    };

    shuffleBtn.onclick = () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('active', isShuffle); };
    repeatBtn.onclick = () => {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.classList.toggle('active', repeatMode > 0);
        repeatIndicator.innerText = repeatMode === 2 ? '❶' : '';
    };

    document.getElementById('next-btn').onclick = () => {
        let n = isShuffle ? Math.floor(Math.random()*data.tracks.length) : (currentIdx+1)%data.tracks.length;
        loadTrack(n, true);
    };
    document.getElementById('prev-btn').onclick = () => {
        let p = (currentIdx-1+data.tracks.length)%data.tracks.length;
        loadTrack(p, true);
    };

    volBar.oninput = () => { audio.volume = volBar.value; };
    audio.ontimeupdate = () => { if(!isNaN(audio.duration)){ seekBar.value = (audio.currentTime/audio.duration)*100; document.getElementById('curr-time').innerText = formatTime(audio.currentTime); document.getElementById('dur-time').innerText = formatTime(audio.duration); } };
    seekBar.oninput = () => audio.currentTime = (seekBar.value/100)*audio.duration;
    function formatTime(s) { const m=Math.floor(s/60); const sec=Math.floor(s%60); return m+":"+(sec<10?"0":"")+sec; }
    
    audio.onended = () => {
        if(repeatMode===2) loadTrack(currentIdx,true);
        else if(repeatMode===1) document.getElementById('next-btn').click();
        else if(currentIdx < data.tracks.length-1) document.getElementById('next-btn').click();
        else playBtn.className='fa-solid fa-play ctrl-icon play-btn-main';
    };

    loadTrack(0, false);
};