const mountPlayer = (data) => {
    const playerArea = document.getElementById('player-mount');
    if (!playerArea || !data) return;

    // 構造をシンプルに（Prev, Play, Nextのみ）
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
                    <div class="grid-center">
                        <i class="fa-solid fa-backward-step ctrl-icon" id="prev-btn"></i>
                        <i class="fa-solid fa-play ctrl-icon play-btn-main" id="play-btn"></i>
                        <i class="fa-solid fa-forward-step ctrl-icon" id="next-btn"></i>
                    </div>
                </div>
            </div>
            <div class="player-track-list" id="track-container"></div>
        </div>
    `;

    const audio = new Audio();
    const playBtn = document.getElementById('play-btn');
    const seekBar = document.getElementById('seek-bar');
    const trackContainer = document.getElementById('track-container');
    let currentIdx = 0;

    data.tracks.forEach((t, i) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.id = `t-${i}`;
        row.innerHTML = `<span>${t.num}. ${t.name}</span>`;
        row.onclick = () => loadTrack(i, true);
        trackContainer.appendChild(row);
    });

    function loadTrack(i, play) {
        currentIdx = i;
        audio.src = data.tracks[i].file;
        document.getElementById('p-title').innerText = data.tracks[i].name;
        document.querySelectorAll('.track-row').forEach(el => el.classList.remove('active'));
        document.getElementById(`t-${i}`).classList.add('active');
        if (play) {
            audio.play();
            playBtn.className = 'fa-solid fa-pause ctrl-icon play-btn-main';
        }
    }

    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.className = 'fa-solid fa-pause ctrl-icon play-btn-main';
        } else {
            audio.pause();
            playBtn.className = 'fa-solid fa-play ctrl-icon play-btn-main';
        }
    };

    document.getElementById('next-btn').onclick = () => {
        if (currentIdx < data.tracks.length - 1) {
            loadTrack(currentIdx + 1, true);
        } else {
            // 最後なら停止
            audio.pause();
            playBtn.className = 'fa-solid fa-play ctrl-icon play-btn-main';
        }
    };

    document.getElementById('prev-btn').onclick = () => {
        let p = (currentIdx - 1 + data.tracks.length) % data.tracks.length;
        loadTrack(p, true);
    };

    audio.ontimeupdate = () => {
        if (!isNaN(audio.duration)) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
            document.getElementById('curr-time').innerText = formatTime(audio.currentTime);
            document.getElementById('dur-time').innerText = formatTime(audio.duration);
        }
    };

    seekBar.oninput = () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    };

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ":" + (sec < 10 ? "0" : "") + sec;
    }

    audio.onended = () => {
        // 自動で次へ行かず、停止する設定（リピートなし）
        playBtn.className = 'fa-solid fa-play ctrl-icon play-btn-main';
    };

    loadTrack(0, false);
};