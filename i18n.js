/**
 * AstroNexus Bilingual Engine
 * - Auto-detects system language on first visit (zh-* → Chinese, else English)
 * - Persists choice in localStorage
 * - Renders [data-zh] / [data-en] attributes on every element
 * - Updates <html lang>, <title>, nav logo, and lang-toggle button state
 */
(function () {
  var STORAGE_KEY = 'astro_lang';

  /* ─── Determine active language ─────────────────────────────── */
  function detectLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : 'en';
  }

  /* ─── Apply translations ─────────────────────────────────────── */
  function applyLang(lang) {
    var attr = 'data-' + lang;
    /* Text nodes */
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var val = el.getAttribute(attr);
      if (val !== null) {
        /* If the element contains only text (no child elements), set textContent */
        if (el.children.length === 0) {
          el.textContent = val;
        } else {
          /* Elements with children use innerHTML — author must escape properly */
          el.innerHTML = val;
        }
      }
    });
    /* <html lang> */
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    /* <title> */
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var t = titleEl.getAttribute('data-' + lang);
      if (t) titleEl.textContent = t;
    }
    /* Nav logo */
    var logo = document.querySelector('.logo');
    if (logo) {
      var l = logo.getAttribute('data-' + lang);
      if (l) logo.innerHTML = l;
    }
    /* Lang toggle buttons */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-active', active);
    });
    /* Persist */
    localStorage.setItem(STORAGE_KEY, lang);
    window.__astroLang = lang;
  }

  /* ─── Public switch function ─────────────────────────────────── */
  window.astroSetLang = function (lang) {
    applyLang(lang);
  };

  /* ─── Bootstrap ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    applyLang(detectLang());
    /* Wire toggle buttons added to the DOM */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.astroSetLang(btn.getAttribute('data-lang'));
      });
    });
  });
})();
