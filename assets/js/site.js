/* Slate Design Agency — site interactions */
(function(){
  var EMAIL = 'slatedesignagency1999@gmail.com';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var sT = document.querySelector('.s-trans');

  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* ---- mobile menu ---- */
  var mt = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
  if (mt) mt.addEventListener('click', function(){
    var open = mt.getAttribute('aria-expanded') !== 'true';
    mt.setAttribute('aria-expanded', String(open));
    mt.textContent = open ? 'Close −' : 'Menu +';
    nav.classList.toggle('open', open);
  });

  /* ---- home intro: S is drawing (or already drawn) -> eraser wipe ---- */
  if (root.classList.contains('s-intro') && sT) {
    var wait = root.classList.contains('s-drawn') ? 150 : 820;
    setTimeout(function(){ sT.classList.add('out'); }, wait);
    setTimeout(function(){ root.classList.remove('s-intro','s-drawn'); sT.classList.remove('out'); }, wait + 440);
  }

  /* ---- page transitions ---- */
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol.indexOf('http') !== 0) return;
    if (url.pathname === location.pathname) return;            // same page (anchor / query) – let it be
    if (reduce) return;
    e.preventDefault();
    if (a.hasAttribute('data-home') && sT) {
      sT.classList.remove('out'); void sT.offsetWidth;
      sT.classList.add('in','draw');
      setTimeout(function(){ try{ sessionStorage.setItem('slate-s','1'); }catch(err){} location.href = url.href; }, 700);
    } else {
      document.body.classList.add('leaving');
      setTimeout(function(){ location.href = url.href; }, 120);
    }
  });
  window.addEventListener('pageshow', function(){
    document.body.classList.remove('leaving');
    if (sT) sT.classList.remove('in','draw','out');
  });

  /* ---- videos: play when on screen ---- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ var v = e.target; if (e.isIntersecting) { var p = v.play(); p && p.catch(function(){}); } else v.pause(); });
  }, {threshold: .35}) : null;
  document.querySelectorAll('video[data-autoplay]').forEach(function(v){ io ? io.observe(v) : v.play(); });

  var hero = document.getElementById('hero-video');
  if (hero && hero.dataset.playlist) {
    var list = hero.dataset.playlist.split(','), i = 0;
    hero.addEventListener('ended', function(){ i = (i + 1) % list.length; hero.src = list[i]; var p = hero.play(); p && p.catch(function(){}); });
  }

  /* ---- lightbox ---- */
  var lb = document.querySelector('.lightbox'), lbV = lb && lb.querySelector('video');
  function closeLb(){ lb.classList.remove('on'); lbV.pause(); lbV.removeAttribute('src'); lbV.load(); }
  document.addEventListener('click', function(e){
    var c = e.target.closest('.clip');
    if (c && lb) { lbV.src = c.dataset.src; lb.classList.add('on'); var p = lbV.play(); p && p.catch(function(){}); lb.querySelector('.lightbox-close').focus(); }
  });
  if (lb) lb.addEventListener('click', function(e){ if (e.target === lb || e.target.closest('.lightbox-close')) closeLb(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && lb && lb.classList.contains('on')) closeLb(); });

  /* ---- contact form ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var pre = new URLSearchParams(location.search).get('s');
    if (pre) form.querySelectorAll('input[data-key]').forEach(function(c){ if (c.dataset.key === pre) c.checked = true; });
    var next = form.querySelector('input[name="_next"]');
    if (next) next.value = new URL('thanks.html', location.href).href;

    form.setAttribute('novalidate', '');
    var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;
    function phoneDigits(v){ return v.replace(/\D/g, ''); }
    var rules = {
      'f-name':  function(v){ return v.trim() ? '' : 'Please enter your name.'; },
      'f-email': function(v){ v = v.trim(); if (!v) return 'Please enter your email.'; return EMAIL_RE.test(v) ? '' : 'Please enter a valid email, like name@company.com.'; },
      'f-phone': function(v){
        v = v.trim(); if (!v) return '';                                   // optional
        if (/[^\d\s().+\-]/.test(v)) return 'Phone numbers can only use numbers, spaces, ( ), - and +.';
        var d = phoneDigits(v);
        if (d.length === 11 && d[0] === '1') d = d.slice(1);
        if (d.length < 10) return 'That phone number is too short. Please enter all 10 digits, or leave it blank.';
        if (d.length > 10) return 'That phone number is too long. Please enter a 10-digit number, or leave it blank.';
        return '';
      },
      'f-msg':   function(v){ return v.trim() ? '' : 'Please tell us a little about the project.'; }
    };
    function check(id){
      var el = document.getElementById(id), err = document.getElementById('err-' + id);
      if (!el) return true;
      var msg = rules[id](el.value);
      el.classList.toggle('invalid', !!msg);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; err.hidden = !msg; }
      return !msg;
    }
    function validateAll(){
      var first = null;
      Object.keys(rules).forEach(function(id){ if (!check(id) && !first) first = id; });
      if (first) document.getElementById(first).focus();
      return !first;
    }
    Object.keys(rules).forEach(function(id){
      var el = document.getElementById(id); if (!el) return;
      el.addEventListener('input', function(){ if (el.classList.contains('invalid')) check(id); });
      el.addEventListener('blur', function(){ if (el.value.trim()) check(id); });
    });
    var phoneEl = document.getElementById('f-phone');
    if (phoneEl) phoneEl.addEventListener('blur', function(){
      if (rules['f-phone'](phoneEl.value) || !phoneEl.value.trim()) return;
      var d = phoneDigits(phoneEl.value); if (d.length === 11) d = d.slice(1);
      phoneEl.value = '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (!validateAll()) { status.textContent = 'Please fix the highlighted fields.'; return; }
      status.textContent = '';
      var d = new FormData(form);
      if (d.get('_honey')) return;
      var payload = {
        name: d.get('name'), email: d.get('email'), phone: d.get('phone') || '—', business: d.get('business') || '—',
        services: d.getAll('services').join(', ') || '—', message: d.get('message'),
        _subject: d.get('_subject'), _replyto: d.get('email'), _template: 'table', _captcha: 'false'
      };
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true;
      status.textContent = 'Sending…';
      fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(payload)
      }).then(function(r){ return r.json().then(function(j){ if (!r.ok || String(j.success) === 'false') throw new Error(j.message || 'send failed'); }); })
        .then(function(){
          var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
          document.getElementById('form-box').innerHTML = '<div class="sent"><div class="big-check">✓</div><h3 style="font-size:30px;margin:10px 0">Got it. It\'s on the board.</h3><p>Thanks, ' + esc(payload.name) + '. We\'ll reply to ' + esc(payload.email) + ' soon.</p></div>';
        })
        .catch(function(){
          btn.disabled = false;
          var body = encodeURIComponent('Name: ' + payload.name + '\nEmail: ' + payload.email + '\nPhone: ' + payload.phone + '\nBusiness: ' + payload.business + '\nServices: ' + payload.services + '\n\n' + payload.message);
          status.innerHTML = 'That didn\'t go through. Please email us directly at <a href="mailto:' + EMAIL + '?subject=' + encodeURIComponent(payload._subject) + '&body=' + body + '" style="text-decoration:underline">' + EMAIL + '</a>.';
        });
    });
  }
})();
