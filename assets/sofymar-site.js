/* ==========================================================================
   SOFYMAR — interacciones del sitio (inicio + landings)
   ========================================================================== */

/* ---------------------------------------------------------------
   CONFIGURACIÓN — todo lo editable está acá
   --------------------------------------------------------------- */
const SOFYMAR = {
  whatsapp: "59177192180",

  /* GHL: pegá acá los links de tu subcuenta.
     - webhookContacto: URL de un disparador "Inbound Webhook" de un workflow de GHL.
       El formulario de contacto manda ahí nombre, WhatsApp, negocio, interés y mensaje;
       el workflow crea o actualiza el contacto en tu CRM y te avisa.
     - webhookDiagnostico: igual, para el diagnóstico de 3 preguntas (puede ser el mismo workflow).
     - calendarioMedia: link del calendario de video (Calendarios > tu calendario > Compartir > link del widget),
       ej: https://api.leadconnectorhq.com/widget/booking/XXXX */
  ghl: {
    webhookContacto: "",
    webhookDiagnostico: "",
    calendarioMedia: "https://api.leadconnectorhq.com/widget/bookings/sofymar-media"
  },

  mensajes: {
    general:             "Hola, SOFYMAR. Quiero conocer el ecosistema completo y evaluar qué soluciones pueden ayudar a mi negocio inmobiliario.",
    ia:                  "Hola, SOFYMAR. Me interesa conocer cómo funciona SOFYMAR IA y cómo podría aplicarse a mi negocio inmobiliario.",
    media:               "Hola, SOFYMAR. Quiero información sobre los planes de producción audiovisual para mi negocio inmobiliario.",
    "media-basic":       "Hola, SOFYMAR. Me interesa el Plan Basic de SOFYMAR MEDIA (Bs 2.400/mes).",
    "media-standard":    "Hola, SOFYMAR. Me interesa el Plan Standard de SOFYMAR MEDIA (Bs 3.600/mes).",
    "media-premium":     "Hola, SOFYMAR. Me interesa el Plan Premium de SOFYMAR MEDIA (Bs 4.800/mes).",
    "media-tour":        "Hola, SOFYMAR. Me interesa el Tour inmobiliario en video (video de 1 hora para YouTube, 20 clips verticales y live en TikTok, Bs 5.100).",
    web:                 "Hola, SOFYMAR. Me interesa desarrollar una landing page o un sitio web para mis propiedades o proyectos.",
    "web-landing":       "Hola, SOFYMAR. Me interesa una landing page inmobiliaria para una propiedad o proyecto.",
    "web-showroom":      "Hola, SOFYMAR. Quiero consultar por el showroom virtual 3D.",
    "web-sitio":         "Hola, SOFYMAR. Me interesa un sitio web completo para mi negocio inmobiliario.",
    aivisual:            "Hola, SOFYMAR. Quiero conocer las opciones de visualización conceptual con inteligencia artificial para una propiedad.",
    "aivisual-ejemplos": "Hola, SOFYMAR. Quiero ver ejemplos de SOFYMAR AI VISUAL.",
    "ia-prueba":         "Hola, SOFYMAR. Quiero solicitar la prueba de 14 días de Sofya (SOFYMAR IA).",
    core:                "Hola, SOFYMAR. Quiero recibir información sobre el desarrollo de SOFYMAR CORE."
  }
};
const waUrl = t => `https://wa.me/${SOFYMAR.whatsapp}?text=${encodeURIComponent(t)}`;

/* Tracking listo para el Pixel de Meta y GHL. Ej: if (window.fbq) fbq('trackCustom', evento); */
function track(evento) {}

(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$('[data-wa]').forEach(a => { a.href = waUrl(SOFYMAR.mensajes[a.dataset.wa] || SOFYMAR.mensajes.general); });
  $$('.js-year').forEach(e => e.textContent = new Date().getFullYear());
  document.addEventListener('click', e => { const el = e.target.closest('[data-event]'); if (el) track(el.dataset.event); });

  /* Header + WhatsApp flotante */
  const hdr = $('hdr'), waFloat = $('waFloat'), contacto = $('contacto') || $('agenda');
  function ui() {
    if (hdr) hdr.classList.toggle('solid', scrollY > 40);
    if (waFloat) {
      const r = contacto ? contacto.getBoundingClientRect() : { top: 1e9, bottom: -1 };
      waFloat.classList.toggle('show', scrollY > innerHeight * .8 && !(r.top < innerHeight && r.bottom > 0));
    }
  }

  /* Menú Soluciones */
  const dd = $('dd');
  if (dd) {
    const b = dd.querySelector('button'), set = o => { dd.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    const hov = () => matchMedia('(hover:hover)').matches;
    b.addEventListener('click', () => set(!dd.classList.contains('open')));
    dd.addEventListener('mouseenter', () => hov() && set(true));
    dd.addEventListener('mouseleave', () => hov() && set(false));
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
  }

  /* Menú móvil */
  const burger = $('burger'), mnav = $('mnav');
  function closeM() { if (!mnav) return; mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); document.body.style.overflow = ''; }
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const o = !mnav.classList.contains('open');
      mnav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
      burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = o ? 'hidden' : ''; hdr.classList.add('solid');
    });
    $$('a', mnav).forEach(a => a.addEventListener('click', closeM));
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeM(); if (dd) { dd.classList.remove('open'); } } });

  /* Revelado: lo que está en pantalla al cargar queda visible; el resto aparece al bajar */
  const counted = new WeakSet();
  function countUp(el) {
    if (counted.has(el)) return; counted.add(el);
    const end = +el.dataset.count; if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), d = 1400;
    (function f(t) { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in'); $$('[data-count]', en.target).forEach(countUp); io.unobserve(en.target);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv,.stg').forEach(el => { if (reduce || el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); $$('[data-count]', el).forEach(countUp); } else io.observe(el); });

  /* Ecosistema: pestañas */
  const tabs = $$('.eco-tab');
  function sel(t, focus) {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; const p = $(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    if (focus) t.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => sel(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { e.preventDefault(); sel(tabs[j], true); }
    });
  });

  /* Ecosistema: las pestañas rotan solas mientras la sección está a la vista.
     Se detiene si la persona toca una pestaña o pasa el mouse por encima. */
  $$('[data-autotabs]').forEach(box => {
    const tb = $$('.eco-tab', box); if (tb.length < 2 || reduce) return;
    const DUR = 8000; let timer = null, stopped = false, visible = false;
    tb.forEach(t => { const s = document.createElement('span'); s.className = 'tprog'; t.appendChild(s); t.style.setProperty('--tdur', DUR + 'ms'); });
    const restartBar = () => tb.forEach(t => { const s = t.querySelector('.tprog'); s.classList.remove('run'); void s.offsetWidth; if (t.getAttribute('aria-selected') === 'true' && !stopped) s.classList.add('run'); });
    const nextTab = () => { const i = tb.findIndex(t => t.getAttribute('aria-selected') === 'true'); sel(tb[(i + 1) % tb.length]); restartBar(); };
    const start = () => { if (stopped || timer || !visible) return; restartBar(); timer = setInterval(nextTab, DUR); };
    const stop = () => { clearInterval(timer); timer = null; tb.forEach(t => t.querySelector('.tprog').classList.remove('run')); };
    tb.forEach(t => t.addEventListener('click', () => { stopped = true; stop(); }));
    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: .35 }).observe(box);
  });

  /* Diagrama: el contenido de cada servicio cambia en el mismo lugar (dos videos o dos sitios web) */
  if (!reduce) {
    const swaps = $$('.eco-node .nm').filter(n => n.querySelector('video.alt') || n.classList.contains('nm-cycle'));
    if (swaps.length) setInterval(() => swaps.forEach(n => n.classList.toggle('swap')), 6000);
  }

  /* Casos con miniaturas */
  $$('[data-case]').forEach(c => {
    const scr = c.querySelector('.case-screen'), btns = $$('.thumbs button', c);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b));
      scr.style.opacity = 0; setTimeout(() => { scr.src = b.dataset.src; scr.alt = b.dataset.alt; scr.style.opacity = 1; }, 180);
    }));
  });

  /* Comparadores antes / después */
  $$('.cmp').forEach(c => {
    const r = c.querySelector('input'), a = c.querySelector('.after'), b = c.querySelector('.bar');
    const set = () => { a.style.clipPath = `inset(0 0 0 ${r.value}%)`; b.style.left = r.value + '%'; };
    r.addEventListener('input', set); set();
  });

  /* Videos: se cargan y reproducen solo cuando están visibles */
  const vio = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) { if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src; if (!reduce) v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: .3 });
  $$('video[data-autoview]').forEach(v => vio.observe(v));
  const icoOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>';
  const icoOn = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  /* Videos externos (YouTube, TikTok, Facebook): se cargan recién al tocar, para que la página no pese */
  $$('[data-embed]').forEach(box => {
    const btn = box.querySelector('button'); if (!btn) return;
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = box.dataset.embed; f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write'; f.allowFullscreen = true;
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); f.setAttribute('scrolling', 'no');
      box.classList.add('on'); box.appendChild(f); btn.remove();
    });
  });

  $$('[data-sound]').forEach(btn => {
    const v = btn.parentElement.querySelector('video'); btn.innerHTML = icoOff;
    btn.addEventListener('click', () => {
      if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
      $$('[data-sound]').forEach(o => { if (o !== btn) { const ov = o.parentElement.querySelector('video'); ov.muted = true; o.innerHTML = icoOff; o.setAttribute('aria-pressed', 'false'); } });
      v.muted = !v.muted; v.play().catch(() => {});
      btn.innerHTML = v.muted ? icoOff : icoOn; btn.setAttribute('aria-pressed', String(!v.muted));
      btn.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar');
    });
  });

  /* Mockups: la página real se desplaza sola dentro del dispositivo */
  const anims = new Map();
  function setupScreen(img) {
    const scr = img.parentElement, dist = img.getBoundingClientRect().height - scr.getBoundingClientRect().height;
    if (dist <= 0 || reduce) return;
    const speed = scr.closest('.phone-mk') ? 34 : 60, dur = Math.max(dist / speed, 12) * 1000;
    if (anims.has(img)) anims.get(img).cancel();
    const a = img.animate([{ transform: 'translateY(0)', offset: 0 }, { transform: 'translateY(0)', offset: .06 },
      { transform: `translateY(${-dist}px)`, offset: .94 }, { transform: `translateY(${-dist}px)`, offset: 1 }],
      { duration: dur, iterations: Infinity, direction: 'alternate', easing: 'cubic-bezier(.45,0,.55,1)' });
    a.pause(); anims.set(img, a);
    scr.onmouseenter = () => a.pause(); scr.onmouseleave = () => { if (scr.dataset.vis === '1') a.play(); };
  }
  const sio = new IntersectionObserver(es => es.forEach(en => {
    const img = en.target.querySelector('img'), a = anims.get(img);
    en.target.dataset.vis = en.isIntersecting ? '1' : '0'; if (a) en.isIntersecting ? a.play() : a.pause();
  }), { threshold: .2 });
  $$('.screen[data-scroll] img').forEach(img => {
    const go = () => { setupScreen(img); sio.observe(img.parentElement); };
    img.complete && img.naturalWidth ? go() : img.addEventListener('load', go, { once: true });
  });

  /* Flujo de Sofya: los pasos se ejecutan uno por uno (todo visible si no hay animación) */
  $$('[data-run]').forEach(run => {
    const steps = $$('.steps-run li', run), logs = $$('.run-log li', run);
    if (reduce) { steps.forEach(s => s.classList.add('done')); logs.forEach(l => l.classList.add('on')); return; }
    let i = 0, timer = null;
    function tick() {
      if (i < steps.length) {
        steps.forEach((s, k) => s.classList.toggle('on', k === i));
        if (i > 0) steps[i - 1].classList.add('done');
        if (logs[i]) logs[i].classList.add('on');
        i++; timer = setTimeout(tick, 1100);
      } else {
        steps[steps.length - 1].classList.add('done'); steps.forEach(s => s.classList.remove('on'));
        timer = setTimeout(() => { steps.forEach(s => s.classList.remove('done')); logs.forEach(l => l.classList.remove('on')); i = 0; tick(); }, 2600);
      }
    }
    new IntersectionObserver(es => { if (es[0].isIntersecting && !timer) tick(); }, { threshold: .3 }).observe(run);
  });

  /* Conversación de Sofya: los mensajes aparecen uno por uno (todo visible si no hay animación) */
  $$('[data-sofya]').forEach(box => {
    if (reduce) return;
    const ms = $$('.m', box), lead = box.querySelector('.sofya-lead');
    box.classList.add('anim');
    let played = false;
    const play = () => {
      if (played) return; played = true;
      let t = 250;
      ms.forEach(m => { setTimeout(() => m.classList.add('show'), t); t += m.classList.contains('out') ? 1100 : 900; });
      if (lead) setTimeout(() => lead.classList.add('show'), t + 150);
    };
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { play(); o.disconnect(); } }, { threshold: .25 }).observe(box);
    setTimeout(() => { if (!played) { ms.forEach(m => m.classList.add('show')); if (lead) lead.classList.add('show'); played = true; } }, 7000);
  });

  /* Carrusel deslizable: flechas, arrastre con mouse, swipe y contador */
  $$('[data-rail]').forEach(rail => {
    const track = rail.querySelector('.rail-track'), slides = $$('.slide', track);
    const prev = rail.querySelector('[data-prev]'), next = rail.querySelector('[data-next]');
    const cur = rail.querySelector('[data-cur]'), tot = rail.querySelector('[data-tot]'), bar = rail.querySelector('.rbar i');
    if (tot) tot.textContent = String(slides.length).padStart(2, '0');
    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 24;
    const step = () => (slides[0] ? slides[0].getBoundingClientRect().width : 300) + gap();
    function sync() {
      const max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
      const tl = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
      let idx = 0, best = 1e9;
      slides.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().left - tl); if (d < best) { best = d; idx = i; } });
      if (p > .98) idx = slides.length - 1;
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0');
      if (bar) { const w = 100 / slides.length; bar.style.width = w + '%'; bar.style.left = (p * (100 - w)) + '%'; }
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    }
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync);
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next && next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev && prev.click(); }
    });
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button,input,a,video')) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('drag'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) { track.classList.remove('drag'); const s = step(); track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: 'smooth' }); }
    });
    sync();
  });

  /* Calendarios y formularios de GHL: si está el link, se carga; si no, queda el espacio con WhatsApp */
  let embedJs = false;
  $$('[data-ghl]').forEach(box => {
    const url = SOFYMAR.ghl[box.dataset.ghl];
    if (!url) return;
    const f = document.createElement('iframe');
    // el id "<idDelWidget>_<número>" permite que el script de GHL ajuste el alto del calendario solo
    const widgetId = url.split('/').pop();
    f.src = url; f.id = widgetId + '_' + Date.now(); f.title = box.dataset.title || 'SOFYMAR';
    f.setAttribute('allow', 'payment'); f.setAttribute('scrolling', 'auto');
    f.style.cssText = 'width:100%;border:none;overflow:auto;min-height:' + (box.dataset.h || '680px');
    box.querySelector('.ghl-ph').replaceWith(f);
    if (!embedJs) { embedJs = true; const s = document.createElement('script'); s.src = 'https://link.msgsndr.com/js/form_embed.js'; s.async = true; document.body.appendChild(s); }
  });

  /* Diagnóstico: 3 preguntas + nombre y WhatsApp → CRM de GHL */
  const dx = $('dx');
  if (dx) {
    const L = {
      agente: 'Agente independiente', oficina: 'Oficina o equipo', desarrolladora: 'Desarrolladora', constructora: 'Constructora',
      tarde: 'Respondo tarde los mensajes', seguimiento: 'Pierdo el seguimiento de los interesados', lucen: 'Mis propiedades no lucen como deberían', web: 'No tengo una web que convierta',
      semana: 'Esta semana', mes: 'Este mes', averiguando: 'Estoy averiguando'
    };
    const R = {
      dev:   { id: 'web_sofya', t: 'SOFYMAR Web + Sofya', x: 'Showroom 3D y landing del proyecto, con Sofya atendiendo a cada comprador.', go: 'web.html' },
      media: { id: 'media_aivisual', t: 'SOFYMAR Media + AI Visual', x: 'Video, foto y visualización con IA para que tus propiedades se vean como valen.', go: 'media.html' },
      web:   { id: 'web', t: 'SOFYMAR Web', x: 'Una landing por propiedad que presenta, filtra curiosos y lleva a WhatsApp.', go: 'web.html' },
      ia:    { id: 'ia', t: 'SOFYMAR IA', x: 'Sofya responde tu WhatsApp, califica a cada interesado y te ayuda a agendar las visitas.', go: 'ia.html' }
    };
    const steps = $$('.dx-step', dx), bar = $('dxBar'), cnt = $('dxCount'), ans = {};
    const pick = () => (ans.negocio === 'desarrolladora' || ans.negocio === 'constructora') ? R.dev : ans.freno === 'lucen' ? R.media : ans.freno === 'web' ? R.web : R.ia;
    function show(n) {
      steps.forEach((s, i) => s.hidden = i !== n);
      bar.style.width = (Math.min(n + 1, 4) / 4 * 100) + '%';
      cnt.textContent = n < 4 ? `PASO ${n + 1} DE 4` : 'LISTO';
      const first = steps[n] && steps[n].querySelector('button,input');
      if (n > 0 && first) first.focus({ preventScroll: true });
    }
    $$('.dx-opts button', dx).forEach(b => b.addEventListener('click', () => {
      const step = b.closest('.dx-step'); ans[step.dataset.key] = b.dataset.v;
      track(`diag_${step.dataset.key}_${b.dataset.v}`); show(steps.indexOf(step) + 1);
    }));
    $$('.dx-back', dx).forEach(b => b.addEventListener('click', () => show(Math.max(steps.indexOf(b.closest('.dx-step')) - 1, 0))));
    $('dxForm').addEventListener('submit', async e => {
      e.preventDefault();
      const nom = $('dxName').value.trim(), tel = $('dxPhone').value.replace(/[^\d+]/g, ''), msg = $('dxMsg');
      if (!nom) { msg.className = 'dx-msg err'; msg.textContent = 'Escribí tu nombre.'; $('dxName').focus(); return; }
      if (tel.replace(/\D/g, '').length < 7) { msg.className = 'dx-msg err'; msg.textContent = 'Escribí un WhatsApp válido, por ejemplo 77192180.'; $('dxPhone').focus(); return; }
      const r = pick();
      const datos = { nombre: nom, whatsapp: tel, negocio: L[ans.negocio], freno: L[ans.freno], inicio: L[ans.inicio], recomendacion: r.t, origen: 'Web SOFYMAR · Diagnóstico', pagina: location.pathname };
      $('dxResT').textContent = r.t; $('dxResX').textContent = r.x;
      const sum = $('dxSum'); sum.innerHTML = '';
      [datos.negocio, datos.freno, 'Empezar: ' + datos.inicio].forEach(s => { const sp = document.createElement('span'); sp.textContent = s; sum.appendChild(sp); });
      $('dxGo').href = r.go;
      const texto = `Hola, SOFYMAR. Soy ${nom}. Hice el diagnóstico en la web:\n• Negocio: ${datos.negocio}\n• Lo que me frena: ${datos.freno}\n• Quiero empezar: ${datos.inicio}\n• Resultado: ${r.t}`;
      $('dxWa').href = waUrl(texto);
      const out = $('dxSent');
      if (SOFYMAR.ghl.webhookDiagnostico) {
        const btn = $('dxSubmit'); btn.disabled = true; btn.textContent = 'Enviando…';
        try {
          await fetch(SOFYMAR.ghl.webhookDiagnostico, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(datos) });
          out.className = 'dx-msg ok'; out.textContent = 'Recibimos tus respuestas. Te escribimos por WhatsApp.';
        } catch (err) {
          out.className = 'dx-msg err'; out.textContent = 'No se pudo enviar. Mandanos tu resultado por WhatsApp con el botón de abajo.';
        }
        btn.disabled = false; btn.textContent = 'Ver mi resultado';
      } else {
        out.className = 'dx-msg'; out.textContent = 'Mandanos tu resultado por WhatsApp para que lo veamos juntos.';
      }
      track('diag_resultado_' + r.id); show(4); $('dxResT').focus({ preventScroll: true });
    });
    $('dxReset').addEventListener('click', () => { for (const k in ans) delete ans[k]; $('dxForm').reset(); $('dxMsg').textContent = ''; show(0); });
    show(0);
  }

  /* Formulario de contacto → CRM de GHL (webhook). Sin webhook, arma el mensaje de WhatsApp. */
  const form = $('waForm');
  if (form) {
    // las opciones de la izquierda eligen el interés y llevan al formulario
    $$('[data-interes]').forEach(a => a.addEventListener('click', () => {
      const sel = $('fSol'); [...sel.options].forEach(o => { if (o.value === a.dataset.interes) sel.value = o.value; });
      setTimeout(() => $('fName').focus({ preventScroll: true }), 400);
    }));
    // en cada página, el interés llega preseleccionado
    const porPagina = { 'ia.html': 'SOFYMAR IA', 'media.html': 'SOFYMAR MEDIA', 'web.html': 'SOFYMAR WEB', 'ai-visual.html': 'SOFYMAR AI VISUAL', 'core.html': 'SOFYMAR CORE' };
    const pre = porPagina[location.pathname.split('/').pop()] || porPagina[location.pathname.replace(/^\//, '') + '.html'];
    if (pre && $('fSol')) $('fSol').value = pre;
    const params = new URLSearchParams(location.search);
    const utm = {}; ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(k => { if (params.get(k)) utm[k] = params.get(k); });
    // MEDIA: se piden los datos de la sesión de grabación
    const mf = $('mediaFields'), selInt = $('fSol');
    const toggleMedia = () => { mf.hidden = selInt.value !== 'SOFYMAR MEDIA'; };
    selInt.addEventListener('change', toggleMedia); toggleMedia();
    const hoy = new Date(); hoy.setDate(hoy.getDate() + 1); $('fFecha').min = hoy.toISOString().slice(0, 10);
    let enviando = false;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (enviando) return;
      const err = $('fErr'), nom = $('fName').value.trim(), tel = $('fPhone').value.replace(/[^\d+]/g, '');
      if ($('fWeb').value) return;                       // trampa para robots
      if (!nom) { err.textContent = 'Escribí tu nombre.'; $('fName').focus(); return; }
      if (tel.replace(/\D/g, '').length < 7) { err.textContent = 'Escribí tu WhatsApp, por ejemplo 77192180.'; $('fPhone').focus(); return; }
      err.textContent = '';
      const interes = $('fSol').value, negocio = $('fBiz').value.trim(), mensaje = $('fMsg').value.trim();
      const pagina = location.pathname.split('/').pop() || 'index.html';
      const esMedia = interes === 'SOFYMAR MEDIA';
      const extra = esMedia ? { tipo_contenido: $('fTipo').value, objetivo: $('fObj').value, fecha_grabacion: $('fFecha').value } : {};
      const datos = { nombre: nom, whatsapp: tel, negocio, interes, mensaje, ...extra, origen: 'Web SOFYMAR · Formulario', pagina, fecha: new Date().toISOString(), ...utm };
      const detalle = esMedia ? [extra.tipo_contenido && `Contenido: ${extra.tipo_contenido}`, extra.objetivo && `Objetivo: ${extra.objetivo}`, extra.fecha_grabacion && `Fecha deseada: ${extra.fecha_grabacion}`].filter(Boolean).join('\n') : '';
      const texto = `Hola, SOFYMAR. Soy ${nom}${negocio ? ' de ' + negocio : ''}. Me interesa ${interes}.` + (detalle ? `\n${detalle}` : '') + (mensaje ? `\n${mensaje}` : '');
      const btn = $('fSubmit'), label = btn.innerHTML;
      const ok = (titulo, texto2) => {
        $('formBody').hidden = true; $('formOk').hidden = false;
        $('formOkT').textContent = titulo; $('formOkX').textContent = texto2;
        $('formOkWa').href = waUrl(texto);
        if (/MEDIA/.test(interes) && !document.getElementById('agenda')) { const c = $('formOkCal'); c.hidden = false; }
        if (document.getElementById('agenda')) { const c = $('formOkCal'); c.hidden = false; c.href = '#agenda'; }
        $('formOk').focus({ preventScroll: true });
      };
      if (SOFYMAR.ghl.webhookContacto) {
        enviando = true; btn.disabled = true; btn.textContent = 'Enviando…';
        try {
          await fetch(SOFYMAR.ghl.webhookContacto, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(datos) });
          track('form_contacto_enviado'); ok('Recibimos tus datos', 'Te escribimos por WhatsApp en cuanto los veamos. Si querés avanzar ya, escribinos vos.');
        } catch (x) {
          err.textContent = 'No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.'; btn.innerHTML = label; btn.disabled = false; enviando = false;
          const w = $('fWa'); w.href = waUrl(texto);
        }
      } else {
        // sin webhook conectado: no se simula un envío, se abre WhatsApp con el mensaje armado
        window.open(waUrl(texto), '_blank', 'noopener');
        ok('Seguimos por WhatsApp', 'Abrimos WhatsApp con tu mensaje listo. Tocá enviar para que lo recibamos.');
      }
    });
  }

  /* ======================================================================
     LANDINGS IA y CORE — animaciones (todas respetan "reducir movimiento")
     ====================================================================== */

  /* Elementos que "se asientan" al entrar en pantalla (ej. información dispersa → ordenada) */
  const sio2 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); sio2.unobserve(en.target); } }), { threshold: .3 });
  $$('[data-settle]').forEach(el => reduce ? el.classList.add('in') : sio2.observe(el));

  /* Titulares que se revelan palabra por palabra */
  function splitWords(node, state) {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w'; w.style.setProperty('--i', state.i++); w.textContent = p; frag.appendChild(w);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1) splitWords(ch, state);
    });
  }
  const wio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); wio.unobserve(en.target); } }), { threshold: .35 });
  $$('[data-words]').forEach(h => {
    if (reduce) return;
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    splitWords(h, { i: 0 }); $$('.w', h).forEach(w => w.setAttribute('aria-hidden', 'true'));
    wio.observe(h);
  });

  /* Luz que sigue al cursor en las tarjetas */
  $$('[data-spot]').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* Inclinación 3D del prototipo (solo con mouse) */
  $$('[data-tilt]').forEach(t => {
    if (reduce || !matchMedia('(hover:hover)').matches) return;
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      t.style.transform = `perspective(1100px) rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg)`;
    });
    t.addEventListener('pointerleave', () => { t.style.transform = ''; });
  });

  /* Barra de progreso de lectura (CORE) */
  const sprog = document.querySelector('[data-sprog] i');
  function sprogUpd() { if (!sprog) return; const h = document.documentElement.scrollHeight - innerHeight; sprog.style.transform = `scaleX(${h > 0 ? Math.min(scrollY / h, 1) : 0})`; }

  /* Línea de tiempo que se llena con el scroll */
  const lines = $$('[data-scrollline]');
  function lineUpd() {
    lines.forEach(ol => {
      const r = ol.getBoundingClientRect(), mid = innerHeight * .6;
      const p = reduce ? 1 : Math.min(Math.max((mid - r.top) / r.height, 0), 1);
      ol.style.setProperty('--p', p.toFixed(3));
      $$('li', ol).forEach(li => { const lr = li.getBoundingClientRect(); li.classList.toggle('on', reduce || lr.top < mid); });
    });
  }

  /* Subnav de la landing de IA: marca la sección activa */
  const snLinks = $$('.sn-links a');
  function snUpd() {
    if (!snLinks.length) return; let cur = null;
    snLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < innerHeight * .35) cur = a; });
    snLinks.forEach(a => a.classList.toggle('on', a === cur));
  }

  /* Conversación de WhatsApp en vivo, con indicador de escritura */
  $$('[data-chat]').forEach(ph => {
    const body = ph.querySelector('.wa-body'), msgs = $$('.wm:not(.typing)', body), typing = ph.querySelector('.typing'), status = ph.querySelector('[data-status]');
    if (reduce) { msgs.forEach(m => m.classList.add('show')); return; }
    ph.classList.add('anim'); body.style.minHeight = body.offsetHeight + 'px';
    let on = false, run = 0;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function play(id) {
      msgs.forEach(m => m.classList.remove('show')); typing.classList.remove('on');
      await wait(700);
      for (const m of msgs) {
        if (id !== run || !on) return;
        if (m.classList.contains('out')) {
          body.insertBefore(typing, m); typing.classList.add('on'); status.textContent = 'escribiendo…'; await wait(1300);
          typing.classList.remove('on'); status.textContent = 'en línea';
        } else await wait(1000);
        m.classList.add('show'); await wait(m.classList.contains('out') ? 900 : 500);
      }
      await wait(4200); if (id === run && on) play(id);
    }
    new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) play(++run); else run++; }, { threshold: .35 }).observe(ph);
  });

  /* Recorrido del lead: las cuatro etapas se iluminan una por una */
  $$('[data-journey]').forEach(j => {
    const st = $$('.js', j), fill = j.querySelector('.jl-fill'), pulse = j.querySelector('.jl-pulse');
    if (reduce) { st.forEach(s => s.classList.add('on')); if (fill) fill.style.width = '100%'; return; }
    let on = false, run = 0;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function play(id) {
      st.forEach(s => s.classList.remove('on')); fill.style.width = '0'; pulse.style.opacity = 0; pulse.style.left = '0';
      await wait(600);
      for (let i = 0; i < st.length; i++) {
        if (id !== run || !on) return;
        st[i].classList.add('on'); const pc = i / (st.length - 1) * 100;
        fill.style.width = pc + '%'; pulse.style.opacity = 1; pulse.style.left = `calc(${pc}% - 4px)`;
        await wait(1500);
      }
      await wait(3200); if (id === run && on) play(id);
    }
    new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) play(++run); else run++; }, { threshold: .4 }).observe(j);
  });

  /* Lista de evaluación: se tildan una por una */
  $$('[data-checklist]').forEach(ul => {
    const li = $$('li', ul);
    if (reduce) { li.forEach(l => l.classList.add('on')); return; }
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { li.forEach((l, i) => setTimeout(() => l.classList.add('on'), 400 + i * 550)); o.disconnect(); } }, { threshold: .4 }).observe(ul);
  });

  /* CTAs que llevan al formulario: eligen el interés y dejan el mensaje listo */
  $$('[data-prefill]').forEach(a => a.addEventListener('click', () => {
    const m = $('fMsg'); if (m && !m.value.trim()) m.value = a.dataset.prefill;
  }));

  /* HERO del inicio: el video del edificio avanza con el scroll */
  const video = $('heroVideo'), hero = $('inicio');
  let scrub = false, ready = false, target = 0, cur = 0;
  const barH = $('heroProgress'), pct = $('pct');
  function upd() {
    const sc = hero.offsetHeight - innerHeight, p = sc > 0 ? Math.min(Math.max(-hero.getBoundingClientRect().top / sc, 0), 1) : 0;
    if (barH) barH.style.width = (p * 100) + '%'; if (pct) pct.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
    if (ready && video.duration) target = p * (video.duration - .05);
  }
  if (video && hero) {
    const mobile = matchMedia('(max-width: 768px)').matches;
    if (reduce) video.style.display = 'none';
    else {
      scrub = true; video.src = mobile ? video.dataset.mobile : video.dataset.desktop; video.pause();
      video.addEventListener('loadedmetadata', () => { ready = true; upd(); }); video.load();
      if (mobile) { /* iOS/Android: el video hay que "despertarlo" con el primer toque para poder moverlo con el scroll */
        const wake = () => { video.play().then(() => video.pause()).catch(() => {}); };
        ['touchstart', 'pointerdown', 'scroll'].forEach(ev => addEventListener(ev, wake, { once: true, passive: true }));
      }
      (function loop() { if (ready && Math.abs(target - cur) > .001) { cur += (target - cur) * .18; if (!video.seeking) video.currentTime = cur; } requestAnimationFrame(loop); })();
    }
  }

  let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { ui(); if (scrub) upd(); sprogUpd(); lineUpd(); snUpd(); tick = false; }); }, { passive: true });
  addEventListener('resize', () => scrub && upd());
  ui(); sprogUpd(); lineUpd(); snUpd();
})();
