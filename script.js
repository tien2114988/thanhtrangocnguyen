(() => {
  'use strict';

  // ===== DOM refs =====
  const entryOverlay = document.getElementById('entry-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnSubmit = document.getElementById('btn-submit');
  const progressFill = document.getElementById('progress-fill');
  const emailForm = document.getElementById('email-form');
  const customLocationInput = document.getElementById('custom-location');
  const dateInput = document.getElementById('date-input');
  const timeInput = document.getElementById('time-input');

  let currentStep = 1;
  const totalSteps = 5;
  let musicPlaying = false;

  // ===== Entry & Music =====
  enterBtn.addEventListener('click', () => {
    entryOverlay.classList.add('hidden');
    mainContent.hidden = false;
    musicToggle.hidden = false;
    startMusic();
    launchConfetti();
  });

  function startMusic() {
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.classList.remove('paused');
    }).catch(() => {
      musicPlaying = false;
      musicToggle.classList.add('paused');
    });
  }

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicToggle.classList.add('paused');
    } else {
      bgMusic.play();
      musicPlaying = true;
      musicToggle.classList.remove('paused');
    }
  });

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal, .section-title');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = (entry.target.dataset.delay || 0) * 150;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // ===== Confetti =====
  function launchConfetti() {
    const colors = ['#f2559a', '#ffa3c4', '#ffc9dc', '#ff7aab', '#ffe4ec', '#d63384'];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = `${2 + Math.random() * 2}s`;
        piece.style.width = `${6 + Math.random() * 8}px`;
        piece.style.height = piece.style.width;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
      }, i * 40);
    }
  }

  // ===== Step navigation =====
  function goToStep(step) {
    document.querySelectorAll('.step-panel').forEach((p) => p.classList.remove('active'));
    const panel = document.getElementById(`step-${step}`);
    if (panel) panel.classList.add('active');

    document.querySelectorAll('.dot').forEach((dot) => {
      const s = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', s === step);
      dot.classList.toggle('done', s < step);
    });

    progressFill.style.width = `${(step / totalSteps) * 100}%`;
    currentStep = step;

    if (step === 5) updateConfirm();
  }

  // ===== Yes / No buttons =====
  btnYes.addEventListener('click', () => {
    launchConfetti();
    goToStep(2);
  });

  // Evasive "No" button
  let noAttempts = 0;
  let lastNoPos = null;
  const noMessages = [
    'Sure? 🥺',
    'Please? 💕',
    'Say yes! 😊',
    'Yes is right there~ ✨',
  ];

  btnNo.addEventListener('mouseenter', evadeNo);
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    evadeNo();
  });
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    evadeNo();
  }, { passive: false });

  function rectsOverlap(x, y, w, h, box) {
    return !(x + w < box.left || x > box.right || y + h < box.top || y > box.bottom);
  }

  function evadeNo() {
    const zone = document.getElementById('ask-zone');
    if (!zone) return;

    zone.classList.add('is-evading');
    btnNo.style.position = 'absolute';

    noAttempts++;
    if (noAttempts <= noMessages.length) {
      btnNo.textContent = noMessages[noAttempts - 1];
    }

    const zoneRect = zone.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();
    const pad = 32;

    const avoid = {
      left: yesRect.left - zoneRect.left - pad,
      top: yesRect.top - zoneRect.top - pad,
      right: yesRect.right - zoneRect.left + pad,
      bottom: yesRect.bottom - zoneRect.top + pad,
    };

    const noW = btnNo.offsetWidth;
    const noH = btnNo.offsetHeight;
    const margin = 8;
    const maxX = Math.max(0, zone.clientWidth - noW - margin);
    const maxY = Math.max(0, zone.clientHeight - noH - margin);

    const slots = [
      [margin, margin],
      [maxX, margin],
      [margin, maxY],
      [maxX, maxY],
      [margin, maxY / 2],
      [maxX, maxY / 2],
    ].filter(([x, y]) => !rectsOverlap(x, y, noW, noH, avoid));

    let pickFrom = slots;
    if (lastNoPos) {
      const others = slots.filter(
        ([x, y]) => Math.abs(x - lastNoPos.x) > 24 || Math.abs(y - lastNoPos.y) > 24
      );
      if (others.length) pickFrom = others;
    }

    let newX = margin;
    let newY = margin;

    if (pickFrom.length > 0) {
      const pick = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      [newX, newY] = pick;
    } else {
      const yesCx = (avoid.left + avoid.right) / 2;
      const yesCy = (avoid.top + avoid.bottom) / 2;
      const corners = [
        [margin, margin],
        [maxX, margin],
        [margin, maxY],
        [maxX, maxY],
      ];
      corners.sort((a, b) => {
        const distA = Math.hypot(a[0] + noW / 2 - yesCx, a[1] + noH / 2 - yesCy);
        const distB = Math.hypot(b[0] + noW / 2 - yesCx, b[1] + noH / 2 - yesCy);
        return distB - distA;
      });
      [newX, newY] = corners[0];
    }

    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    lastNoPos = { x: newX, y: newY };

    if (noAttempts >= 3) {
      btnYes.classList.add('glow');
    }
  }

  // ===== Location custom input toggle =====
  document.querySelectorAll('input[name="location"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isCustom = document.querySelector('input[name="location"]:checked').value === 'custom';
      customLocationInput.hidden = !isCustom;
      if (isCustom) customLocationInput.focus();
    });
  });

  // ===== Next / Back buttons =====
  document.querySelectorAll('.btn-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next, 10);
      if (next === 4 && !validateDateTime()) return;
      goToStep(next);
    });
  });

  document.querySelectorAll('.btn-back').forEach((btn) => {
    btn.addEventListener('click', () => {
      goToStep(parseInt(btn.dataset.back, 10));
    });
  });

  function validateDateTime() {
    if (!dateInput.value) {
      dateInput.focus();
      shakeInput(dateInput);
      return false;
    }
    if (!timeInput.value) {
      timeInput.focus();
      shakeInput(timeInput);
      return false;
    }
    return true;
  }

  function shakeInput(el) {
    el.style.borderColor = '#f2559a';
    el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 300 }
    );
    setTimeout(() => { el.style.borderColor = ''; }, 600);
  }

  // ===== Confirm summary =====
  function getLocation() {
    const selected = document.querySelector('input[name="location"]:checked');
    if (selected.value === 'custom') {
      return customLocationInput.value.trim() || 'Custom location (not specified)';
    }
    return selected.value;
  }

  function getFood() {
    const selected = document.querySelector('input[name="food"]:checked');
    return selected ? selected.value : '—';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatTime(timeStr) {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  function updateConfirm() {
    document.getElementById('confirm-location').textContent = getLocation();
    document.getElementById('confirm-date').textContent = formatDate(dateInput.value);
    document.getElementById('confirm-time').textContent = formatTime(timeInput.value);
    document.getElementById('confirm-food').textContent = getFood();
  }

  // ===== Submit via FormSubmit =====
  btnSubmit.addEventListener('click', () => {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Sending...';

    document.getElementById('form-location').value = getLocation();
    document.getElementById('form-date').value = formatDate(dateInput.value);
    document.getElementById('form-time').value = formatTime(timeInput.value);
    document.getElementById('form-food').value = getFood();

    const formData = new FormData(emailForm);

    fetch(emailForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          document.querySelectorAll('.step-panel').forEach((p) => p.classList.remove('active'));
          document.getElementById('step-success').classList.add('active');
          progressFill.style.width = '100%';
          document.querySelectorAll('.dot').forEach((d) => d.classList.add('done'));
          launchConfetti();
        } else {
          throw new Error('Submit failed');
        }
      })
      .catch(() => {
        emailForm.submit();
      });
  });

  // Default date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.value = tomorrow.toISOString().split('T')[0];
  timeInput.value = '18:00';
})();
