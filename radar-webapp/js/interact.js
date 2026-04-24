/* interact.js – shared interaction utilities: floating panel, zoom/pan */
(function (global) {
  'use strict';

  /* ── Mouse tracker (used to position floating panel) ─────────── */
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* ── Tooltip (lightweight title-only) ────────────────────────── */
  var tooltip = null;

  function ensureTooltip() {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'sysml-tooltip';
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function showTooltip(text, evt) {
    var t = ensureTooltip();
    t.textContent = text;
    t.style.display = 'block';
    positionTooltip(evt);
  }

  function positionTooltip(evt) {
    if (!tooltip || tooltip.style.display === 'none') return;
    var x = evt.clientX + 14;
    var y = evt.clientY - 10;
    if (x + 240 > window.innerWidth) x = evt.clientX - 250;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
  }

  /* ── Floating Detail Panel ────────────────────────────────────── */
  var panel     = null;
  var hideTimer = null;

  function cancelHide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(function () { hidePanel(); }, 320);
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'detail-panel';
    panel.innerHTML =
      '<button class="detail-close" title="Close">&#x2715;</button>' +
      '<div class="detail-body"></div>';
    document.body.appendChild(panel);
    panel.querySelector('.detail-close').addEventListener('click', hidePanel);
    /* hovering the panel itself cancels any pending hide */
    panel.addEventListener('mouseenter', cancelHide);
    panel.addEventListener('mouseleave', scheduleHide);
    return panel;
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function buildSection(title, items) {
    if (!items || !items.length) return '';
    var html = '<div class="dp-section">' + esc(title) + '</div><ul class="dp-list">';
    items.forEach(function (i) { html += '<li>' + esc(i) + '</li>'; });
    return html + '</ul>';
  }

  function positionPanel() {
    if (!panel) return;
    var pw = panel.offsetWidth  || 316;
    var ph = panel.offsetHeight || 200;
    var x  = mouseX + 18;
    var y  = mouseY + 10;
    /* flip left if overflowing right edge */
    if (x + pw > window.innerWidth  - 8) x = mouseX - pw - 18;
    /* flip up if overflowing bottom edge */
    if (y + ph > window.innerHeight - 8) y = mouseY - ph - 10;
    /* clamp inside viewport */
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    panel.style.left = x + 'px';
    panel.style.top  = y + 'px';
  }

  function showPanel(detail) {
    cancelHide();
    var p = ensurePanel();
    var html = '';
    if (detail.stereotype) {
      html += '<div class="dp-stereo">«' + esc(detail.stereotype) + '»</div>';
    }
    html += '<h3 class="dp-title">' + esc(detail.title) + '</h3>';
    if (detail.source) {
      html += '<div class="dp-meta">Source: ' + esc(detail.source) + '</div>';
    }
    if (detail.description) {
      html += '<p class="dp-desc">' + esc(detail.description) + '</p>';
    }
    html += buildSection('Values / Parameters', detail.values);
    html += buildSection('Operations', detail.operations);
    html += buildSection('Constraints', detail.constraints);
    if (detail.note) {
      html += '<div class="dp-note">' + esc(detail.note) + '</div>';
    }
    if (detail.crossRefs && detail.crossRefs.length) {
      html += '<div class="dp-section">Related — click element to jump</div>';
      detail.crossRefs.forEach(function (ref) {
        html += '<a class="dp-crossref" href="' + esc(ref.page) + '?highlight=' + esc(ref.id) + '">' + esc(ref.label) + ' &rarr;</a>';
      });
    }
    p.querySelector('.detail-body').innerHTML = html;
    p.classList.add('open');
    /* position after content is rendered so offsetHeight is correct */
    requestAnimationFrame(positionPanel);
  }

  function hidePanel() {
    cancelHide();
    if (panel) panel.classList.remove('open');
  }

  /* ── Zoom / Pan ───────────────────────────────────────────────── */
  function initZoomPan(svgEl) {
    if (!svgEl) return null;

    var vbStr = svgEl.getAttribute('viewBox');
    var vb;
    if (vbStr) {
      var pts = vbStr.split(/[\s,]+/).map(parseFloat);
      vb = { x: pts[0], y: pts[1], w: pts[2], h: pts[3] };
    } else {
      vb = { x: 0, y: 0,
             w: parseFloat(svgEl.getAttribute('width'))  || 800,
             h: parseFloat(svgEl.getAttribute('height')) || 600 };
    }
    var orig = { x: vb.x, y: vb.y, w: vb.w, h: vb.h };

    function applyVB() {
      svgEl.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
    }
    applyVB();

    var dragging = false, moved = false, dragStart, vbOnDrag;

    svgEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY > 0 ? 1.1 : 1 / 1.1;
      var rect = svgEl.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width;
      var my = (e.clientY - rect.top)  / rect.height;
      var nw = vb.w * factor, nh = vb.h * factor;
      vb.x += (vb.w - nw) * mx;
      vb.y += (vb.h - nh) * my;
      vb.w = nw; vb.h = nh;
      applyVB();
    }, { passive: false });

    svgEl.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = false;
      dragStart = { x: e.clientX, y: e.clientY };
      vbOnDrag  = { x: vb.x, y: vb.y };
      svgEl.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) moved = true;
      if (!moved) return;
      var rect = svgEl.getBoundingClientRect();
      vb.x = vbOnDrag.x - dx * (vb.w / rect.width);
      vb.y = vbOnDrag.y - dy * (vb.h / rect.height);
      applyVB();
    });

    window.addEventListener('mouseup', function () {
      if (dragging) { dragging = false; svgEl.style.cursor = 'grab'; }
    });

    svgEl.style.cursor = 'grab';

    return {
      reset:      function () { vb = { x: orig.x, y: orig.y, w: orig.w, h: orig.h }; applyVB(); },
      zoomIn:     function () { var f = 1/1.3; vb.x += vb.w*(1-f)/2; vb.y += vb.h*(1-f)/2; vb.w*=f; vb.h*=f; applyVB(); },
      zoomOut:    function () { var f = 1.3;   vb.x += vb.w*(1-f)/2; vb.y += vb.h*(1-f)/2; vb.w*=f; vb.h*=f; applyVB(); },
      wasDragged: function () { return moved; },
      clearDrag:  function () { moved = false; }
    };
  }

  /* ── URL-based highlight on page load ────────────────────────── */
  function highlightFromURL(svgEl, onFound) {
    try {
      var params = new URLSearchParams(window.location.search);
      var targetId = params.get('highlight');
      if (!targetId) return;
      var g = svgEl.querySelector('[data-id="' + targetId + '"]');
      if (!g) return;
      g.classList.add('highlight-flash');
      g.addEventListener('animationend', function () { g.classList.remove('highlight-flash'); }, { once: true });
      setTimeout(function () {
        if (onFound) onFound(g, targetId);
        var wrap = svgEl.closest('.diagram-wrap') || svgEl.parentElement;
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (e) {}
  }

  function initZoomToolbar(toolbarId, zoomCtrl) {
    if (!zoomCtrl) return;
    var bar = document.getElementById(toolbarId);
    if (!bar) return;
    var zi = bar.querySelector('[data-zoom="in"]');
    var zo = bar.querySelector('[data-zoom="out"]');
    var zr = bar.querySelector('[data-zoom="reset"]');
    if (zi) zi.addEventListener('click', zoomCtrl.zoomIn);
    if (zo) zo.addEventListener('click', zoomCtrl.zoomOut);
    if (zr) zr.addEventListener('click', zoomCtrl.reset);
  }

  /* ── Link badges (→ arrow on linked elements) ────────────────── */
  function addLinkBadges(svgEl, detailsMap) {
    if (!svgEl || !detailsMap) return;
    svgEl.querySelectorAll('[data-id]').forEach(function (g) {
      var id  = g.getAttribute('data-id');
      var det = detailsMap[id];
      if (!det || !det.crossRefs || !det.crossRefs.length) return;
      try {
        var bb = g.getBBox();
        var bx = bb.x + bb.width - 1;
        var by = bb.y + 1;
        var badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badge.setAttribute('class', 'link-badge');
        badge.setAttribute('pointer-events', 'none');
        var pill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pill.setAttribute('x',      bx - 14);
        pill.setAttribute('y',      by);
        pill.setAttribute('width',  14);
        pill.setAttribute('height', 11);
        pill.setAttribute('rx',     5);
        pill.setAttribute('fill',   '#2E86AB');
        badge.appendChild(pill);
        var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x',                 bx - 7);
        txt.setAttribute('y',                 by + 5.5);
        txt.setAttribute('text-anchor',       'middle');
        txt.setAttribute('dominant-baseline', 'middle');
        txt.setAttribute('font-size',         '8');
        txt.setAttribute('font-weight',       'bold');
        txt.setAttribute('fill',              '#FFFFFF');
        txt.setAttribute('font-family',       'Segoe UI, Arial, sans-serif');
        txt.textContent = '→';   /* → arrow */
        badge.appendChild(txt);
        g.parentElement.appendChild(badge);
      } catch (e) {}
    });
  }

  /* ── Export ───────────────────────────────────────────────────── */
  global.SysMLInteract = {
    showTooltip:      showTooltip,
    positionTooltip:  positionTooltip,
    hideTooltip:      hideTooltip,
    showPanel:        showPanel,
    hidePanel:        hidePanel,
    scheduleHide:     scheduleHide,
    cancelHide:       cancelHide,
    initZoomPan:      initZoomPan,
    initZoomToolbar:  initZoomToolbar,
    highlightFromURL: highlightFromURL,
    addLinkBadges:    addLinkBadges
  };

}(window));
