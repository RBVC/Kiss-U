const mountPlayer = (data) => {
    const playerArea = document.getElementById('player-mount');
    if (!playerArea || !data) return;

    playerArea.innerHTML = `
        <div class="player-box">
            <div class="player-top-controls">
                <div class="p-meta"><h2 id="p-title">Select Track</h2><p id="p-album">${data.title}</p></div>
                <div class="seek-bar-container" style="margin-top:20px;">
                    <div class="time-info"><span id="p-curr-time">0:00</span><span id="p-dur-time">0:00</span></div>
                    <input type="range" id="p-seek-bar" value="0">
                </div>
                <div class="player-controls-grid" style="display:flex; justify-content:center; align-items:center; gap:30px;">
                    <i class="fa-solid fa-backward-step" id="p-prev-btn" style="cursor:pointer; font-size:1.5rem;"></i>
                    <i class="fa-solid fa-play" id="p-play-btn" style="cursor:pointer; font-size:3rem;"></i>
                    <i class="fa-solid fa-forward-step" id="p-next-btn" style="cursor:pointer; font-size:1.5rem;"></i>
                </div>
            </div>
            <div class="player-track-list" id="p-track-container"></div>
        </div>
    `;

    const audio = window.globalAudio;
    const playBtn = document.getElementById('p-play-btn');
    const seekBar = document.getElementById('p-seek-bar');
    const trackContainer = document.getElementById('p-track-container');

    data.tracks.forEach((t, i) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.id = `t-${i}`;
        row.innerHTML = `<span>${t.num}. ${t.name}</span>`;
        row.onclick = () => loadTrack(i, true);
        trackContainer.appendChild(row);
    });

    function loadTrack(i, play) {
        window.currentTrackIdx = i;
        window.currentMusicData = data;
        audio.src = data.tracks[i].file;
        document.getElementById('p-title').innerText = data.tracks[i].name;
        
        // ミニプレーヤーの表示更新
        document.getElementById('mini-jacket').src = data.jacket;
        document.getElementById('mini-title').innerText = data.tracks[i].name;
        document.getElementById('mini-artist').innerText = data.title;
        
        document.querySelectorAll('.track-row').forEach(el => el.classList.remove('active'));
        document.getElementById(`t-${i}`).classList.add('active');
        
        if (play) {
            audio.play();
            playBtn.className = 'fa-solid fa-pause';
            document.getElementById('mini-play-btn').className = 'fa-solid fa-pause';
        }
    }

    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.className = 'fa-solid fa-pause';
            document.getElementById('mini-play-btn').className = 'fa-solid fa-pause';
        } else {
            audio.pause();
            playBtn.className = 'fa-solid fa-play';
            document.getElementById('mini-play-btn').className = 'fa-solid fa-play';
        }
    };

    document.getElementById('p-next-btn').onclick = () => {
        if (window.currentTrackIdx < data.tracks.length - 1) loadTrack(window.currentTrackIdx + 1, true);
    };
    document.getElementById('p-prev-btn').onclick = () => {
        if (window.currentTrackIdx > 0) loadTrack(window.currentTrackIdx - 1, true);
    };

    audio.ontimeupdate = () => {
        if(!isNaN(audio.duration)){
            seekBar.value = (audio.currentTime/audio.duration)*100;
            document.getElementById('p-curr-time').innerText = formatTime(audio.currentTime);
            document.getElementById('p-dur-time').innerText = formatTime(audio.duration);
            // ミニ側も同期
            const miniBar = document.getElementById('mini-progress-bar');
            if(miniBar) miniBar.style.width = (audio.currentTime/audio.duration*100) + "%";
        }
    };
    seekBar.oninput = () => audio.currentTime = (seekBar.value/100)*audio.duration;
    function formatTime(s) { const m=Math.floor(s/60); const sec=Math.floor(s%60); return m+":"+(sec<10?"0":"")+sec; }

    loadTrack(0, false);
};