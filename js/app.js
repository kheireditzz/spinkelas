/**
 * SPINKELAS · LUCKY WHEEL (MOBILE DEDICATED)
 * Bersih tanpa keterangan, tanpa emoji petir, responsif layar mobile.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DAFTAR 29 PESERTA (MURNI NAMA TANPA KETERANGAN)
  // =========================================================================
  const DEFAULT_PARTICIPANTS = [
    { id: 1, name: "M Rizki", active: true },
    { id: 2, name: "Abdul Samad", active: true },
    { id: 3, name: "M Azis", active: true },
    { id: 4, name: "Yusrizal", active: true },
    { id: 5, name: "Al fathir", active: true },
    { id: 6, name: "M Rizki Al fatan", active: true },
    { id: 7, name: "Husni Mubarak", active: true },
    { id: 8, name: "M Riski permata", active: true },
    { id: 9, name: "Jundi Hafizallah", active: true },
    { id: 10, name: "Arfatur", active: true },
    { id: 11, name: "zikri", active: true },
    { id: 12, name: "Anam", active: true },
    { id: 13, name: "Ramadhan", active: true },
    { id: 14, name: "syauqi", active: true },
    { id: 15, name: "Zunuwanis", active: true },
    { id: 16, name: "Raisul Ahsan", active: true },
    { id: 17, name: "Muammar", active: true },
    { id: 18, name: "M Rasya Arrida", active: true },
    { id: 19, name: "Harisul Akmal", active: true },
    { id: 20, name: "Rifqi Maulana", active: true },
    { id: 21, name: "Muhammad Ibral", active: true },
    { id: 22, name: "Zainal Mubarraq", active: true },
    { id: 23, name: "faizul", active: true },
    { id: 24, name: "Santer", active: true },
    { id: 25, name: "Fairuzi Ramadhan", active: true },
    { id: 26, name: "Khusairi", active: true },
    { id: 27, name: "Saibatul Safri", active: true },
    { id: 28, name: "m. Ravva", active: true },
    { id: 29, name: "m. Syafi’i", active: true }
  ];

  // Palette warna segmen (Vibrant modern theme)
  const SLICE_COLORS = [
    { bg: '#2563EB', text: '#FFFFFF' }, // Electric Blue
    { bg: '#0D9488', text: '#FFFFFF' }, // Teal
    { bg: '#D97706', text: '#FFFFFF' }, // Amber Gold
    { bg: '#7C3AED', text: '#FFFFFF' }, // Purple
    { bg: '#E11D48', text: '#FFFFFF' }, // Crimson
    { bg: '#0284C7', text: '#FFFFFF' }, // Sky Blue
    { bg: '#059669', text: '#FFFFFF' }, // Emerald
    { bg: '#EA580C', text: '#FFFFFF' }, // Vivid Orange
    { bg: '#4F46E5', text: '#FFFFFF' }, // Indigo
    { bg: '#9333EA', text: '#FFFFFF' }, // Fuchsia
    { bg: '#16A34A', text: '#FFFFFF' }, // Fresh Green
    { bg: '#C026D3', text: '#FFFFFF' }  // Magenta
  ];

  // =========================================================================
  // 2. STATE & STORAGE
  // =========================================================================
  const STORAGE_KEYS = {
    PARTICIPANTS: 'spinkelas_v1_names',
    HISTORY: 'spinkelas_v1_history',
    SETTINGS: 'spinkelas_v1_settings'
  };

  let participants = [];
  let historyList = [];
  let settings = {
    duration: 5000,
    sound: true,
    autoEliminate: false
  };

  let isSpinning = false;
  let currentWheelAngle = 0;
  let animFrameId = null;
  let lastSliceTickIndex = -1;
  let lastSelectedWinner = null;

  // DOM Elements
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const pointerEl = document.getElementById('wheelPointer');
  const btnMainSpin = document.getElementById('btnMainSpin');
  const btnCenterSpin = document.getElementById('btnCenterSpin');
  const spinDurationSelect = document.getElementById('spinDurationSelect');
  const checkAutoEliminate = document.getElementById('checkAutoEliminate');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const btnFullscreen = document.getElementById('btnFullscreen');

  // Stats
  const statActiveCount = document.getElementById('statActiveCount');
  const statTotalSpins = document.getElementById('statTotalSpins');
  const statLastWinner = document.getElementById('statLastWinner');

  // Datetime
  const liveClock = document.getElementById('liveClock');
  const liveDate = document.getElementById('liveDate');

  // History & Peserta DOM
  const historyListEl = document.getElementById('historyList');
  const historyEmptyEl = document.getElementById('historyEmpty');
  const badgeRiwayatCount = document.getElementById('badgeRiwayatCount');
  const searchRiwayat = document.getElementById('searchRiwayat');
  const btnCopyHistory = document.getElementById('btnCopyHistory');
  const btnExportTxt = document.getElementById('btnExportTxt');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnClearHistory = document.getElementById('btnClearHistory');

  const pesertaListEl = document.getElementById('pesertaList');
  const badgePesertaCount = document.getElementById('badgePesertaCount');
  const searchPeserta = document.getElementById('searchPeserta');
  const btnSelectAll = document.getElementById('btnSelectAll');
  const btnUnselectAll = document.getElementById('btnUnselectAll');
  const btnResetDefault = document.getElementById('btnResetDefault');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');

  // Modal Winner
  const winnerModalOverlay = document.getElementById('winnerModalOverlay');
  const winRoundNum = document.getElementById('winRoundNum');
  const winParticipantName = document.getElementById('winParticipantName');
  const winDate = document.getElementById('winDate');
  const winTime = document.getElementById('winTime');
  const btnEliminateWinner = document.getElementById('btnEliminateWinner');
  const btnSpinAgainFromModal = document.getElementById('btnSpinAgainFromModal');
  const btnCloseWinnerModal = document.getElementById('btnCloseWinnerModal');

  // Modal Peserta Form
  const pesertaModalOverlay = document.getElementById('pesertaModalOverlay');
  const pesertaModalTitle = document.getElementById('pesertaModalTitle');
  const btnClosePesertaModal = document.getElementById('btnClosePesertaModal');
  const btnCancelPeserta = document.getElementById('btnCancelPeserta');
  const pesertaForm = document.getElementById('pesertaForm');
  const editPesertaId = document.getElementById('editPesertaId');
  const inputPesertaName = document.getElementById('inputPesertaName');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // =========================================================================
  // 3. AUDIO ENGINE (WEB AUDIO API)
  // =========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTickSound() {
    if (!settings.sound) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650 + Math.random() * 120, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  function playWinSound() {
    if (!settings.sound) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.45);
      });
    } catch (e) {}
  }

  // =========================================================================
  // 4. CONFETTI ENGINE
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerConfetti() {
    confettiParticles = [];
    const colors = ['#3B82F6', '#60A5FA', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#FBBF24', '#06B6D4'];
    const count = 120;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 160,
        y: window.innerHeight * 0.35,
        w: Math.random() * 8 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 5,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3,
        alpha: 1,
        fadeSpeed: 0.004 + Math.random() * 0.003
      });
    }
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    animateConfetti();
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.rSpeed;
      p.alpha -= p.fadeSpeed;

      confCtx.save();
      confCtx.translate(p.x, p.y);
      confCtx.rotate((p.rotation * Math.PI) / 180);
      confCtx.fillStyle = p.color;
      confCtx.globalAlpha = Math.max(0, p.alpha);
      confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confCtx.restore();
    }
    if (alive) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // =========================================================================
  // 5. STORAGE LOAD & SAVE
  // =========================================================================
  function loadStorage() {
    try {
      const savedParticipants = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      if (savedParticipants) {
        participants = JSON.parse(savedParticipants);
      } else {
        participants = JSON.parse(JSON.stringify(DEFAULT_PARTICIPANTS));
      }

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (savedHistory) {
        historyList = JSON.parse(savedHistory);
      } else {
        historyList = [];
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        settings = Object.assign(settings, JSON.parse(savedSettings));
      }
    } catch (e) {
      participants = JSON.parse(JSON.stringify(DEFAULT_PARTICIPANTS));
      historyList = [];
    }
  }

  function saveParticipants() {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyList));
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // =========================================================================
  // 6. REALTIME CLOCK & DATE
  // =========================================================================
  function updateLiveDateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    liveClock.innerHTML = `${hours}:${minutes}:${seconds} <span class="tz">WIB</span>`;

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    liveDate.textContent = `${dayName}, ${dateNum} ${monthName} ${year}`;
  }
  setInterval(updateLiveDateTime, 1000);
  updateLiveDateTime();

  // =========================================================================
  // 7. CANVAS WHEEL RENDERING (BERSIH HANYA NAMA)
  // =========================================================================
  function getActiveParticipants() {
    return participants.filter(p => p.active);
  }

  function drawWheel() {
    const active = getActiveParticipants();
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    if (active.length === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#1E293B';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 22px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Tidak Ada Peserta Aktif', centerX, centerY - 10);
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Pilih nama di tab Peserta', centerX, centerY + 18);
      ctx.restore();
      return;
    }

    const numSlices = active.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    // Outer Glow & Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 8;
    ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.restore();

    // Slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentWheelAngle);

    for (let i = 0; i < numSlices; i++) {
      const p = active[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const colorScheme = SLICE_COLORS[i % SLICE_COLORS.length];

      // Draw Slice Wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius);
      grad.addColorStop(0, colorScheme.bg);
      grad.addColorStop(1, adjustColorBrightness(colorScheme.bg, -25));
      ctx.fillStyle = grad;
      ctx.fill();

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Slice Text (Murni Nama Tanpa Keterangan)
      ctx.save();
      const bisector = startAngle + sliceAngle / 2;
      ctx.rotate(bisector);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colorScheme.text;

      let fontSize = 15;
      if (numSlices > 24) fontSize = 12;
      else if (numSlices > 16) fontSize = 13.5;

      ctx.font = `bold ${fontSize}px "Outfit", sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 3;

      let displayName = p.name;
      const maxTextWidth = radius - 75;
      if (ctx.measureText(displayName).width > maxTextWidth) {
        while (displayName.length > 3 && ctx.measureText(displayName + '..').width > maxTextWidth) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '..';
      }

      ctx.fillText(displayName, radius - 20, 0);
      ctx.restore();
    }

    // Outer Rim Studs
    const pegCount = Math.max(numSlices * 2, 24);
    const pegRadius = radius + 3;
    for (let k = 0; k < pegCount; k++) {
      const angle = (k * 2 * Math.PI) / pegCount;
      const px = Math.cos(angle) * pegRadius;
      const py = Math.sin(angle) * pegRadius;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FEF08A';
      ctx.fill();
    }

    ctx.restore(); // Restore rotate & translate

    // Center Hub Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  function adjustColorBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // =========================================================================
  // 8. SPIN PHYSICS & ROTATION ENGINE
  // =========================================================================
  function spinWheel() {
    if (isSpinning) return;
    const active = getActiveParticipants();
    if (active.length === 0) {
      showCustomConfirm({
        title: 'Peserta Kosong',
        message: 'Tidak ada peserta aktif! Silakan pilih nama di tab Peserta.',
        cancelText: '',
        confirmText: 'Mengerti',
        type: 'info'
      });
      return;
    }

    initAudio();
    isSpinning = true;
    btnMainSpin.disabled = true;
    btnCenterSpin.disabled = true;

    // Random winner pick
    let winnerIndex = 0;
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      winnerIndex = arr[0] % active.length;
    } else {
      winnerIndex = Math.floor(Math.random() * active.length);
    }
    const chosenWinner = active[winnerIndex];
    lastSelectedWinner = chosenWinner;

    // Angle calculation: Pointer at top (-PI/2)
    const numSlices = active.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const pointerAngle = -Math.PI / 2;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.4;
    
    const normalizedCurrent = ((currentWheelAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let targetRelative = (pointerAngle - ((winnerIndex + 0.5) * sliceAngle + jitter)) % (2 * Math.PI);
    if (targetRelative < 0) targetRelative += 2 * Math.PI;

    const fullTurns = 6 + Math.floor(Math.random() * 3);
    const startAngle = currentWheelAngle;
    const totalRotationNeeded = (fullTurns * 2 * Math.PI) + (targetRelative - normalizedCurrent);
    const finalAngle = startAngle + (totalRotationNeeded > 0 ? totalRotationNeeded : totalRotationNeeded + 2 * Math.PI);

    const startTime = performance.now();
    const duration = parseInt(settings.duration, 10) || 5000;
    lastSliceTickIndex = -1;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth Quintic Easing Out
      const ease = 1 - Math.pow(1 - progress, 5);
      currentWheelAngle = startAngle + (finalAngle - startAngle) * ease;

      const angleUnderPointer = (((pointerAngle - currentWheelAngle) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSliceIdx = Math.floor(angleUnderPointer / sliceAngle);
      if (currentSliceIdx !== lastSliceTickIndex) {
        lastSliceTickIndex = currentSliceIdx;
        triggerPointerTick();
      }

      drawWheel();

      if (progress < 1) {
        animFrameId = requestAnimationFrame(animate);
      } else {
        currentWheelAngle = finalAngle;
        drawWheel();
        isSpinning = false;
        btnMainSpin.disabled = false;
        btnCenterSpin.disabled = false;
        onSpinComplete(chosenWinner);
      }
    }

    animFrameId = requestAnimationFrame(animate);
  }

  function triggerPointerTick() {
    playTickSound();
    pointerEl.classList.remove('wobble');
    void pointerEl.offsetWidth;
    pointerEl.classList.add('wobble');
  }

  // =========================================================================
  // 9. ON SPIN COMPLETE & WINNER CELEBRATION
  // =========================================================================
  function onSpinComplete(winner) {
    playWinSound();
    triggerConfetti();

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayStr = days[now.getDay()];
    const dateStr = `${dayStr}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WIB`;

    const roundNumber = historyList.length + 1;
    const historyItem = {
      id: Date.now(),
      round: roundNumber,
      winnerId: winner.id,
      name: winner.name,
      dateStr: dateStr,
      timeStr: timeStr,
      timestamp: now.getTime()
    };

    historyList.unshift(historyItem);
    saveHistory();
    renderHistory();
    updateStats();

    if (settings.autoEliminate) {
      eliminateParticipant(winner.id, false);
    }

    showWinnerModal(historyItem);
  }

  function showWinnerModal(item) {
    winRoundNum.textContent = `#${item.round}`;
    winParticipantName.textContent = item.name;
    winDate.textContent = item.dateStr;
    winTime.textContent = item.timeStr;
    winnerModalOverlay.classList.add('show');
  }

  function closeWinnerModal() {
    winnerModalOverlay.classList.remove('show');
  }

  function eliminateParticipant(participantId, alertUser = true) {
    const p = participants.find(item => item.id === participantId);
    if (p) {
      p.active = false;
      saveParticipants();
      renderPesertaList();
      updateStats();
      drawWheel();
      if (alertUser) {
        closeWinnerModal();
      }
    }
  }

  // =========================================================================
  // 10. STATS & UI UPDATES
  // =========================================================================
  function updateStats() {
    const active = getActiveParticipants();
    statActiveCount.textContent = `${active.length}/${participants.length}`;
    badgePesertaCount.textContent = active.length;
    statTotalSpins.textContent = historyList.length;
    badgeRiwayatCount.textContent = historyList.length;

    if (historyList.length > 0) {
      const last = historyList[0];
      statLastWinner.textContent = last.name;
    } else {
      statLastWinner.textContent = '-';
    }
  }

  // =========================================================================
  // 11. RENDER DAFTAR PESERTA (BERSIH HANYA NAMA)
  // =========================================================================
  function renderPesertaList() {
    const query = (searchPeserta.value || '').toLowerCase().trim();
    pesertaListEl.innerHTML = '';

    const filtered = participants.filter(p => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      pesertaListEl.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; color: var(--text-muted); font-size: 12px;">
          Tidak ditemukan nama "${escapeHtml(query)}"
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const row = document.createElement('div');
      row.className = `peserta-row ${p.active ? '' : 'inactive'}`;

      row.innerHTML = `
        <div class="col-check">
          <input type="checkbox" data-id="${p.id}" ${p.active ? 'checked' : ''} title="Aktifkan/Nonaktifkan">
        </div>
        <div class="col-num">${p.id}</div>
        <div class="col-name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</div>
        <div class="col-action">
          <button class="btn-card-action btn-edit-peserta" data-id="${p.id}" title="Edit">✏️</button>
          <button class="btn-card-action btn-del-peserta" data-id="${p.id}" title="Hapus">🗑️</button>
        </div>
      `;

      // Checkbox toggle
      row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
        p.active = e.target.checked;
        saveParticipants();
        updateStats();
        drawWheel();
        if (p.active) row.classList.remove('inactive');
        else row.classList.add('inactive');
      });

      // Edit
      row.querySelector('.btn-edit-peserta').addEventListener('click', () => {
        openEditPesertaModal(p);
      });

      // Delete
      row.querySelector('.btn-del-peserta').addEventListener('click', async () => {
        const ok = await showCustomConfirm({
          title: 'Hapus Peserta',
          message: `Apakah Anda yakin ingin menghapus "${p.name}" dari daftar?`,
          type: 'danger',
          confirmText: 'Ya, Hapus',
          cancelText: 'Batal'
        });
        if (ok) {
          participants = participants.filter(item => item.id !== p.id);
          saveParticipants();
          renderPesertaList();
          updateStats();
          drawWheel();
          showToast(`"${p.name}" berhasil dihapus`, '🗑️');
        }
      });

      pesertaListEl.appendChild(row);
    });
  }

  // =========================================================================
  // 12. RENDER RIWAYAT PUTARAN (BERSIH HANYA NAMA)
  // =========================================================================
  function renderHistory() {
    const query = (searchRiwayat.value || '').toLowerCase().trim();
    historyListEl.innerHTML = '';

    const filtered = historyList.filter(item => {
      if (!query) return true;
      return item.name.toLowerCase().includes(query) || String(item.round).includes(query);
    });

    if (historyList.length === 0) {
      historyEmptyEl.style.display = 'flex';
      historyListEl.style.display = 'none';
      return;
    } else {
      historyEmptyEl.style.display = 'none';
      historyListEl.style.display = 'flex';
    }

    if (filtered.length === 0) {
      historyListEl.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; color: var(--text-muted); font-size: 12px;">
          Tidak ada riwayat untuk "${escapeHtml(query)}"
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <div class="history-card-left">
          <span class="round-tag">#${item.round}</span>
          <div style="min-width: 0;">
            <div class="history-user-name">${escapeHtml(item.name)}</div>
            <div class="history-time-meta">
              <span>${item.dateStr} • </span><span class="time-highlight">${item.timeStr}</span>
            </div>
          </div>
        </div>
        <div class="history-card-actions">
          <button class="btn-card-action btn-copy-card" title="Salin">📋</button>
          <button class="btn-card-action btn-del-card" title="Hapus">✕</button>
        </div>
      `;

      card.querySelector('.btn-copy-card').addEventListener('click', () => {
        const text = `Putaran #${item.round}: ${item.name} (${item.dateStr} ${item.timeStr})`;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Disalin: ${item.name}`, '📋');
        });
      });

      card.querySelector('.btn-del-card').addEventListener('click', () => {
        historyList = historyList.filter(h => h.id !== item.id);
        saveHistory();
        renderHistory();
        updateStats();
      });

      historyListEl.appendChild(card);
    });
  }

  // =========================================================================
  // 13. PESERTA ADD / EDIT
  // =========================================================================
  function openAddPesertaModal() {
    pesertaModalTitle.textContent = 'Tambah Peserta';
    editPesertaId.value = '';
    inputPesertaName.value = '';
    pesertaModalOverlay.classList.add('show');
    inputPesertaName.focus();
  }

  function openEditPesertaModal(p) {
    pesertaModalTitle.textContent = `Edit Peserta #${p.id}`;
    editPesertaId.value = p.id;
    inputPesertaName.value = p.name;
    pesertaModalOverlay.classList.add('show');
    inputPesertaName.focus();
  }

  function closePesertaModal() {
    pesertaModalOverlay.classList.remove('show');
  }

  pesertaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputPesertaName.value.trim();
    if (!name) return;

    const idStr = editPesertaId.value;
    if (idStr) {
      const id = parseInt(idStr, 10);
      const target = participants.find(p => p.id === id);
      if (target) {
        target.name = name;
      }
    } else {
      const nextId = participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1;
      participants.push({
        id: nextId,
        name: name,
        active: true
      });
    }

    saveParticipants();
    renderPesertaList();
    updateStats();
    drawWheel();
    closePesertaModal();
  });

  // =========================================================================
  // 14. CUSTOM MODAL CONFIRMATION & TOAST NOTIFICATION
  // =========================================================================
  function showToast(message, icon = '✓') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 320);
    }, 2000);
  }

  function showCustomConfirm({
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'warning'
  }) {
    return new Promise((resolve) => {
      const overlay = document.getElementById('confirmModalOverlay');
      const titleEl = document.getElementById('confirmTitle');
      const msgEl = document.getElementById('confirmMessage');
      const iconBox = document.getElementById('confirmIconBox');
      const iconEl = document.getElementById('confirmIcon');
      const btnOk = document.getElementById('btnConfirmOk');
      const btnCancel = document.getElementById('btnConfirmCancel');
      const actions = document.getElementById('confirmActions');

      titleEl.textContent = title;
      msgEl.textContent = message;
      btnOk.textContent = confirmText;
      btnCancel.textContent = cancelText;

      iconBox.className = `confirm-icon-box type-${type}`;
      btnOk.className = `btn-confirm-ok ${type}`;

      if (cancelText && cancelText.trim() !== '') {
        btnCancel.style.display = 'inline-block';
        actions.classList.remove('single-btn');
      } else {
        btnCancel.style.display = 'none';
        actions.classList.add('single-btn');
      }

      if (type === 'danger') iconEl.textContent = '🗑️';
      else if (type === 'warning') iconEl.textContent = '⚠️';
      else iconEl.textContent = 'ℹ️';

      overlay.classList.add('show');

      function cleanup(result) {
        overlay.classList.remove('show');
        btnOk.removeEventListener('click', onOk);
        btnCancel.removeEventListener('click', onCancel);
        resolve(result);
      }

      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }

      btnOk.addEventListener('click', onOk);
      btnCancel.addEventListener('click', onCancel);
    });
  }

  // =========================================================================
  // 15. EXPORT & ACTIONS
  // =========================================================================
  function copyAllHistory() {
    if (historyList.length === 0) {
      showToast('Belum ada riwayat putaran', 'ℹ️');
      return;
    }
    let text = `=== RIWAYAT UNDIAN SPIN ===\n`;
    historyList.forEach(item => {
      text += `Putaran #${item.round}: ${item.name} - ${item.dateStr} ${item.timeStr}\n`;
    });
    navigator.clipboard.writeText(text).then(() => {
      showToast('Semua riwayat berhasil disalin!', '📋');
    });
  }

  function exportTxt() {
    if (historyList.length === 0) {
      showToast('Belum ada riwayat untuk diunduh', 'ℹ️');
      return;
    }
    let text = `=== RIWAYAT UNDIAN SPIN ===\n\n`;
    historyList.forEach(item => {
      text += `Putaran #${item.round} : ${item.name} (${item.dateStr} • ${item.timeStr})\n`;
    });
    downloadFile(text, `riwayat_spin_${Date.now()}.txt`, 'text/plain');
    showToast('File teks berhasil diunduh', '📄');
  }

  function exportCsv() {
    if (historyList.length === 0) {
      showToast('Belum ada riwayat untuk diunduh', 'ℹ️');
      return;
    }
    let csv = `Putaran,Nama Pemenang,Tanggal,Waktu\n`;
    historyList.forEach(item => {
      const cleanName = `"${item.name.replace(/"/g, '""')}"`;
      csv += `${item.round},${cleanName},"${item.dateStr}","${item.timeStr}"\n`;
    });
    downloadFile(csv, `riwayat_spin_${Date.now()}.csv`, 'text/csv');
    showToast('File CSV berhasil diunduh', '📊');
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function clearAllHistory() {
    if (historyList.length === 0) return;
    const ok = await showCustomConfirm({
      title: 'Hapus Semua Riwayat',
      message: 'Apakah Anda yakin ingin menghapus seluruh riwayat putaran? Tindakan ini permanen.',
      type: 'danger',
      confirmText: 'Ya, Hapus Semua',
      cancelText: 'Batal'
    });
    if (ok) {
      historyList = [];
      saveHistory();
      renderHistory();
      updateStats();
      showToast('Semua riwayat berhasil dihapus', '🗑️');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 15. INIT
  // =========================================================================
  function init() {
    loadStorage();

    spinDurationSelect.value = settings.duration;
    checkAutoEliminate.checked = settings.autoEliminate;
    soundIcon.textContent = settings.sound ? '🔊' : '🔇';

    renderPesertaList();
    renderHistory();
    updateStats();
    drawWheel();

    // Spin events
    btnMainSpin.addEventListener('click', spinWheel);
    btnCenterSpin.addEventListener('click', spinWheel);

    spinDurationSelect.addEventListener('change', (e) => {
      settings.duration = parseInt(e.target.value, 10);
      saveSettings();
    });

    checkAutoEliminate.addEventListener('change', (e) => {
      settings.autoEliminate = e.target.checked;
      saveSettings();
    });

    btnSoundToggle.addEventListener('click', () => {
      settings.sound = !settings.sound;
      soundIcon.textContent = settings.sound ? '🔊' : '🔇';
      saveSettings();
      if (settings.sound) playTickSound();
    });

    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Winner modal events
    btnCloseWinnerModal.addEventListener('click', closeWinnerModal);
    btnSpinAgainFromModal.addEventListener('click', () => {
      closeWinnerModal();
      setTimeout(spinWheel, 300);
    });
    if (btnEliminateWinner) {
      btnEliminateWinner.addEventListener('click', () => {
        if (lastSelectedWinner) {
          eliminateParticipant(lastSelectedWinner.id, true);
        }
      });
    }

    // Modal Peserta
    btnOpenAddModal.addEventListener('click', openAddPesertaModal);
    btnClosePesertaModal.addEventListener('click', closePesertaModal);
    btnCancelPeserta.addEventListener('click', closePesertaModal);

    // Batch buttons
    btnSelectAll.addEventListener('click', () => {
      participants.forEach(p => p.active = true);
      saveParticipants();
      renderPesertaList();
      updateStats();
      drawWheel();
    });

    btnUnselectAll.addEventListener('click', () => {
      participants.forEach(p => p.active = false);
      saveParticipants();
      renderPesertaList();
      updateStats();
      drawWheel();
    });

    btnResetDefault.addEventListener('click', async () => {
      const ok = await showCustomConfirm({
        title: 'Reset 29 Peserta',
        message: 'Kembalikan daftar ke 29 nama peserta awal? Semua penyesuaian akan direset.',
        type: 'warning',
        confirmText: 'Ya, Reset',
        cancelText: 'Batal'
      });
      if (ok) {
        participants = JSON.parse(JSON.stringify(DEFAULT_PARTICIPANTS));
        saveParticipants();
        renderPesertaList();
        updateStats();
        drawWheel();
        showToast('Daftar direset ke 29 peserta awal', '✓');
      }
    });

    searchPeserta.addEventListener('input', renderPesertaList);
    searchRiwayat.addEventListener('input', renderHistory);

    btnCopyHistory.addEventListener('click', copyAllHistory);
    btnExportTxt.addEventListener('click', exportTxt);
    btnExportCsv.addEventListener('click', exportCsv);
    btnClearHistory.addEventListener('click', clearAllHistory);

    // Tab buttons
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });

    window.addEventListener('resize', drawWheel);

    // Jalankan Animasi Awal (Splash Intro)
    handleIntroSplash();
  }

  // =========================================================================
  // 16. ANIMASI AWAL SPLASH INTRO & PREVIEW WHEEL
  // =========================================================================
  function handleIntroSplash() {
    const splash = document.getElementById('appSplashScreen');
    if (!splash) return;

    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        runWheelIntroFlourish();
      }, 550);
    }, 950);
  }

  function runWheelIntroFlourish() {
    if (isSpinning) return;
    const startA = currentWheelAngle;
    const targetA = startA + Math.PI * 2;
    const startTime = performance.now();
    const duration = 850;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      currentWheelAngle = startA + (targetA - startA) * ease;
      drawWheel();
      if (progress < 1 && !isSpinning) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
