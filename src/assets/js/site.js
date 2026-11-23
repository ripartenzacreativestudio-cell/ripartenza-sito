/* Ripartenza Creative Studio · script del sito */
(function () {
  var root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }

  /* menu su telefono */
  var links = $('links'), menuBtn = $('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () { var o = links.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(o)); });

  /* tema chiaro / scuro */
  var themeBtn = $('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = (root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('rip-theme', next); } catch (e) {}
  });

  /* barra di avanzamento e torna su */
  var hdr = document.querySelector('header'), toTop = $('to-top');
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
    hdr.style.setProperty('--scroll', p.toFixed(4)); toTop.classList.toggle('show', scrollY > 700);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* transizione a bande tra le pagine */
  var wipe = $('wipe');
  try { if (!reduce && sessionStorage.getItem('rip-wipe') === '1') {
    sessionStorage.removeItem('rip-wipe'); wipe.className = 'wipe reset in'; void wipe.offsetWidth;
    requestAnimationFrame(function () { wipe.className = 'wipe in out'; setTimeout(function () { wipe.className = 'wipe reset'; void wipe.offsetWidth; wipe.className = 'wipe'; }, 650); });
  } } catch (e) {}
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="/"]');
    if (!a || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href'); if (href.indexOf('#') === 0 || href === location.pathname || href.indexOf('/admin') === 0) return;
    e.preventDefault(); wipe.className = 'wipe in';
    try { sessionStorage.setItem('rip-wipe', '1'); } catch (er) {}
    setTimeout(function () { location.href = href; }, 480);
  });
  addEventListener('pageshow', function (ev) { if (ev.persisted) wipe.className = 'wipe'; });

  /* preventivo: servizio già selezionato se arrivi da una pagina servizio */
  var sel = $('f-servizio'), q = new URLSearchParams(location.search).get('servizio');
  if (sel && q) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === q) sel.selectedIndex = i;

  /* logo 3D: solo su schermi grandi, caricato quando serve */
  var stage = $('stage');
  if (stage && !reduce && matchMedia('(min-width: 900px)').matches) {
    var load = function (src) { return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); };
    load('/assets/js/three.min.js').then(function () { return load('/assets/js/SVGLoader.js'); }).then(start3D).catch(function () {});
  }
  function start3D() {
    try {
      var T = THREE, renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); stage.insertBefore(renderer.domElement, stage.firstChild); stage.classList.add('has3d');
      var scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 1, 1000); cam.position.set(0, 0, 260);
      scene.add(new T.AmbientLight(0xffffff, .55));
      var key = new T.DirectionalLight(0xffffff, .9); key.position.set(80, 120, 160); scene.add(key);
      var rim = new T.DirectionalLight(0xFF5A1F, .6); rim.position.set(-140, -40, -80); scene.add(rim);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M540.97,781.15l226.22,130.61,50.35-87.02-124.55-72.02,96.33-54.29c86.47-48.73,129.15-149.62,103.89-245.83-23.87-90.92-105.76-159.09-202.26-162.05l-151.34-.54.02,100.77,140.18-.24c53.88-.09,100.84,34.45,115.46,85.28,14.970,52.06-7.44,107.99-54.89,134.7l-98.68,55.54-.04-171.35-100.64.07-.03,286.37Z"/><polygon points="641.65 911.77 541.01 911.77 541.01 809.17 641.65 867.36 641.65 911.77"/></svg>';
      var paths = new T.SVGLoader().parse(svg).paths;
      var ext = { depth: 120, bevelEnabled: true, bevelThickness: 12, bevelSize: 7, bevelSegments: 4, curveSegments: 28 };
      var xf = new T.Matrix4().makeTranslation(-720, -601, -60), rot = new T.Matrix4().makeRotationX(Math.PI), sc = new T.Matrix4().makeScale(.17, .17, .17);
      var geo = function (p) { var g = new T.ExtrudeGeometry(T.SVGLoader.createShapes(p), ext); g.applyMatrix4(xf); g.applyMatrix4(rot); g.applyMatrix4(sc); return g; };
      var fg = function () { return getComputedStyle(root).getPropertyValue('--fg').trim() || '#F2F1EC'; };
      var rMat = new T.MeshStandardMaterial({ color: 0xFF5A1F, roughness: .35, metalness: .1, emissive: 0x3a0f00 });
      var bMat = new T.MeshStandardMaterial({ color: fg(), roughness: .45, metalness: .15 });
      var group = new T.Group(), base = new T.Mesh(geo(paths[1]), bMat); group.add(new T.Mesh(geo(paths[0]), rMat)); group.add(base); scene.add(group);
      new MutationObserver(function () { bMat.color.set(fg()); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      var size = function () { var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      new ResizeObserver(size).observe(stage); size();
      var tx = -.35, ty = .12, rx = 0, ry = 0, drag = false, lx = 0, ly = 0, ox = 0, oy = 0;
      stage.addEventListener('pointermove', function (e) { var r = stage.getBoundingClientRect(); if (drag) { ox += (e.clientX - lx) * .01; oy += (e.clientY - ly) * .01; lx = e.clientX; ly = e.clientY; } tx = ((e.clientX - r.left) / r.width - .5) * .9 + ox; ty = ((e.clientY - r.top) / r.height - .5) * .5 + oy; });
      stage.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; ly = e.clientY; stage.setPointerCapture(e.pointerId); });
      stage.addEventListener('pointerup', function () { drag = false; });
      stage.addEventListener('pointerleave', function () { if (!drag) { tx = -.35 + ox; ty = .12 + oy; } });
      var t0 = performance.now(), visible = true;
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(stage);
      function frame(now) {
        if (!visible) return;
        var t = (now - t0) / 1000; ry += (tx + Math.sin(t * .6) * .25 - ry) * .06; rx += (ty - rx) * .06;
        group.rotation.y = ry; group.rotation.x = rx; group.position.y = Math.sin(t * 1.2) * 2;
        var c = t % 4, k = c < .35 ? Math.sin(c / .35 * Math.PI) : 0;
        if (t < 1.2) { var e = t / 1.2; base.position.set(-24 * (1 - e), -18 * (1 - e), 0); } else base.position.set(k * -5, k * -3, k * 6);
        renderer.render(scene, cam); requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    } catch (e) { stage.classList.remove('has3d'); }
  }

  /* formazione e schede giocatore */
  var dataEl = $('squadra-data');
  if (dataEl) {
    var SQ = JSON.parse(dataEl.textContent), sheet = $('sheet'), cur = 0, last = null;
    var dots = [].slice.call(document.querySelectorAll('.pitch .dot')), players = [].slice.call(document.querySelectorAll('.player'));
    var hl = function (p) { dots.concat(players).forEach(function (d) { d.classList.toggle('on', d.dataset.p === p); }); };
    players.forEach(function (el) {
      ['mouseenter', 'focus'].forEach(function (ev) { el.addEventListener(ev, function () { hl(el.dataset.p); }); });
      ['mouseleave', 'blur'].forEach(function (ev) { el.addEventListener(ev, function () { hl('1'); }); });
    });
    dots.forEach(function (el) { el.addEventListener('mouseenter', function () { hl(el.dataset.p); }); el.addEventListener('mouseleave', function () { hl('1'); }); });
    hl('1');
    var fill = function (i) {
      var m = SQ[i]; cur = i;
      var nm = $('sh-name'); nm.textContent = m.nome; var sp = document.createElement('span'); sp.textContent = m.cognome; nm.appendChild(sp);
      $('sh-role').textContent = m.ruolo || ''; $('sh-pos').textContent = m.posizione || ''; $('sh-pos').hidden = !m.posizione;
      $('sh-num').textContent = m.numero; $('sh-ini').textContent = (m.nome[0] || '') + (m.cognome[0] || ''); $('sh-count').textContent = (i + 1) + ' / ' + SQ.length;
      var ph = $('sh-photo'), old = ph.querySelector('img'); if (old) old.remove();
      ph.classList.toggle('has-img', !!m.foto); ph.querySelector('.soon').hidden = !!m.foto; $('sh-ini').hidden = !!m.foto;
      if (m.foto) { var im = new Image(); im.alt = m.nome + ' ' + m.cognome; im.src = m.foto; ph.insertBefore(im, ph.firstChild); }
      var ul = $('sh-duties'); ul.innerHTML = ''; (m.compiti || []).forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
      $('sh-duties-h').hidden = ul.hidden = !(m.compiti || []).length;
      var ch = $('sh-chips'); ch.innerHTML = ''; (m.servizi || []).forEach(function (t) { var s = document.createElement('span'); s.textContent = t; ch.appendChild(s); });
      $('sh-chips-h').hidden = ch.hidden = !(m.servizi || []).length;
      hl(String(i + 1));
    };
    var open = function (i) { last = document.activeElement; fill(i); sheet.hidden = false; document.body.style.overflow = 'hidden'; sheet.querySelector('.sheet-close').focus(); };
    var close = function () { sheet.hidden = true; document.body.style.overflow = ''; hl('1'); if (last && last.focus) last.focus(); };
    players.concat(dots).forEach(function (el) {
      el.addEventListener('click', function () { open(+el.dataset.p - 1); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+el.dataset.p - 1); } });
    });
    [].slice.call(sheet.querySelectorAll('[data-close]')).forEach(function (b) { b.addEventListener('click', close); });
    $('sh-prev').addEventListener('click', function () { fill((cur + SQ.length - 1) % SQ.length); });
    $('sh-next').addEventListener('click', function () { fill((cur + 1) % SQ.length); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') fill((cur + 1) % SQ.length);
      else if (e.key === 'ArrowLeft') fill((cur + SQ.length - 1) % SQ.length);
      else if (e.key === 'Tab') { var f = [].slice.call(sheet.querySelectorAll('button')), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
  }
})();
