(function () {
  'use strict';

  var WORKUPS = [
    { re: /DKA|HHS|酮症|酸中毒|胰岛素.{0,3}低钾/, id: 'ketosis-hyperosmolar', label: '高血糖危象/低钾安全' },
    { re: /低血糖|胰岛素|磺脲|格列/, id: 'glucose-low', label: '低血糖指标追查' },
    { re: /HbA1c|A1C|血糖|二甲双胍|GLP.?1|司美格鲁肽|替尔泊肽|SGLT2|恩格列净|达格列净/, id: 'glucose-high', label: '血糖异常指标追查' },
    { re: /UACR|eGFR|白蛋白尿|肾病|肾脏/, id: 'kidney-albuminuria', label: '肾脏指标追查' },
    { re: /TSH|FT4|FT3|甲状腺|甲巯咪唑|左甲状腺素/, id: 'tsh-low', label: '甲功/低 TSH 追查' },
    { re: /结节|Bethesda|细针|FNA/, id: 'thyroid-nodule-marker', label: '甲状腺结节追查' },
    { re: /ARR|醛固酮|螺内酯|低钾.{0,6}高血压/, id: 'arr-low-potassium', label: 'ARR/低钾高血压追查' },
    { re: /皮质醇|ACTH|氢化可的松|肾上腺危象/, id: 'cortisol-low', label: '低皮质醇/肾上腺追查' },
    { re: /泌乳素|PRL|垂体|视野/, id: 'prolactin-high', label: '泌乳素/垂体追查' },
    { re: /钙|PTH|甲状旁腺/, id: 'calcium-low', label: '钙/PTH 追查' },
    { re: /骨密度|DXA|骨质疏松|脆性骨折|阿仑膦酸|地舒单抗/, id: 'bone-low-density', label: '骨密度/骨折风险追查' },
    { re: /低钠|钠|SIADH/, id: 'sodium-low', label: '低钠指标追查' }
  ];
  var ABBR = {
    'DKA': 'ketosis-hyperosmolar', 'HHS': 'ketosis-hyperosmolar', 'HbA1c': 'glucose-high', 'A1C': 'glucose-high',
    'CGM': 'glucose-low', 'SMBG': 'glucose-low', 'UACR': 'kidney-albuminuria', 'eGFR': 'kidney-albuminuria',
    'TSH': 'tsh-low', 'FT4': 'tsh-low', 'FT3': 'tsh-low', 'ARR': 'arr-low-potassium', 'ACTH': 'cortisol-low',
    'PTH': 'calcium-low', 'PRL': 'prolactin-high', 'DXA': 'bone-low-density'
  };
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]; }); }
  function findWorkup(text) { return WORKUPS.find(function (item) { return item.re.test(text); }); }
  function button(id, label) { return '<button type="button" class="cross-link" data-cross-workup="' + esc(id) + '">' + esc(label || '打开指标追查') + '</button>'; }
  function decorateMedications() {
    document.querySelectorAll('#medGrid .med-card:not([data-cross-decorated])').forEach(function (card) {
      var hit = findWorkup(card.textContent || ''); if (!hit) return;
      var row = document.createElement('div'); row.className = 'cross-link-row'; row.innerHTML = '<span>关联学习：</span>' + button(hit.id, hit.label);
      card.appendChild(row); card.dataset.crossDecorated = '1';
    });
  }
  function decorateGlossary() {
    document.querySelectorAll('#abbrGrid .abbr-card:not([data-cross-decorated])').forEach(function (card) {
      var code = (card.querySelector('b') || {}).textContent || ''; var id = ABBR[code.trim()];
      if (!id) { card.dataset.crossDecorated = '1'; return; }
      var row = document.createElement('div'); row.className = 'cross-link-row'; row.innerHTML = '<span>关联追查：</span>' + button(id, '打开相关指标追查');
      card.appendChild(row); card.dataset.crossDecorated = '1';
    });
  }
  function decoratePath() {
    var detail = document.getElementById('pathDetail'); if (!detail || detail.dataset.crossDecorated === '1' || !detail.textContent.trim()) return;
    var hit = findWorkup(detail.textContent || ''); var row = document.createElement('div'); row.className = 'cross-link-row path-cross-links';
    row.innerHTML = '<span>继续学习：</span>' + (hit ? button(hit.id, hit.label) : '<button type="button" class="cross-link" data-cross-route="workups">打开指标追查总览</button>');
    detail.appendChild(row); detail.dataset.crossDecorated = '1';
  }
  var initialized = false;
  var refreshScheduled = false;
  function refresh() {
    if (refreshScheduled) return;
    refreshScheduled = true;
    window.setTimeout(function () {
      refreshScheduled = false;
      decorateMedications(); decorateGlossary(); decoratePath();
    }, 0);
  }
  function init() {
    if (initialized) return;
    var body = document.body;
    if (!body || body.nodeType !== 1) {
      document.addEventListener('DOMContentLoaded', init, { once: true });
      return;
    }
    initialized = true;
    decorateMedications(); decorateGlossary(); decoratePath();
    document.addEventListener('click', function (event) {
      refresh();
      var b = event.target.closest('[data-cross-workup]');
      if (b) { if (typeof window.openWorkup === 'function') window.openWorkup(b.dataset.crossWorkup); else if (typeof window.show === 'function') window.show('workups'); return; }
      var route = event.target.closest('[data-cross-route]');
      if (route && typeof window.show === 'function') window.show(route.dataset.crossRoute);
    });
    document.addEventListener('input', refresh);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
