/* ===== EMPLOYA Bewerbungs-Funnel ===== */
(function () {
  'use strict';

  const form        = document.getElementById('funnelForm');
  const steps       = Array.from(form.querySelectorAll('.step[data-step]'));
  const inputSteps  = steps.filter(s => s.dataset.step !== 'done');
  const totalSteps  = inputSteps.length;            // 6
  const progressBar = document.getElementById('progressBar');
  const stepLabel   = document.getElementById('stepLabel');
  const stepPct     = document.getElementById('stepPct');
  const backBtn     = document.getElementById('backBtn');
  const funnelNav   = form.querySelector('.funnel-nav');

  const data = {};          // collected answers
  let current = 1;          // 1-based step index

  /* ---------- Navigation ---------- */
  function showStep(n) {
    steps.forEach(s => s.classList.remove('is-active'));
    const target = form.querySelector(`.step[data-step="${n}"]`);
    if (target) target.classList.add('is-active');

    if (n === totalSteps) renderRecap();

    if (typeof n === 'number') {
      current = n;
      const pct = Math.round((n - 1) / totalSteps * 100) + Math.round(100 / totalSteps);
      const display = Math.min(pct, 100);
      progressBar.style.width = display + '%';
      stepLabel.textContent = `Schritt ${n} von ${totalSteps}`;
      stepPct.textContent = display + '%';
      backBtn.hidden = n === 1;
    }
    // scroll funnel into view on smaller screens
    if (window.innerWidth < 920) {
      document.getElementById('funnel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function next() {
    if (current < totalSteps) showStep(current + 1);
  }

  backBtn.addEventListener('click', () => {
    if (current > 1) showStep(current - 1);
  });

  /* ---------- Option selection (auto-advance) ---------- */
  form.querySelectorAll('.options[data-auto]').forEach(group => {
    const field = group.dataset.field;
    group.addEventListener('click', e => {
      const btn = e.target.closest('.option');
      if (!btn) return;
      group.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      btn.classList.add('selected');
      data[field] = btn.dataset.value;
      // brief delay so the selection state is visible before advancing
      setTimeout(next, 220);
    });
  });

  /* ---------- Validation helpers ---------- */
  function setError(name, msg) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || '';
  }
  function markInvalid(input, bad) {
    input.classList.toggle('invalid', bad);
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[+()/\d\s-]{6,}$/;

  function validateContact() {
    const anrede   = form.querySelector('#f-anrede');
    const vorname  = form.querySelector('#f-vorname');
    const nachname = form.querySelector('#f-nachname');
    const phone    = form.querySelector('#f-phone');
    const email    = form.querySelector('#f-email');
    const privacy  = form.querySelector('#f-privacy');
    let ok = true;

    if (!anrede.value) { setError('anrede', 'Bitte wähle eine Anrede.'); markInvalid(anrede, true); ok = false; }
    else { setError('anrede', ''); markInvalid(anrede, false); }

    if (vorname.value.trim().length < 2) { setError('vorname', 'Bitte gib deinen Vornamen ein.'); markInvalid(vorname, true); ok = false; }
    else { setError('vorname', ''); markInvalid(vorname, false); }

    if (nachname.value.trim().length < 2) { setError('nachname', 'Bitte gib deinen Nachnamen ein.'); markInvalid(nachname, true); ok = false; }
    else { setError('nachname', ''); markInvalid(nachname, false); }

    if (!emailRe.test(email.value.trim())) { setError('email', 'Bitte gib eine gültige E-Mail-Adresse ein.'); markInvalid(email, true); ok = false; }
    else { setError('email', ''); markInvalid(email, false); }

    if (!phoneRe.test(phone.value.trim())) { setError('telefon', 'Bitte gib eine gültige Rufnummer ein.'); markInvalid(phone, true); ok = false; }
    else { setError('telefon', ''); markInvalid(phone, false); }

    if (!privacy.checked) { setError('privacy', 'Bitte stimme der Datenverarbeitung zu.'); ok = false; }
    else { setError('privacy', ''); }

    if (!ok) {
      const firstInvalid = form.querySelector('.step[data-step="' + totalSteps + '"] .invalid');
      if (firstInvalid) firstInvalid.focus();
    }
    return ok;
  }

  // clear errors as the user types/selects
  ['#f-anrede', '#f-vorname', '#f-nachname', '#f-phone', '#f-email'].forEach(sel => {
    const input = form.querySelector(sel);
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => { input.classList.remove('invalid'); });
  });

  /* ---------- Recap im letzten Schritt ---------- */
  function renderRecap() {
    const recap = document.getElementById('recap');
    if (!recap) return;
    const rows = [
      ['Stelle', data.position],
      ['Bereich', data.bereich],
      ['Erfahrung', data.erfahrung],
      ['Region', data.region],
      ['Arbeitszeit', data.arbeitszeit],
      ['Mobilität', data.mobilitaet],
    ].filter(r => r[1]);
    recap.innerHTML =
      '<div class="recap-title">Deine Auswahl</div>' +
      '<div class="recap-tags">' +
      rows.map(r => `<span class="recap-tag"><b>${r[0]}:</b> ${r[1]}</span>`).join('') +
      '</div>';
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateContact()) return;

    data.anrede   = form.querySelector('#f-anrede').value;
    data.vorname  = form.querySelector('#f-vorname').value.trim();
    data.nachname = form.querySelector('#f-nachname').value.trim();
    data.email    = form.querySelector('#f-email').value.trim();
    data.telefon  = form.querySelector('#f-phone').value.trim();
    data.eintritt = form.querySelector('#f-eintritt').value;
    data.gehalt   = form.querySelector('#f-gehalt').value.trim();
    data.nachricht = form.querySelector('#f-nachricht').value.trim();
    const cvFile   = form.querySelector('#f-cv').files[0];
    const quFile   = form.querySelector('#f-quali').files[0];
    data.lebenslauf      = cvFile ? cvFile.name : '';
    data.qualifikationen = quFile ? quFile.name : '';
    data.zeitpunkt = new Date().toISOString();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet …';

    // --- Hier kann die Anbindung an ein Backend / CRM / E-Mail erfolgen ---
    // Beispiel:
    // fetch('/api/bewerbung', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    submitBewerbung(data).then(showSuccess).catch(() => {
      // Fallback: trotzdem Erfolg zeigen, Daten in Konsole
      console.warn('Versand fehlgeschlagen – Daten:', data);
      showSuccess();
    });
  });

  function submitBewerbung(payload) {
    // Platzhalter – aktuell kein Backend angebunden.
    // Daten werden lokal gespeichert, damit nichts verloren geht.
    try {
      const list = JSON.parse(localStorage.getItem('employa_bewerbungen') || '[]');
      list.push(payload);
      localStorage.setItem('employa_bewerbungen', JSON.stringify(list));
    } catch (_) {}
    console.log('Neue Bewerbung erfasst:', payload);
    return Promise.resolve();
  }

  function showSuccess() {
    const firstName = data.vorname || '';
    document.getElementById('successName').textContent = firstName || 'wir haben deine Anfrage';
    progressBar.style.width = '100%';
    stepLabel.textContent = 'Fertig!';
    stepPct.textContent = '100%';
    backBtn.hidden = true;
    funnelNav.hidden = true;
    showStep('done');
  }

  /* ---------- Init ---------- */
  showStep(1);
})();
