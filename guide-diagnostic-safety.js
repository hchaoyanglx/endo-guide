(function () {
  'use strict';

  /*
   * 诊断防漏诊索引只做“已有内容的交叉索引”，不新增诊断阈值或治疗建议。
   * 每个关联项都回链到站内已有的异常指标/主诉卡，使用时仍需回到对应指南全文核对。
   */
  var INDEX = {
    diabetes: { workups: ['glucose-high', 'ketosis-hyperosmolar', 'glucose-low', 'kidney-albuminuria', 'lipid-abnormal', 'liver-enzymes', 'diabetic-foot'], symptoms: ['polyuria-polydipsia', 'hypoglycemia-episodes', 'foot-ulcer', 'vision-blurred'] },
    prediabetes: { workups: ['glucose-high', 'obesity-measures', 'lipid-abnormal', 'liver-enzymes'], symptoms: ['polyuria-polydipsia', 'lipid-abnormal'] },
    obesity: { workups: ['obesity-measures', 'glucose-high', 'lipid-abnormal', 'liver-enzymes', 'pcos-androgen'], symptoms: ['fatigue-weightgain', 'hirsutism-menstrual'] },
    'thyroid-nodule': { workups: ['thyroid-nodule-marker', 'tsh-low', 'tsh-high'], symptoms: ['neck-mass-thyroid', 'incidental-thyroid'] },
    dyslipidemia: { workups: ['lipid-abnormal', 'glucose-high', 'liver-enzymes', 'kidney-albuminuria'], symptoms: ['lipid-abnormal'] },
    gout: { workups: ['uric-acid'], symptoms: ['joint-swelling-pain'] },
    osteoporosis: { workups: ['bone-low-density', 'calcium-low'], symptoms: ['bone-pain-fracture', 'edema-osteoporosis'] },
    hypoglycemia: { workups: ['glucose-low'], symptoms: ['hypoglycemia-episodes'] },
    'pituitary-tumor': { workups: ['prolactin-high', 'growth-igf1', 'cortisol-high', 'cortisol-low'], symptoms: ['pituitary-headache-vision', 'galactorrhea-amenorrhea', 'vision-blurred'] },
    cushing: { workups: ['cortisol-high', 'glucose-high', 'lipid-abnormal', 'bone-low-density'], symptoms: ['fatigue-weightgain'] },
    ppgl: { workups: ['metanephrine-high'], symptoms: ['palpitation-weightloss', 'hypertension-hypokalemia'] },
    hypopituitarism: { workups: ['cortisol-low', 'tsh-low', 'growth-igf1', 'prolactin-high', 'glucose-low'], symptoms: ['fatigue-weightgain', 'galactorrhea-amenorrhea'] },
    hypopara: { workups: ['calcium-low'] },
    'adrenal-other': { workups: ['cortisol-low', 'sodium-low'], symptoms: ['fatigue-weightgain'] },
    hyperthyroidism: { workups: ['tsh-low', 'thyroid-nodule-marker'], symptoms: ['palpitation-weightloss', 'vision-blurred', 'abnormal-tft'] },
    hypothyroidism: { workups: ['tsh-high'], symptoms: ['fatigue-weightgain', 'edema', 'abnormal-tft'] },
    thyroiditis: { workups: ['tsh-low', 'tsh-high'], symptoms: ['neck-mass-thyroid', 'abnormal-tft'] },
    hyponatremia: { workups: ['sodium-low', 'cortisol-low', 'tsh-high'] },
    'diabetes-insipidus': { symptoms: ['polyuria-polydipsia', 'hypernatremia'] },
    'primary-hyperpara': { symptoms: ['hypercalcemia', 'hypercalcemia-symptom'] },
    'primary-aldosteronism': { workups: ['arr-low-potassium'], symptoms: ['hypertension-hypokalemia', 'hypokalemia'] },
    'adrenal-incidentaloma': { workups: ['cortisol-high', 'metanephrine-high', 'arr-low-potassium'], symptoms: ['incidental-adrenal'] },
    men1: { workups: ['prolactin-high', 'growth-igf1'], symptoms: ['galactorrhea-amenorrhea', 'hypercalcemia'] }
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function arr(value) { return Array.isArray(value) ? value : []; }
  function unique(values) {
    var seen = Object.create(null);
    return arr(values).filter(function (x) {
      var key = String(x == null ? '' : x);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }
  function workup(id) { return arr(window.ABNORMAL_WORKUPS).find(function (x) { return x.id === id; }); }
  function symptom(id) { return arr(window.SYMPTOM_DIRECTORY).find(function (x) { return x.id === id; }); }
  function diseasePath(d, re) {
    return arr(d && d.path).filter(function (p) { return re.test(String(p && p[0] || '')); });
  }
  function asList(items, empty) {
    var list = unique(items).map(esc);
    return list.length ? '<ul>' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<p class="plain">' + esc(empty || '当前已录入资料未单独列出这一项；请打开来源指南核对。') + '</p>';
  }
  function linkWorkups(items) {
    return items.length ? '<div class="source-chips">' + items.map(function (w) { return '<button type="button" class="source-chip" data-sym-workup="' + esc(w.id) + '">打开：' + esc(w.title) + '</button>'; }).join('') + '</div>' : '';
  }
  function linkSymptoms(items) {
    return items.length ? '<div class="source-chips">' + items.map(function (s) { return '<button type="button" class="source-chip" data-diagnostic-symptom="' + esc(s.id) + '">打开：' + esc(s.title) + '</button>'; }).join('') + '</div>' : '';
  }

  function render(d) {
    var cfg = INDEX[d && d.id] || {};
    var ws = arr(cfg.workups).map(workup).filter(Boolean);
    var ss = arr(cfg.symptoms).map(symptom).filter(Boolean);
    var diagnosisPath = diseasePath(d, /诊断|确认|筛查|分型|评估|排除|鉴别/);
    var followPath = diseasePath(d, /复查|随访|监测|目标|转诊|复评/);
    var tests = [];
    var branches = [];
    var differentials = [];
    var urgent = [];
    var next = [];
    ws.forEach(function (w) {
      arr(w.tests).forEach(function (x) { if (Array.isArray(x)) tests.push(String(x[0] || '') + '：' + String(x[1] || '')); });
      arr(w.branches).forEach(function (x) { branches.push(x); });
      arr(w.differentials).forEach(function (x) { differentials.push(Array.isArray(x) ? String(x[0] || '') + '：' + String(x[1] || '') + '；区分：' + String(x[2] || '') : x); });
      arr(w.urgent).forEach(function (x) { urgent.push(x); });
    });
    ss.forEach(function (s) {
      arr(s.differential).forEach(function (x) { differentials.push(Array.isArray(x) ? String(x[0] || '') + '：' + String(x[1] || '') + '；检查/意义：' + String(x[2] || '') : x); });
      arr(s.enrichment && s.enrichment.redFlags).forEach(function (x) { urgent.push(x); });
      arr(s.enrichment && s.enrichment.next).forEach(function (x) { next.push(x); });
    });
    followPath.forEach(function (p) { arr(p[1]).forEach(function (x) { next.push(x); }); });
    var pathText = diagnosisPath.map(function (p) { return String(p[0] || '') + '：' + arr(p[1]).join('；'); });
    var hasAny = ws.length || ss.length || diagnosisPath.length || followPath.length;
    return '<section class="workup-section diagnostic-safety-panel">' +
      '<h4>诊断防漏诊清单：先确认 → 首轮检查 → 解释与鉴别 → 危险信号 → 复核</h4>' +
      '<p class="plain">本区只整合本页已有的指南路径、异常指标追查和主诉卡，不把单项异常直接等同于病因诊断。没有结构化内容的部分不会自动生成阈值或剂量，请点击来源并回到原指南核对。</p>' +
      (!hasAny ? '<div class="notice"><b>当前疾病卡尚未建立专项交叉索引。</b>可先从“主诉入口”和“异常指标追查”检索相关症状/指标，再回到本疾病来源核对。</div>' : '') +
      '<div class="diagnostic-grid">' +
      '<div class="diagnostic-row"><b>先确认的诊断问题</b><span>' + asList(pathText, '本疾病卡未单独列出诊断分层；先核对病史、检测条件与指南适用范围。') + '</span></div>' +
      '<div class="diagnostic-row"><b>首轮辅助检查及意义</b><span>' + asList(tests, '当前已关联路径未提供首轮检查清单；请打开对应原始指南/异常指标路径。') + linkWorkups(ws) + '</span></div>' +
      '<div class="diagnostic-row"><b>结果出来后的分支与鉴别</b><span>' + asList(branches.concat(differentials), '当前已关联资料未单独列出分支或鉴别；不要仅凭单项结果下结论。') + linkSymptoms(ss) + '</span></div>' +
      '<div class="diagnostic-row"><b>危险信号与升级</b><span>' + asList(urgent, '当前已关联资料未单独列出危险信号；如生命体征、意识、视力或快速恶化异常，应按院内急救/会诊流程升级。') + '</span></div>' +
      '<div class="diagnostic-row"><b>复核、随访与安全网</b><span>' + asList(next, '以本页来源指南的复评/随访要求为准；未完成检查或结果未回报时，应在病历中明确责任人与下一步。') + '</span></div>' +
      '</div><div class="trace"><b>交叉索引范围：</b>' + esc(ws.map(function (w) { return w.title; }).concat(ss.map(function (s) { return s.title; })).join('；') || '本疾病的现有路径') + '</div></section>';
  }

  window.DIAGNOSTIC_SAFETY = INDEX;
  window.diagnosticSafetyHtml = render;
})();
