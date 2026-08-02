(function () {
  'use strict';

  var root = document.getElementById('patientSimulator');
  if (!root) return;

  // v2：将原来的独立步骤合并为三个连续考站，并增加检查状态、证据矩阵和医嘱记录。
  // 使用新键名避免旧版本中途状态与新流程混用。
  var STORAGE_KEY = 'endo-guide-patient-simulator-v2';
  var DIAGNOSTIC_SYMPTOM_BANK = [
    { id: 'fever', label: '发热', question: '有没有发热？最高体温、持续时间、寒战或出汗怎样？', keywords: ['发热', '体温', '寒战', '出汗'] },
    { id: 'bleeding', label: '皮肤黏膜出血', question: '有没有皮肤瘀点瘀斑、鼻出血、牙龈出血或其他异常出血？', keywords: ['出血', '瘀点', '瘀斑', '鼻出血', '牙龈'] },
    { id: 'edema', label: '水肿', question: '有没有眼睑或下肢水肿？何时出现，晨起或傍晚是否不同？', keywords: ['水肿', '肿'] },
    { id: 'cough', label: '咳嗽与咳痰', question: '有没有咳嗽、咳痰？痰量、颜色、气味和出现时间怎样？', keywords: ['咳嗽', '咳痰', '痰'] },
    { id: 'hemoptysis', label: '咯血', question: '有没有咯血或痰中带血？大约多少，是否反复？', keywords: ['咯血', '痰中带血'] },
    { id: 'cyanosis', label: '发绀', question: '有没有口唇或指甲发紫？与活动、寒冷或呼吸困难是否相关？', keywords: ['发绀', '发紫', '紫'] },
    { id: 'dyspnea', label: '呼吸困难', question: '有没有呼吸困难？活动后、平卧时或夜间是否加重？', keywords: ['呼吸困难', '气短', '喘'] },
    { id: 'chest-pain', label: '胸痛', question: '有没有胸痛？部位、性质、持续时间，是否与活动或呼吸有关？', keywords: ['胸痛', '胸闷'] },
    { id: 'palpitation', label: '心悸', question: '有没有心悸？发作是否突然，持续多久，是否伴晕厥或胸痛？', keywords: ['心悸', '心慌', '心跳'] },
    { id: 'nausea-vomit', label: '恶心与呕吐', question: '有没有恶心呕吐？次数、呕吐物性状、与进食及腹痛的关系怎样？', keywords: ['恶心', '呕吐', '吐'] },
    { id: 'reflux', label: '烧心与反流', question: '有没有烧心、反酸或胃内容物反流？平卧或进食后是否加重？', keywords: ['烧心', '反流', '反酸'] },
    { id: 'dysphagia', label: '吞咽困难', question: '有没有吞咽困难？固体或液体更明显，是否进行性加重？', keywords: ['吞咽困难', '吞咽'] },
    { id: 'hematemesis', label: '呕血', question: '有没有呕血或咖啡色呕吐物？大约量、颜色和是否伴黑便？', keywords: ['呕血', '咖啡色'] },
    { id: 'melena', label: '便血', question: '有没有黑便或便血？颜色、次数、量以及是否头晕乏力？', keywords: ['便血', '黑便'] },
    { id: 'abdominal-pain', label: '腹痛', question: '有没有腹痛？部位、起病方式、性质、持续时间及放射部位怎样？', keywords: ['腹痛', '肚子痛'] },
    { id: 'diarrhea', label: '腹泻', question: '有没有腹泻？次数、性状、是否带血或黏液，是否伴发热和呕吐？', keywords: ['腹泻', '拉肚子'] },
    { id: 'constipation', label: '便秘', question: '排便是否减少或困难？大便性状、持续时间及是否腹胀腹痛怎样？', keywords: ['便秘', '排便'] },
    { id: 'jaundice', label: '黄疸', question: '有没有眼白或皮肤发黄、尿色加深、大便变浅或皮肤瘙痒？', keywords: ['黄疸', '发黄', '尿色', '瘙痒'] },
    { id: 'back-pain', label: '腰背痛', question: '有没有腰背痛？是否与活动、体位或排尿相关，是否伴下肢麻木无力？', keywords: ['腰背痛', '腰痛', '背痛'] },
    { id: 'arthralgia', label: '关节痛', question: '有没有关节痛或肿胀？涉及哪些关节，晨僵多久，是否对称或游走？', keywords: ['关节痛', '关节肿', '晨僵'] },
    { id: 'hematuria', label: '血尿', question: '有没有肉眼血尿或尿色异常？是否伴腰痛、尿痛或血块？', keywords: ['血尿', '尿色异常'] },
    { id: 'urinary-irritation', label: '尿频尿急尿痛', question: '有没有尿频、尿急或尿痛？是否伴发热、腰痛或血尿？', keywords: ['尿频', '尿急', '尿痛'] },
    { id: 'urine-volume', label: '少尿无尿多尿', question: '近期尿量有没有明显变化？大致次数和夜尿情况怎样？', keywords: ['少尿', '无尿', '多尿', '尿量', '夜尿'] },
    { id: 'urinary-difficulty', label: '排尿困难', question: '有没有排尿费力、尿线变细、尿潴留或排尿不尽感？', keywords: ['排尿困难', '尿线', '尿潴留'] },
    { id: 'vaginal-bleeding', label: '阴道流血', question: '有没有异常阴道流血？与月经、妊娠可能、性交或疼痛的关系怎样？', keywords: ['阴道流血', '月经', '妊娠'] },
    { id: 'obesity', label: '肥胖相关表现', question: '体重和腰围近年如何变化？是否有打鼾、白天嗜睡、月经异常或运动耐量下降？', keywords: ['体重', '腰围', '肥胖', '打鼾'] },
    { id: 'weight-loss', label: '消瘦', question: '体重从何时开始下降？是否伴食欲、口渴多尿、腹泻或发热变化？', keywords: ['消瘦', '体重下降', '减重'] },
    { id: 'headache', label: '头痛', question: '有没有头痛？起病是否突然，部位、性质、频率及是否伴呕吐或视力改变？', keywords: ['头痛', '头晕'] },
    { id: 'vertigo', label: '眩晕', question: '有没有旋转感或站立不稳？与体位、听力变化、耳鸣或神经症状有关吗？', keywords: ['眩晕', '旋转', '站立不稳'] },
    { id: 'syncope', label: '晕厥', question: '有没有短暂意识丧失？发生前是否心悸、胸痛、体位改变或运动，恢复后是否遗留症状？', keywords: ['晕厥', '意识丧失'] },
    { id: 'seizure', label: '抽搐与惊厥', question: '有没有抽搐？发作时意识、肢体动作、持续时间和发作后状态怎样？', keywords: ['抽搐', '惊厥'] },
    { id: 'consciousness', label: '意识障碍', question: '有没有嗜睡、定向力改变、反应变慢或行为异常？起病和进展怎样？', keywords: ['意识障碍', '嗜睡', '反应变慢'] },
    { id: 'sleep', label: '睡眠障碍', question: '有没有入睡困难、夜间反复醒、白天嗜睡或打鼾憋醒？', keywords: ['睡眠', '失眠', '嗜睡', '打鼾'] },
    { id: 'mood', label: '情感症状', question: '近期情绪、兴趣、焦虑和精力有没有明显变化？是否影响睡眠和日常功能？', keywords: ['情绪', '焦虑', '抑郁', '兴趣'] }
    , { id: 'urinary-incontinence', label: '尿失禁', question: '是否有不自主漏尿？发生在咳嗽、打喷嚏、急迫感后，还是持续滴漏？', keywords: ['尿失禁', '漏尿', '尿液不自主'] }
  ];
  var CASE_COMPLETION = window.SIM_CASE_COMPLETION || {};
  function completeCaseTemplate(item) {
    var supplied = CASE_COMPLETION[item.id] || {};
    var completion = Object.assign({
      timeline: '本次训练固定时间线：患者在主诉出现后按病例题干到诊，先完成危险信号筛查，再完成分层检查。',
      past: '患者否认与本病例无关的重大手术、长期住院、结核、病毒性肝炎和输血史；相关既往史见病例回答。',
      allergy: '患者否认已知药物、食物和造影剂过敏；既往没有严重过敏反应。',
      meds: '当前没有病例外新增药物；既往处方、保健品和最近一次用药已在问诊时逐项核对。',
      family: '无明确同类遗传病家族史；病例中已经标出的家族线索以既有回答为准。',
      social: '不吸烟，饮酒少量；日常活动和照护支持情况按本例固定回答记录。',
      reproductive: '女性训练分支按适用问题记录末次月经、妊娠可能和生育计划；男性训练分支记录为不适用且无相关异常主诉。',
      systemReview: '除病例已经标出的主线症状外，患者否认持续高热、胸痛、静息呼吸困难、进行性意识改变和活动后晕厥。',
      symptoms: {}
    }, item.completion || {}, supplied);
    completion.symptoms = Object.assign({}, (item.completion && item.completion.symptoms) || {}, supplied.symptoms || {});
    item.completion = completion;
    var extras = [
      { id: 'completion-timeline', question: '请按时间线说明起病日期/起病方式、变化趋势、最近一次发作和就诊前处理。', answer: completion.timeline, why: '建立可核对的主诉时间轴，决定急慢性分流和检查顺序。', essential: true },
      { id: 'completion-past', question: '既往有无相关疾病、手术、住院、输血、感染或长期激素使用？', answer: completion.past, why: '补齐会改变分型、鉴别诊断和治疗安全性的既往史。' },
      { id: 'completion-allergy', question: '有无药物、食物、造影剂过敏或严重过敏反应？', answer: completion.allergy, why: '在开检查、给药和住院医嘱前完成过敏史核对。' },
      { id: 'completion-medications', question: '请逐项核对处方药、非处方药、保健品、最近停药/漏药和不良反应。', answer: completion.meds, why: '药物暴露、漏服和相互作用可能改变检查解释和治疗安全。', sensitive: false },
      { id: 'completion-family', question: '家族中有无同类内分泌病、早发心血管病、肿瘤或遗传病？', answer: completion.family, why: '家族史用于风险分层、分型线索和必要时的遗传评估。' },
      { id: 'completion-social', question: '请补充吸烟、饮酒、饮食、运动、职业暴露、照护和依从性情况。', answer: completion.social, why: '个人和社会背景会影响风险、治疗可执行性和出院安全。' },
      { id: 'completion-reproductive', question: '适用时请询问末次月经、妊娠可能、哺乳、生育计划和性生活相关风险。', answer: completion.reproductive, why: '妊娠、生育和性腺状态可能改变检查、药物和转诊路径。', sensitive: true },
      { id: 'completion-system-review', question: '系统回顾：除主线症状外，是否有发热、胸痛、呼吸困难、意识改变、晕厥或其他危险表现？', answer: completion.systemReview, why: '明确阴性危险信号，避免遗漏需要升级的表现。', redFlag: true }
    ];
    item.history = (item.history || []).slice();
    extras.forEach(function (extra) {
      if (!item.history.some(function (x) { return x.id === extra.id; })) item.history.push(extra);
    });
    (item.exams || []).forEach(function (exam) {
      if (!exam.meaning) exam.meaning = '本病例固定查体结果已预设；需结合主诉、生命体征和辅助检查解释。';
      if (!exam.normalRange) exam.normalRange = /血压|BP/.test(exam.label || '') ? '成人静息血压常用参考：<120/80 mmHg；按年龄、妊娠和疾病情境解释。' : '体格检查无单一数值参考范围；以对称性、严重程度和病情变化记录。';
    });
    (item.tests || []).forEach(function (test) {
      if (!test.interpretation) test.interpretation = '本病例已设定文字报告；先与参考区间、症状和其他检查整合，再作下一步判断。';
      if (!test.why) test.why = '该检查用于确认诊断、评估严重程度或排除关键鉴别诊断。';
      if (!test.normalRange) test.normalRange = /MRI|CT|超声|彩超|影像|视野|X线|胸片/.test(String(test.name || '')) ? '影像/功能检查无统一单一数值参考范围；以报告单、年龄和检查方法为准。' : '以本院实验室报告单参考区间为准；不同方法和人群不能直接套用。';
    });
    return item;
  }
  var CASES = [
    {
      id: 'new-t2d', group: '糖尿病/糖尿病前期', title: '体检发现血糖升高',
      intro: '一位成年人因体检发现空腹血糖和 HbA1c 异常来诊。先确认诊断，再判断是否有急性代谢危险。',
      demographics: { ages: [42, 46, 51, 57, 63], sexes: ['男', '女'], jobs: ['办公室职员', '教师', '个体经营者', '退休人员'] },
      complaints: ['体检发现血糖高', '最近口渴、夜尿增多', '担心是不是糖尿病'],
      moods: [
        { id: 'anxious', label: '有些焦虑', opening: '我看到报告就很担心，能不能先告诉我最需要做什么？', after: '谢谢你先解释，我愿意一步一步配合。', style: '会反复确认结果是不是很严重。' },
        { id: 'quiet', label: '话不多、略拘谨', opening: '嗯……我也不知道该从哪里说起。', after: '这样问我就容易多了，我可以继续回答。', style: '敏感问题在建立信任前回答较简短。' },
        { id: 'calm', label: '平静配合', opening: '我把以前的体检结果也带来了，您可以一起看看。', after: '好的，我明白检查各自要解决什么问题。', style: '能主动补充病史。' }
      ],
      history: [
        { id: 'symptoms', question: '有没有口渴、多尿、体重下降、视物模糊或乏力？', answer: '近 2 个月口渴、夜间起夜增多，体重下降约 3 kg；没有呕吐或腹痛。', why: '确认典型高血糖症状，并初筛分解代谢表现。', sensitive: false },
        { id: 'meds', question: '近期用了糖皮质激素、保健品或影响血糖的药吗？', answer: '没有使用糖皮质激素；偶尔吃止痛药，没有规律服用降糖药。', why: '药物和应激可造成继发性或暂时性高血糖。', sensitive: false },
        { id: 'family', question: '既往有没有妊娠糖尿病、胰腺疾病或糖尿病家族史？', answer: '母亲患 2 型糖尿病；本人没有胰腺手术史。', why: '家族史和胰腺病史帮助分型与风险评估。', sensitive: false },
        { id: 'red', question: '有没有持续呕吐、腹痛、深快呼吸、嗜睡或意识改变？', answer: '没有这些表现，能正常进食饮水。', why: '这是 DKA/HHS 的危险信号；没有危险信号也要结合检查排除。', redFlag: true }
      ],
      exams: [
        { id: 'vitals', label: '生命体征与容量状态', result: 'BP 138/84 mmHg，HR 86/min，体温 36.7℃；口腔黏膜不干，无明显体位性低血压。', meaning: '目前未见明显休克或重度脱水证据，但仍需结合血糖、酮体和电解质。' },
        { id: 'weight', label: '体重、BMI 与皮肤', result: 'BMI 28.1 kg/m²，腰围 97 cm；无黑棘皮样改变。', meaning: '超重/腹型肥胖提示胰岛素抵抗风险，不能单凭体型确定分型。' },
        { id: 'feet', label: '足部与神经快速筛查', result: '足背动脉可触及，皮肤完整；10 g 单丝感觉基本保留。', meaning: '建立并发症基线，异常时进入足病/神经病变追查路径。' }
      ],
      tests: [
        { id: 'glucose', name: '空腹血糖 + HbA1c', stage: '首轮', workupId: 'glucose-high', result: 'FPG 8.2 mmol/L；HbA1c 7.1%。', interpretation: '本模拟设为同次样本有两种异常结果，已满足实验室诊断确认；下一步转入分型线索、并发症基线和心肾风险评估。', why: '确认是否达到诊断阈值，并估计近期平均血糖。', essential: true },
        { id: 'ketone', name: '血 β-羟丁酸、血气/碳酸氢根', stage: '有症状或高风险时首轮', workupId: 'ketosis-hyperosmolar', result: 'β-羟丁酸 0.2 mmol/L，静脉血 pH 7.39，HCO₃⁻ 24 mmol/L。', interpretation: '当前不支持 DKA；若出现呕吐、腹痛、深快呼吸或意识改变，应立即升级急症评估。', why: '高血糖伴分解代谢症状时不能只看血糖。', essential: true },
        { id: 'classification', name: 'C 肽与胰岛自身抗体（按分型需要）', stage: '第二轮/分型', workupId: 'glucose-high', result: 'C 肽尚可测；GAD 抗体阴性。', interpretation: '结果需结合病程、用药和同步血糖解释；不能单凭一项抗体排除 1 型或 LADA。', why: '成人新发糖尿病存在分型不确定性时再选择。', essential: false }
      ],
      decisions: [
        { id: 'confirm', label: '按无危象、疑似新发 2 型糖尿病路径确认诊断并评估并发症', correct: true, why: '当前有两项异常结果且无危象；下一步应完成诊断确认、分型线索、肾脏/眼底/足部与心血管风险评估。', links: [{ type: 'workup', id: 'glucose-high', label: '打开血糖异常指标追查' }] },
        { id: 'insulin-now', label: '仅凭一次体检结果立即开始胰岛素并跳过酮体评估', correct: false, why: '无危象、无明显分解代谢时不能省略诊断确认和风险评估；是否用胰岛素取决于症状、A1C、分解代谢和分型。' },
        { id: 'wait', label: '让患者一年后再复查，不做进一步评估', correct: false, why: '已达到诊断阈值的异常结果不能延迟一年处理；糖尿病前期和糖尿病都应进入相应管理路径。' }
      ],
      source: ['ADA《Standards of Care in Diabetes—2026》：诊断与分型、综合评估、药物治疗与并发症筛查', '本模拟器只呈现路径与解释，不替代原指南或处方审核'],
      note: '学习重点：先确认诊断与危象，再根据共病、体重、肾心风险和分型选择治疗。'
    },
    {
      id: 'dka-low-k', group: '糖尿病急症', title: '呕吐、腹痛与深快呼吸',
      intro: '患者自述“糖不算特别高”，但出现呕吐和深快呼吸。请把 DKA/HHS 的诊断、容量与钾安全放在同一条路径中。',
      demographics: { ages: [19, 24, 31, 38, 55], sexes: ['男', '女'], jobs: ['大学生', '设计师', '销售', '护士'] },
      complaints: ['恶心呕吐、腹痛', '深快呼吸、明显乏力', '最近漏打胰岛素或正在用 SGLT2 抑制剂'],
      moods: [
        { id: 'fear', label: '明显害怕', opening: '我是不是快昏迷了？请先告诉我现在最危险的是什么。', after: '我知道要先监测和补液，会配合抽血。', style: '语速快，容易把“血糖不高”理解成“没有危险”。' },
        { id: 'irritable', label: '疲惫、略急躁', opening: '我已经很难受了，能不能别问太多，先处理？', after: '好，先做必要检查，问病史可以同步进行。', style: '回答简短，但并不等于不配合。' },
        { id: 'quiet', label: '虚弱、反应慢', opening: '我有点没力气……不太记得今天打没打胰岛素。', after: '谢谢你说清楚，我会尽量配合。', style: '需要短句、重复关键步骤，并请陪同者补充。' }
      ],
      history: [
        { id: 'insulin', question: '最近是否漏用/停用胰岛素，或更换了泵管？', answer: '近 2 天因进食少自行减少胰岛素；昨天可能漏了基础胰岛素。', why: '胰岛素不足是 DKA 的常见诱因，不能只依据当前血糖高低判断。', sensitive: false },
        { id: 'sglt2', question: '是否使用 SGLT2 抑制剂、近期禁食、饮酒或感染？', answer: '正在用 SGLT2 抑制剂，近 2 天进食很少；昨晚发热 38℃。', why: 'SGLT2、饥饿/饮酒、感染均可诱发或加重酮症；正常或轻度升高血糖也不能排除 DKA。', redFlag: true },
        { id: 'fluid', question: '呕吐次数、饮水量、尿量和意识有没有变化？', answer: '呕吐 5 次，尿量明显减少；站起头晕，但仍能回答问题。', why: '用于评估脱水、灌注和是否需要更高等级监护。', redFlag: true },
        { id: 'pregnancy', question: '有无妊娠可能或严重基础心肾疾病？', answer: '无妊娠可能；既往无心衰、透析或严重肾病。', why: '补液与监测强度需要结合妊娠和心肾状态调整。', sensitive: true }
      ],
      exams: [
        { id: 'airway', label: '气道、呼吸与意识', result: '意识清楚但疲惫；呼吸深快，呼气有酮味；SpO₂ 98%。', meaning: '深快呼吸提示代谢性酸中毒代偿，需立即抽血并进入急症监护路径。', redFlag: true },
        { id: 'perfusion', label: '灌注与容量', result: 'HR 118/min，BP 96/60 mmHg，四肢偏凉，毛细血管再充盈延长。', meaning: '提示容量不足/灌注受损；液体方案和监护等级需由急症团队按指南及个体情况决定。', redFlag: true },
        { id: 'abdomen', label: '腹部与诱因查体', result: '弥漫性腹痛，无明确腹膜刺激征；体温 38.0℃。', meaning: '腹痛可见于 DKA，但仍需并行排除感染、急腹症等诱因。' }
      ],
      tests: [
        { id: 'bloodgas', name: '血气、碳酸氢根与阴离子间隙', stage: '立即', workupId: 'ketosis-hyperosmolar', result: 'pH 7.18，HCO₃⁻ 9 mmol/L，阴离子间隙升高。', interpretation: '提示高阴离子间隙代谢性酸中毒，需结合 β-羟丁酸确认酮症并连续复查。', why: '确立酸碱严重程度并指导监测。', essential: true },
        { id: 'ketone', name: '血 β-羟丁酸', stage: '立即', workupId: 'ketosis-hyperosmolar', result: 'β-羟丁酸 5.2 mmol/L。', interpretation: '支持 DKA；尿酮体可滞后，优先结合血 β-羟丁酸和酸碱状态。', why: '血酮是判断酮症和转归的重要指标。', essential: true },
        { id: 'potassium', name: '血钾、钠、肌酐及渗透压', stage: '立即并动态复查', workupId: 'ketosis-hyperosmolar', result: 'K⁺ 2.9 mmol/L，Na⁺ 132 mmol/L，肌酐轻度升高；有效渗透压升高。', interpretation: '低钾是关键安全信号：在钾未纠正/低于指南启动胰岛素的安全阈值时，不能先启动胰岛素；先按急症指南补钾并持续复查。具体补钾方案须由急症团队按监护条件、肾功能和当地流程确定。', why: '胰岛素会进一步将钾移入细胞，低钾时先处理钾可降低致命性心律失常风险。', essential: true, redFlag: true },
        { id: 'trigger', name: '感染/诱因检查', stage: '同步', workupId: 'ketosis-hyperosmolar', result: '血常规白细胞升高，尿检提示感染线索；胸片待结合症状。', interpretation: '寻找并处理诱因，同时持续评估 DKA/HHS 混合表型。', why: '感染、漏用胰岛素和药物是常见诱因。', essential: false }
      ],
      decisions: [
        { id: 'potassium-first', label: '先进行急症监护、补液与补钾；钾安全后再按指南启动胰岛素并动态复查', correct: true, why: '本例低钾 2.9 mmol/L，胰岛素会进一步降低血钾；“先补钾、后胰岛素”是必须标出的易错点。', links: [{ type: 'workup', id: 'ketosis-hyperosmolar', label: '打开 DKA/HHS 指标追查' }] },
        { id: 'insulin-first', label: '立即大剂量胰岛素，钾暂不处理', correct: false, why: '低钾时先给胰岛素可能诱发严重心律失常；必须先按急症流程补钾并复查。' },
        { id: 'glucose-only', label: '血糖不算很高，先观察并只复查血糖', correct: false, why: 'SGLT2 相关或饥饿状态可出现正常/轻度高血糖 DKA；必须看血酮和酸碱状态。' }
      ],
      source: ['ADA《Standards of Care in Diabetes—2026》：住院、高血糖危象；高血糖危象共识：DKA/HHS 诊断与电解质安全', '本例不提供固定剂量，避免脱离监护条件、肾功能和当地急症流程自行套用'],
      note: '学习重点：DKA/HHS 不是“只看血糖”；气道/循环、酮体、酸碱和电解质要同步处理。'
    },
    {
      id: 'hypoglycemia', group: '糖尿病急症', title: '反复出汗、心慌与夜间低血糖',
      intro: '患者反复出现出汗、手抖和夜间惊醒。请先确认低血糖级别、意识与用药风险，再讨论原因。',
      demographics: { ages: [58, 66, 72, 79], sexes: ['男', '女'], jobs: ['退休教师', '退休工人', '照护家属', '小店经营者'] },
      complaints: ['夜间出汗心慌', '家人发现反应变慢', '打胰岛素后常常不敢吃饭'],
      moods: [
        { id: 'fear', label: '害怕再次发作', opening: '我现在最怕睡着后又低血糖，家里人也很紧张。', after: '原来还要看诱因和用药，我愿意一起记录。', style: '会回避增加药物，但愿意学习识别和处理。' },
        { id: 'ashamed', label: '有些自责', opening: '是不是我自己没管好？我不想再麻烦家里人。', after: '谢谢你没有责备我，我可以一起找原因。', style: '可能少报低血糖次数，需要温和追问。' },
        { id: 'calm', label: '配合记录', opening: '我把连续血糖监测的截图带来了。', after: '我会按计划记录进食、运动和用药。', style: '能较好回顾时间线。' }
      ],
      history: [
        { id: 'episode', question: '发作时是否清醒、能否自行进食？血糖最低多少？', answer: '两次能自行进食，指尖血糖约 3.4 mmol/L；一次夜间叫不醒，由家人发现。', why: '区分低血糖严重程度；需要他人协助或意识受损属于严重低血糖。', redFlag: true },
        { id: 'insulin', question: '胰岛素种类、注射时间、进餐和运动是否匹配？', answer: '晚餐后使用基础胰岛素，最近晚餐吃得少；周末运动量增加。', why: '进食减少、运动增加和胰岛素/促泌剂均可造成低血糖。', sensitive: false },
        { id: 'kidney', question: '肾功能、饮酒、认知和是否独居？', answer: 'eGFR 42 ml/min/1.73m²，与配偶同住；偶尔饮酒。', why: '肾功能下降、饮酒和认知/照护条件会增加持续低血糖风险。', sensitive: true },
        { id: 'meds', question: '是否使用磺脲类、胰岛素或其他可能导致低血糖的药物？', answer: '使用基础胰岛素和格列美脲；没有使用 GLP-1 RA 或 SGLT2 抑制剂。', why: '识别可调整的药物暴露，并核对剂量与进餐。', sensitive: false }
      ],
      exams: [
        { id: 'neuro', label: '神经与认知', result: '目前清醒，短时记忆尚可；家属描述曾有夜间意识受损。', meaning: '既往严重低血糖提示需要降低再次发生风险，并检查患者/家属应急能力。', redFlag: true },
        { id: 'nutrition', label: '营养、进食与运动', result: '近一周晚餐减少，周末步行时间明显增加。', meaning: '生活方式变化可能与用药剂量不再匹配。' },
        { id: 'injection', label: '注射与设备', result: '注射部位有轻度脂肪增生，轮换不规律。', meaning: '注射部位和技术会影响吸收稳定性，应纳入教育。' }
      ],
      tests: [
        { id: 'cgm', name: 'CGM/SMBG 时间序列', stage: '首轮', workupId: 'glucose-low', result: '夜间 02:00–04:00 多次低于 3.9 mmol/L，偶有低于 3.0 mmol/L。', interpretation: '提示反复低血糖，需结合症状、药物和进食时间；不能只用单次 HbA1c 判断安全。', why: '识别时间模式并指导个体化目标。', essential: true },
        { id: 'renal', name: '肾功能、电解质与肝功能', stage: '首轮', workupId: 'kidney-albuminuria', result: 'eGFR 42 ml/min/1.73m²，肝功能未见明显异常。', interpretation: '肾功能下降可延长部分降糖药/胰岛素作用，需复核药物和低血糖风险。', why: '肾功能是药物安全评估的一部分。', essential: true },
        { id: 'a1c', name: 'HbA1c 与治疗记录', stage: '首轮', workupId: 'glucose-high', result: 'HbA1c 6.3%，近期自行加大胰岛素以“达标”。', interpretation: 'A1C 较低不代表安全；反复低血糖时应优先减少风险并重新设定个体化目标。', why: '避免以单一 A1C 驱动过度强化。', essential: true }
      ],
      decisions: [
        { id: 'deintensify', label: '先处理当前低血糖并复盘胰岛素/促泌剂、进食、运动和肾功能，降低再次低血糖风险', correct: true, why: '严重或反复低血糖是必须改变治疗方案和教育计划的信号；目标需个体化。', links: [{ type: 'workup', id: 'glucose-low', label: '打开低血糖指标追查' }] },
        { id: 'tighten', label: '为了把 HbA1c 再降到更低，继续加大胰岛素', correct: false, why: 'A1C 低伴严重低血糖时，继续强化会增加伤害。' },
        { id: 'ignore', label: '只建议少吃甜食，不核对药物和肾功能', correct: false, why: '低血糖常由药物、进食、运动、饮酒和肾功能共同影响，不能只归因于饮食。' }
      ],
      source: ['ADA《Standards of Care in Diabetes—2026》：低血糖、老年人、药物治疗与技术', '具体纠正方案需按患者清醒程度、可否吞咽和当地急救流程执行'],
      note: '学习重点：严重低血糖的核心不是“再教育一句”，而是识别药物和照护风险并去强化。'
    },
    {
      id: 'thyroid-nodule', group: '甲状腺', title: '超声偶然发现甲状腺结节',
      intro: '患者没有明显不适，但体检超声发现结节。请从甲功、超声风险、压迫/侵袭信号和 Bethesda 路径开始。',
      demographics: { ages: [36, 48, 59, 67], sexes: ['男', '女'], jobs: ['会计', '工程师', '护士', '退休人员'] },
      complaints: ['体检发现甲状腺结节', '担心是不是甲状腺癌', '偶有咽部异物感'],
      moods: [
        { id: 'anxious', label: '担心肿瘤', opening: '报告写着“低回声”，我是不是马上要做手术？', after: '明白了，要先看 TSH、超声风险和是否达到穿刺条件。', style: '容易把“结节”直接等同于“癌”。' },
        { id: 'calm', label: '理性配合', opening: '我想知道哪些信息会真正改变下一步。', after: '谢谢，知道决策节点后我安心多了。', style: '会主动询问随访间隔。' },
        { id: 'quiet', label: '略拘谨', opening: '没什么不舒服，就是体检发现的。', after: '这样分步骤问，我能跟上。', style: '需要确认是否有放射暴露和家族史。' }
      ],
      history: [
        { id: 'compress', question: '有无进行性声音嘶哑、吞咽/呼吸困难或结节快速增大？', answer: '无呼吸困难；近 2 周觉得声音略沙，但没有进行性加重。', why: '压迫或侵袭性表现会改变转诊与评估优先级。', redFlag: true },
        { id: 'risk', question: '童年头颈部放射暴露或甲状腺癌家族史？', answer: '童年无明确放射治疗史；姑妈曾患甲状腺乳头状癌。', why: '放射暴露和家族史属于风险分层信息。', sensitive: true },
        { id: 'function', question: '怕冷怕热、心悸、手抖、体重变化或月经改变？', answer: '没有明显怕冷怕热和心悸，体重稳定。', why: '甲状腺功能异常可影响结节评估和鉴别诊断。', sensitive: false }
      ],
      exams: [
        { id: 'neck', label: '甲状腺与颈部淋巴结触诊', result: '右叶约 1.4 cm 结节，活动度尚可；未触及明确异常淋巴结。', meaning: '体检不能替代高质量超声风险分层。' },
        { id: 'voice', label: '声音与气道观察', result: '轻度沙哑，气道通畅，无喘鸣。', meaning: '持续或进行性声音改变应加快耳鼻喉/甲状腺专科评估。', redFlag: true },
        { id: 'eye', label: '甲亢相关体征', result: '无明显手抖、突眼或心动过速。', meaning: '临床体征与 TSH/FT4 一起解释，不能单靠症状排除甲状腺功能异常。' }
      ],
      tests: [
        { id: 'tsh', name: 'TSH（必要时 FT4/FT3）', stage: '首轮', workupId: 'tsh-low', result: 'TSH 0.18 mIU/L，FT4 正常偏高。', interpretation: 'TSH 抑制提示需评估自主功能结节/甲亢；此时评估顺序与 TSH 正常者不同。', why: 'TSH 是结节初始功能评估关键入口。', essential: true },
        { id: 'us', name: '甲状腺及颈部淋巴结超声', stage: '首轮', workupId: 'thyroid-nodule-marker', result: '结节低回声、边界欠清，见点状强回声；需按所用系统分层。', interpretation: '超声风险分层决定随访、细针穿刺或进一步处理；不能只按直径直接手术。', why: '结节管理依赖超声特征、大小、风险背景和患者偏好。', essential: true },
        { id: 'fna', name: '细针穿刺与 Bethesda 分类（达到指征时）', stage: '第二轮', workupId: 'thyroid-nodule-marker', result: '本例按超声风险和大小评估后暂未达到穿刺指征，本次不执行；若复查达到指征，细胞学报告需明确 Bethesda 类别。', interpretation: '当前结果支持规范随访而非立即把结节当作癌症；若后续达到穿刺指征，再用 Bethesda 估计恶性风险并决定下一步。', why: '避免把超声风险直接等同于病理诊断。', essential: false }
      ],
      decisions: [
        { id: 'nodule-path', label: '先复核 TSH 与超声风险分层，再按指征决定功能成像/穿刺/随访', correct: true, why: 'TSH 抑制与超声高风险会改变路径；手术不是所有结节的第一步。', links: [{ type: 'workup', id: 'thyroid-nodule-marker', label: '打开甲状腺结节指标追查' }] },
        { id: 'surgery', label: '只因低回声和 1.4 cm 就立即手术', correct: false, why: '需要结合超声分层、TSH、淋巴结、压迫表现、细胞学和患者偏好。' },
        { id: 'ignore', label: '没有明显症状，完全不做 TSH 和超声复核', correct: false, why: '无症状不等于无风险；规范超声和甲功是初始评估核心。' }
      ],
      source: ['甲状腺结节/分化型甲状腺癌相关指南：TSH、超声风险分层、FNA 与 Bethesda', '本例不替代影像原图、细胞学报告和多学科讨论'],
      note: '学习重点：结节不是诊断；先看 TSH，再把超声特征、大小、风险背景和 Bethesda 串起来。'
    },
    {
      id: 'primary-aldosteronism', group: '肾上腺', title: '高血压伴自发性低钾',
      intro: '一位年轻患者高血压控制不佳并反复低钾。请先纠正影响因素，再决定 ARR、确证试验与分型。',
      demographics: { ages: [29, 35, 43, 52], sexes: ['男', '女'], jobs: ['程序员', '教师', '物流经理', '护士'] },
      complaints: ['高血压伴低钾', '乏力、心悸', '多种降压药仍控制不佳'],
      moods: [
        { id: 'frustrated', label: '有些挫败', opening: '我已经吃了几种降压药，为什么钾还总是低？', after: '原来不是只加药，还要先把筛查条件做好。', style: '希望得到明确答案，可能对重复检查不耐烦。' },
        { id: 'anxious', label: '担心心脏问题', opening: '低钾会不会突然让心脏停跳？', after: '谢谢你先说明危险信号和检查顺序。', style: '会关注心电图和钾的变化。' },
        { id: 'calm', label: '愿意配合', opening: '我把每次血压和补钾记录都写下来了。', after: '我会按要求复查并记录药物。', style: '能提供较完整的用药时间线。' }
      ],
      history: [
        { id: 'bp', question: '高血压起病年龄、家庭史、用药和控制情况？', answer: '32 岁发现高血压；目前用氨氯地平和氢氯噻嗪，家庭血压仍约 155/98 mmHg。', why: '早发、难治性高血压提高原发性醛固酮增多症筛查价值。', sensitive: false },
        { id: 'potassium', question: '低钾是否自发出现？有无腹泻、呕吐、泻药或甘草？', answer: '没有腹泻呕吐和甘草使用；停利尿剂后钾仍偏低。', why: '排除胃肠道丢失、药物和假性原因，并判断是否自发性低钾。', redFlag: true },
        { id: 'sleep', question: '是否打鼾、白天嗜睡或有睡眠呼吸暂停线索？', answer: '家人说我打鼾，白天容易困。', why: '睡眠呼吸暂停与高血压共存，可同时处理，不替代醛固酮筛查。', sensitive: false }
      ],
      exams: [
        { id: 'vitals', label: '血压、心率与容量', result: '坐位 BP 158/100 mmHg，HR 78/min；无明显水肿。', meaning: '确认规范测量并评估持续高血压及容量状态。' },
        { id: 'ecg', label: '心电图与神经肌肉', result: '轻度 U 波，肌力尚可；无恶性心律失常。', meaning: '低钾可造成心电改变；严重异常需先处理电解质安全。', redFlag: true },
        { id: 'med-review', label: '药物与补钾核对', result: '氢氯噻嗪可能影响钾和 ARR；患者近期自行加用补钾。', meaning: '筛查前要按指南和专科流程处理干扰因素，不能机械解释 ARR。' }
      ],
      tests: [
        { id: 'electrolytes', name: '钾、钠、肌酐与碳酸氢根', stage: '首轮', workupId: 'arr-low-potassium', result: 'K⁺ 3.1 mmol/L，Na⁺ 143 mmol/L，HCO₃⁻ 30 mmol/L。', interpretation: '低钾和代谢性碱中毒线索支持进一步筛查；应先纠正低钾并记录药物。', why: '低钾可抑制醛固酮，导致假阴性。', essential: true },
        { id: 'arr', name: '醛固酮/肾素及 ARR', stage: '条件准备后', workupId: 'arr-low-potassium', result: '在纠正低钾、评估药物干扰后，ARR 升高；醛固酮达到实验室筛查要求。', interpretation: '支持筛查阳性，但 ARR 阳性通常不等于最终确诊；按指南决定确证试验和分型。', why: '筛查、确证、分型是不同步骤。', essential: true },
        { id: 'confirm', name: '确证试验与分型（CT/必要时 AVS）', stage: '第三轮', workupId: 'arr-low-potassium', result: '盐水负荷后醛固酮仍未被抑制，支持原发性醛固酮增多症；肾上腺 CT 示左侧小结节，AVS 尚未完成。', interpretation: '确证试验支持原醛方向，但 CT 不能单独代表分侧；是否进行 AVS 和手术评估需由专科结合年龄、手术意愿和肾上腺静脉采血条件决定。', why: '避免把筛查结果或单侧影像直接当作手术决定。', essential: false }
      ],
      decisions: [
        { id: 'arr-path', label: '先纠正低钾并处理干扰因素，再规范采集 ARR；阳性后按指征确证和分型', correct: true, why: '这是原发性醛固酮增多症中最容易被跳过的顺序。CT 不能替代生化筛查，ARR 也不等于确诊。', links: [{ type: 'workup', id: 'arr-low-potassium', label: '打开 ARR 指标追查' }] },
        { id: 'ct-first', label: '直接做肾上腺 CT，有结节就诊断并手术', correct: false, why: '影像不能替代生化筛查和分型；无功能结节很常见。' },
        { id: 'arr-ignore', label: '把低钾归因于利尿剂，永远不筛查', correct: false, why: '停药后仍低钾且高血压难治，正是需要重新评估的情形。' }
      ],
      source: ['原发性醛固酮增多症诊断治疗相关专家共识/指南：筛查条件、ARR、确证试验与分型', '筛查药物调整和确证试验须按实验室、专科及患者安全条件执行'],
      note: '学习重点：先纠正低钾和药物干扰；筛查、确证、分型、治疗是四个不同节点。'
    },
    {
      id: 'adrenal-insufficiency', group: '肾上腺', title: '乏力、体重下降与体位性低血压',
      intro: '患者长期乏力、食欲下降，并出现色素沉着和站立头晕。请先识别肾上腺危象，再安排晨间皮质醇/ACTH。',
      demographics: { ages: [28, 41, 55, 68], sexes: ['男', '女'], jobs: ['厨师', '教师', '司机', '退休人员'] },
      complaints: ['长期乏力消瘦', '站起头晕、恶心', '皮肤颜色变深'],
      moods: [
        { id: 'weak', label: '虚弱、担心查不出原因', opening: '我已经累了很久，别人都说是压力，但我觉得不对。', after: '谢谢你解释需要优先排除危象，我会配合抽血。', style: '描述症状需要耐心追问时间线。' },
        { id: 'anxious', label: '有些紧张', opening: '我看到低血压和低钠就很害怕。', after: '知道哪些情况要急诊后，我安心一些。', style: '会反复问是否需要马上住院。' },
        { id: 'calm', label: '平静', opening: '我记录了最近三个月的体重和血压变化。', after: '好的，我会在复查前记录用药和症状。', style: '能提供完整时间线。' }
      ],
      history: [
        { id: 'steroid', question: '是否使用过口服、吸入、外用、关节腔或注射糖皮质激素？何时停用？', answer: '曾长期口服泼尼松，2 周前因症状好转自行停药。', why: '外源性糖皮质激素抑制可造成继发性肾上腺功能减退，不能突然停药。', redFlag: true },
        { id: 'crisis', question: '有没有持续呕吐/腹泻、发热感染、意识改变或明显虚脱？', answer: '今天出现 3 次呕吐，站立几乎晕倒，但目前意识清楚。', why: '感染、呕吐和循环不稳定提示肾上腺危象风险，需要先急症评估。', redFlag: true },
        { id: 'pigment', question: '色素沉着是否累及口腔黏膜、瘢痕和手掌纹？有无自身免疫病？', answer: '手掌纹和口腔黏膜颜色变深；母亲有自身免疫性甲状腺病。', why: '色素沉着和自身免疫背景支持原发性方向，但不能单独确诊。', sensitive: true }
      ],
      exams: [
        { id: 'orthostatic', label: '卧立位血压、容量和灌注', result: '卧位 BP 102/68 mmHg，站立 88/56 mmHg；黏膜干，HR 106/min。', meaning: '提示容量不足和体位性低血压；若进展为休克需立即升级。', redFlag: true },
        { id: 'pigment', label: '皮肤、黏膜与腹部', result: '掌纹、口腔黏膜色素加深；无明确急腹症体征。', meaning: '色素沉着支持 ACTH 升高方向，但不能替代激素检测。' },
        { id: 'glucose', label: '血糖与电解质快速评估', result: 'Na⁺ 126 mmol/L，K⁺ 5.6 mmol/L，随机血糖 3.4 mmol/L。', meaning: '低钠、高钾、低血糖组合提高危象警惕，需同步处理和采血。', redFlag: true }
      ],
      tests: [
        { id: 'morning', name: '8–9 时皮质醇 + ACTH（危象不应延误治疗）', stage: '立即/稳定后确认', workupId: 'cortisol-low', result: '晨间皮质醇很低，ACTH 明显升高。', interpretation: '支持原发性肾上腺功能减退；需结合肾素/醛固酮、抗体和病因评估。', why: '晨间皮质醇和 ACTH 是初始分层关键。', essential: true },
        { id: 'electrolytes', name: '电解质、血糖、肾功能与感染评估', stage: '立即并动态', workupId: 'cortisol-low', result: '低钠、高钾、低血糖；肌酐轻度升高，感染筛查待完善。', interpretation: '与容量不足和激素缺乏一致；需按危象路径监护和复查。', why: '并发电解质和循环异常决定紧迫程度。', essential: true },
        { id: 'cause', name: '肾素/醛固酮、21-羟化酶抗体及垂体评估', stage: '稳定后', workupId: 'cortisol-low', result: 'ACTH 升高、21-羟化酶抗体阳性；垂体 MRI 未见占位，支持原发性自身免疫性肾上腺功能减退方向。', interpretation: '病因线索支持原发性而非垂体性，但长期替代和应激教育仍需结合复查、合并自身免疫病和专科随访。', why: '明确病因后再制定长期替代和应激教育计划。', essential: false }
      ],
      decisions: [
        { id: 'crisis', label: '先按疑似肾上腺危象升级处理：采血不延误急救；稳定后再完成病因确认', correct: true, why: '低血压、呕吐、低钠、高钾和低血糖是危险组合；不能等动态试验结果才处理。', links: [{ type: 'workup', id: 'cortisol-low', label: '打开低皮质醇追查' }] },
        { id: 'test-only', label: '先等待完整激素检查，暂不处理低血压和低血糖', correct: false, why: '疑似危象时延误治疗可能造成严重后果；应在可行时先留取关键血样并立即处理。' },
        { id: 'thyroid-only', label: '仅按甲状腺功能异常解释乏力，忽略电解质和血压', correct: false, why: '低钠、高钾、低血糖和体位性低血压需要优先排查肾上腺危象。' }
      ],
      source: ['肾上腺功能减退相关指南/共识：危象识别、晨间皮质醇与 ACTH、原发/继发分层', '本模拟器不提供危象处方剂量，真实处理需在监护条件下按急症流程执行'],
      note: '学习重点：疑似肾上腺危象先救命，再确认病因；“先采血但不延误治疗”是关键。'
    },
    {
      id: 'hypercalcemia', group: '骨与矿物质', title: '便秘、口渴与血钙升高',
      intro: '患者因乏力、便秘和反复口渴就诊，化验提示血钙升高。请先确认是真性高钙，再用 PTH 分层。',
      demographics: { ages: [47, 58, 69, 76], sexes: ['男', '女'], jobs: ['企业职员', '退休人员', '教师', '销售'] },
      complaints: ['便秘、口渴、多尿', '乏力、恶心', '体检发现血钙高'],
      moods: [
        { id: 'anxious', label: '担心肿瘤', opening: '高钙是不是就代表癌症？我很害怕。', after: '知道要先复核钙和 PTH，再按方向排查，我放心些。', style: '容易把单个指标当作诊断。' },
        { id: 'calm', label: '平静', opening: '我想知道哪些检查能区分甲状旁腺和其他原因。', after: '我明白需要分层，不是马上做所有检查。', style: '愿意按阶段检查。' },
        { id: 'tired', label: '疲惫、回答简短', opening: '我就是没力气、老口渴，其他还好。', after: '谢谢，我会补充用药和饮水情况。', style: '要主动追问脱水和意识变化。' }
      ],
      history: [
        { id: 'severity', question: '有无持续呕吐、意识改变、少尿、心悸或明显脱水？', answer: '没有意识改变和呕吐，但最近尿多、饮水多。', why: '判断是否存在需要急诊监护的重度高钙。', redFlag: true },
        { id: 'drugs', question: '是否使用噻嗪类、锂剂、维生素 D/钙补充剂？', answer: '长期补充维生素 D，偶尔服用钙片；没有用锂剂。', why: '药物和补充剂是可逆原因，需先核对。', sensitive: false },
        { id: 'bone', question: '有无骨痛、肾结石、骨折或甲状旁腺家族史？', answer: '曾有一次肾结石，没有脆性骨折；父亲晚年也有结石。', why: '结石、骨病和家族史支持原发性甲旁亢风险评估。', sensitive: true }
      ],
      exams: [
        { id: 'volume', label: '容量、尿量与心电图', result: '轻度脱水，HR 94/min；尿量尚可，心电图无明显恶性改变。', meaning: '需要复核钙、肾功能和容量状态；严重症状需升级。', redFlag: true },
        { id: 'bones', label: '骨骼与腹部', result: '无局部骨压痛；腹部轻度不适，无腹膜刺激征。', meaning: '骨痛/骨折、腹部症状和肾结石史帮助判断并发症。' },
        { id: 'neck', label: '颈部与用药体征', result: '未触及明显颈部肿块；无甲亢明显体征。', meaning: '查体不能排除甲状旁腺病变，需依赖生化分层。' }
      ],
      tests: [
        { id: 'calcium', name: '总钙、白蛋白/离子钙、磷、肌酐', stage: '首轮', workupId: 'calcium-low', result: '总钙持续升高；白蛋白轻度下降，离子钙升高，磷偏低。', interpretation: '确认真性高钙并评估肾功能和矿物质背景，避免只看校正钙。', why: '高钙诊断先要确认检测可靠。', essential: true },
        { id: 'pth', name: '完整 PTH', stage: '首轮', workupId: 'calcium-low', result: 'PTH 未被抑制，处于参考上限以上。', interpretation: '高钙伴 PTH 不适当正常/升高，支持 PTH 依赖性高钙，需区分原发性甲旁亢、家族性低尿钙性高钙等。', why: 'PTH 是高钙分层的核心节点。', essential: true },
        { id: 'urine', name: '尿钙、25(OH)D 与骨密度/肾脏评估', stage: '第二轮', workupId: 'calcium-low', result: '24 小时尿钙升高，25(OH)D 充足；DXA 显示腰椎骨量下降，肾脏超声未见活动性结石。', interpretation: '尿钙不低使家族性低尿钙性高钙的可能性下降；骨量和既往结石史仍需纳入后续治疗与并发症评估。', why: '病因与并发症评估决定后续处理。', essential: false }
      ],
      decisions: [
        { id: 'pth-path', label: '先复核真性高钙和肾功能，再用 PTH 分层并评估骨/肾并发症', correct: true, why: '高钙不是单一疾病；PTH 未抑制时进入 PTH 依赖性路径，不能直接按肿瘤处理。', links: [{ type: 'workup', id: 'calcium-low', label: '打开钙异常指标追查' }] },
        { id: 'cancer', label: '单凭一次高钙立即按恶性肿瘤治疗', correct: false, why: '需先确认真性高钙并用 PTH 区分方向。' },
        { id: 'supplement', label: '继续盲目增加钙和维生素 D 以“补骨”', correct: false, why: '补充剂可能加重高钙，必须先核对原因和当前摄入。' }
      ],
      source: ['甲状旁腺功能亢进/高钙血症和骨矿物质相关指南：真性高钙、PTH 分层、肾骨并发症', '本模拟器不提供急性高钙固定剂量，重症处理需在监护条件下执行'],
      note: '学习重点：先确认真性高钙，再看 PTH 是否被抑制；同时评估肾结石和骨病。'
    },
    {
      id: 'osteoporosis', group: '骨与矿物质', title: '低能量跌倒后的脆性骨折',
      intro: '一位老年患者轻微跌倒后发生椎体/髋部疼痛。请先判断骨折严重程度与需要立即升级或急诊评估的危险表现，再评估骨质疏松和继发原因。',
      demographics: { ages: [66, 73, 81, 88], sexes: ['男', '女'], jobs: ['退休人员', '家庭照护者', '退休教师'] },
      complaints: ['轻微跌倒后腰背痛', '髋部疼痛、不能负重', '担心再骨折'],
      moods: [
        { id: 'fear', label: '害怕再次跌倒', opening: '我只是绊了一下就骨折了，以后是不是不能走路？', after: '知道要同时处理疼痛、跌倒和骨折风险，我愿意配合。', style: '可能因为害怕而减少活动。' },
        { id: 'quiet', label: '沉默、疼痛', opening: '我不想麻烦孩子，疼还能忍。', after: '谢谢你认真听，我会告诉你疼痛和活动情况。', style: '需要主动评估疼痛和照护支持。' },
        { id: 'calm', label: '愿意学习', opening: '我想知道这次骨折后要查什么，怎样避免下一次。', after: '我会和家人一起做跌倒预防。', style: '能参与共同决策。' }
      ],
      history: [
        { id: 'fracture', question: '受伤机制、能否负重、神经症状和疼痛是否进行性加重？', answer: '在家中平地滑倒后腰背痛，不能正常翻身；双下肢暂无麻木无力。', why: '低能量骨折和神经症状决定影像与急诊优先级。', redFlag: true },
        { id: 'falls', question: '过去一年跌倒次数、视力、步态、镇静药和居家环境？', answer: '过去一年跌倒 2 次，夜间起床多；正在服用镇静助眠药。', why: '跌倒原因可干预，需纳入骨折二级预防。', sensitive: true },
        { id: 'secondary', question: '是否有甲状旁腺、甲状腺、肾病、糖皮质激素或吸收不良史？', answer: '曾长期服用泼尼松治疗关节病，已停用半年；有慢性肾病。', why: '糖皮质激素和 CKD 是继发性骨质疏松线索。', sensitive: true }
      ],
      exams: [
        { id: 'neuro', label: '神经功能与下肢血运', result: '双下肢肌力和感觉基本对称，足背动脉可触及；疼痛明显。', meaning: '出现进行性神经缺损需立即升级影像与专科评估。', redFlag: true },
        { id: 'falls', label: '步态、平衡和用药', result: '起立需扶持，步态不稳；夜间照明不足，服用助眠药。', meaning: '跌倒风险是治疗的一部分，不是骨密度之外的附属问题。' },
        { id: 'nutrition', label: '身高、体重和营养', result: '较年轻时身高下降约 4 cm，BMI 19.2 kg/m²。', meaning: '身高下降提示椎体骨折线索，需要影像确认。' }
      ],
      tests: [
        { id: 'imaging', name: '骨折影像（X 线/必要时 CT 或 MRI）', stage: '立即', workupId: 'bone-low-density', result: '胸腰椎压缩性骨折；无明确脊髓压迫表现。', interpretation: '低能量椎体骨折本身即提示高骨折风险，需要进入骨质疏松/二级预防路径。', why: '先确定骨折和神经风险，再谈长期抗骨质疏松。', essential: true },
        { id: 'dxa', name: 'DXA 骨密度与椎体骨折评估', stage: '稳定后', workupId: 'bone-low-density', result: 'DXA 骨密度降低；结合椎体骨折评估高风险。', interpretation: '骨密度需结合既往脆性骨折、年龄和风险分层，不能只看单个 T 值。', why: '治疗指征依赖综合骨折风险。', essential: true },
        { id: 'secondary', name: '继发性骨质疏松检查', stage: '稳定后', workupId: 'bone-low-density', result: '检查血钙、磷、肌酐、TSH、25(OH)D、血常规等，按病史扩展。', interpretation: '长期糖皮质激素、CKD 和内分泌疾病需纳入鉴别；检查项目按指南和病史选择。', why: '避免把所有低骨密度都归为“年龄相关”。', essential: true }
      ],
      decisions: [
        { id: 'fracture-path', label: '先处理骨折和需要立即升级或急诊评估的危险表现，再进入高风险骨质疏松及跌倒预防路径', correct: true, why: '脆性椎体/髋部骨折提示高风险；需要同时处理疼痛、活动、营养、跌倒和继发原因。', links: [{ type: 'workup', id: 'bone-low-density', label: '打开骨密度追查' }] },
        { id: 'dxa-only', label: '只等 DXA 结果，暂不评估骨折和神经状态', correct: false, why: '影像与神经安全优先；治疗风险不能由 DXA 单独决定。' },
        { id: 'bedrest', label: '长期卧床避免所有活动', correct: false, why: '需要个体化活动和康复，长期卧床会增加跌倒、血栓和功能下降风险。' }
      ],
      source: ['骨质疏松症、脆性骨折和糖皮质激素相关骨病指南：骨折识别、DXA、继发性病因和二级预防', '具体抗骨质疏松药物、剂量和肾功能限制应在药物卡与原指南中单独核对'],
      note: '学习重点：脆性骨折是高风险事件；先排需要立即升级或急诊评估的神经危险表现，再做骨折二级预防。'
    },
    {
      id: 'pituitary-vision', group: '垂体', title: '头痛伴视野改变和泌乳素升高',
      intro: '患者有头痛、视野缺损和月经/性功能变化。请先识别视神经压迫和垂体危象，再分层激素检查与 MRI。',
      demographics: { ages: [27, 39, 52, 61], sexes: ['女', '男'], jobs: ['研究生', '设计师', '教师', '工程师'] },
      complaints: ['头痛、视物碰撞', '月经紊乱/性欲下降', '体检发现泌乳素升高'],
      moods: [
        { id: 'anxious', label: '担心失明', opening: '我最近总撞到门框，会不会越来越看不见？', after: '知道视野检查和 MRI 的优先级，我会尽快配合。', style: '视力问题让患者高度紧张。' },
        { id: 'shy', label: '对性/生育问题拘谨', opening: '有些问题我不太好意思说，但月经确实变了。', after: '谢谢你尊重隐私，我可以继续回答。', style: '需要解释保密和询问目的。' },
        { id: 'calm', label: '平静', opening: '我想先知道哪些激素需要一起查，避免漏诊。', after: '我明白不能只盯着泌乳素一个数字。', style: '能参与检查排序。' }
      ],
      history: [
        { id: 'vision', question: '视野缺损是否进行性、双眼受累？有无复视或视力下降？', answer: '近 1 个月双侧周边视野变窄，偶尔复视；视力较前下降。', why: '进行性视野/视力改变提示视交叉受压，需要加快眼科/神经外科评估。', redFlag: true },
        { id: 'pituitary', question: '月经、泌乳、性欲、勃起、头痛和生育计划？', answer: '月经 4 个月不规律，有乳溢；近期有生育计划。', why: '泌乳素、性腺轴和生育计划会改变评估与治疗优先级。', sensitive: true },
        { id: 'meds', question: '抗精神病药、止吐药、雌激素和甲状腺药物？', answer: '服用甲氧氯普胺约 1 个月；没有抗精神病药。', why: '药物可升高泌乳素，需避免把药物效应误诊为垂体肿瘤。', sensitive: true },
        { id: 'crisis', question: '有无严重乏力、呕吐、低血压、低钠或意识改变？', answer: '没有晕厥和意识改变，但最近乏力明显。', why: '垂体危象需优先排除肾上腺功能不足。', redFlag: true }
      ],
      exams: [
        { id: 'visual', label: '视力、视野和眼球运动', result: '对侧周边视野缺损，眼球运动轻度受限。', meaning: '提示可能存在视交叉/颅内占位相关问题，需要尽快影像和专科评估。', redFlag: true },
        { id: 'pituitary', label: '垂体轴和全身状态', result: 'BP 104/68 mmHg，皮肤无明显色素沉着；无明显甲亢体征。', meaning: '体征不能排除垂体激素缺乏，需完整轴评估。' },
        { id: 'breast', label: '乳房/生殖系统相关查体', result: '双侧少量乳溢；无明确乳房肿块。', meaning: '需结合妊娠、药物和泌乳素复核。' }
      ],
      tests: [
        { id: 'prolactin', name: '泌乳素复核（含药物/妊娠评估）', stage: '首轮', workupId: 'prolactin-high', result: '泌乳素持续升高；需结合大分子泌乳素和药物影响。', interpretation: '持续升高支持进一步评估，但单次升高不能直接诊断泌乳素瘤。', why: '避免忽视检测干扰与药物原因。', essential: true },
        { id: 'axes', name: '垂体前叶轴：8–9 时皮质醇、TSH/FT4、LH/FSH/性激素', stage: '立即/首轮', workupId: 'cortisol-low', result: '晨间皮质醇偏低，FT4 偏低而 TSH 未相应升高；性腺轴低反应。', interpretation: '提示垂体多轴功能受损可能，视野红旗存在时需同步升级。', why: '垂体病变不能只看泌乳素。', essential: true, redFlag: true },
        { id: 'mri', name: '垂体增强 MRI 与正式视野检查', stage: '优先', workupId: 'prolactin-high', result: 'MRI 显示鞍区占位，正式视野证实双颞侧缺损。', interpretation: '影像、视野和激素结果共同决定专科/多学科处理，不以单个指标决定。', why: '识别压迫和多轴受损。', essential: true, redFlag: true }
      ],
      decisions: [
        { id: 'vision-path', label: '优先处理视野/垂体危急信号并完成多轴评估，再按 MRI 和病因讨论治疗', correct: true, why: '视野缺损和可能的皮质醇不足是高优先级；不能仅按泌乳素升高随访。', links: [{ type: 'workup', id: 'prolactin-high', label: '打开泌乳素追查' }, { type: 'workup', id: 'cortisol-low', label: '打开皮质醇追查' }] },
        { id: 'prolactin-only', label: '只复查泌乳素，半年后再看视野', correct: false, why: '进行性视野缺损和垂体轴异常需要及时评估。' },
        { id: 'mri-only', label: '看到 MRI 占位就不查激素，直接按肿瘤处理', correct: false, why: '需要完整激素轴和视野结果，尤其要识别肾上腺功能不足。' }
      ],
      source: ['垂体占位、泌乳素升高和垂体功能减退相关指南/共识：视野红旗、激素轴、MRI 与多学科评估', '本模拟器不提供手术、替代治疗或药物剂量'],
      note: '学习重点：视野改变优先级高；泌乳素、皮质醇、甲状腺和性腺轴要一起看。'
    }
  ].concat(window.SIM_EXTRA_CASES || []).map(completeCaseTemplate);

  var DEFAULT_SYMPTOM_RESPONSES = {
    fever: '本次训练预设：患者近期否认发热，未出现寒战或夜间大汗。',
    bleeding: '本次训练预设：否认皮肤瘀点瘀斑、鼻出血、牙龈出血或其他异常出血。',
    edema: '本次训练预设：否认眼睑或双下肢水肿，晨起与傍晚没有明显差别。',
    cough: '本次训练预设：否认咳嗽、咳痰，近期没有痰量、颜色或气味改变。',
    hemoptysis: '本次训练预设：否认咯血或痰中带血。',
    cyanosis: '本次训练预设：否认口唇或甲床发紫，活动后没有发绀。',
    dyspnea: '本次训练预设：否认静息或活动后呼吸困难，无端坐呼吸和夜间憋醒。',
    'chest-pain': '本次训练预设：否认胸痛或胸闷，没有活动诱发、呼吸相关或放射性疼痛。',
    palpitation: '本次训练预设：否认突发心悸或心跳不齐，没有伴随晕厥和胸痛。',
    'nausea-vomit': '本次训练预设：否认恶心呕吐，进食后没有反复呕吐或咖啡色内容物。',
    reflux: '本次训练预设：否认烧心、反酸和胃内容物反流，平卧后没有明显加重。',
    dysphagia: '本次训练预设：否认吞咽困难，固体和液体均能顺利咽下。',
    hematemesis: '本次训练预设：否认呕血或咖啡色呕吐物。',
    melena: '本次训练预设：否认黑便或便血，近期排便颜色无明显改变。',
    'abdominal-pain': '本次训练预设：否认腹痛，没有固定部位疼痛、放射痛或腹膜刺激样表现。',
    diarrhea: '本次训练预设：否认腹泻，大便次数和性状近期无明显改变。',
    constipation: '本次训练预设：否认排便困难和明显腹胀，排便频率与平时相近。',
    jaundice: '本次训练预设：否认眼白或皮肤发黄、尿色明显加深和皮肤瘙痒。',
    'back-pain': '本次训练预设：否认新发腰背痛，没有与体位或排尿相关的疼痛。',
    arthralgia: '本次训练预设：否认关节红肿热痛和晨僵，没有游走性关节痛。',
    hematuria: '本次训练预设：否认肉眼血尿、尿色异常和血块。',
    'urinary-irritation': '本次训练预设：否认尿频、尿急、尿痛，没有伴发热或腰痛。',
    'urine-volume': '本次训练预设：近期尿量总体稳定，夜尿次数没有明显增加。',
    'urinary-difficulty': '本次训练预设：否认排尿费力、尿线变细、尿潴留和排尿不尽感。',
    'vaginal-bleeding': '本次训练预设：否认月经以外的阴道流血，暂无妊娠相关出血表现。',
    obesity: '本次训练预设：近期没有明显体重快速增加，未发现新的腰围变化或运动耐量下降。',
    'weight-loss': '本次训练预设：近期体重基本稳定，没有无法解释的持续下降。',
    headache: '本次训练预设：否认新发或进行性头痛，没有突发剧烈头痛。',
    vertigo: '本次训练预设：否认旋转性眩晕和站立不稳，没有伴耳鸣或神经功能改变。',
    syncope: '本次训练预设：否认短暂意识丧失，近期没有因心悸、胸痛或体位改变而晕倒。',
    seizure: '本次训练预设：否认抽搐或惊厥，未发生发作后意识不清。',
    consciousness: '本次训练预设：目前意识清楚、定向力正常，无进行性嗜睡或行为异常。',
    sleep: '本次训练预设：否认明显失眠、夜间憋醒和白天不可控制的嗜睡，家属未报告异常呼吸暂停。',
    mood: '本次训练预设：情绪总体稳定，无持续抑郁、躁动或影响日常功能的焦虑。',
    'urinary-incontinence': '本次训练预设：否认不自主漏尿，没有咳嗽漏尿、尿急漏尿或持续滴漏。'
  };
  var CASE_SYMPTOM_PRESETS = {
    'new-t2d': {
      'urine-volume': '近 2 个月夜间起夜增多，白天尿量也比平时多；没有尿痛或血尿。',
      'weight-loss': '近 2 个月体重下降约 3 kg，不是刻意减重；同时口渴明显。',
      'nausea-vomit': '没有恶心呕吐，能够正常进食饮水。',
      'abdominal-pain': '没有腹痛，也没有深快呼吸或意识改变。'
    },
    'dka-low-k': {
      fever: '昨晚体温约 38 ℃，伴发热感；此前没有反复高热或寒战。',
      'nausea-vomit': '近 1 天呕吐约 5 次，进食后更明显，没有呕血。',
      'abdominal-pain': '有弥漫性腹痛，随呕吐加重；目前没有明确固定压痛或反跳痛。',
      dyspnea: '出现深快呼吸和明显乏力，平卧也能呼吸；没有咯血。',
      'urine-volume': '近 1 天尿量明显减少，饮水也少，站起时头晕。',
      consciousness: '目前能正确回答问题，但疲惫；没有抽搐或持续意识丧失。'
    },
    hypoglycemia: {
      palpitation: '低血糖发作时会突然心慌、出汗和手抖，纠正血糖后缓解。',
      consciousness: '两次发作时能自行进食，另一次夜间曾叫不醒，醒后无持续定向力障碍。',
      sleep: '低血糖主要发生在夜间；晚餐吃得少或周末运动后更容易出现。',
      mood: '发作前会紧张、反应变慢，血糖恢复后情绪回到平时。'
    },
    'thyroid-nodule': {
      dysphagia: '没有明显吞咽困难，固体和液体均能咽下；偶有咽部异物感。',
      dyspnea: '没有呼吸困难、喘鸣或平卧憋气。',
      palpitation: '没有明显心悸和手抖，体重近期稳定。',
      'weight-loss': '没有无法解释的体重下降。'
    },
    'primary-aldosteronism': {
      sleep: '家人发现打鼾，白天容易困，尚未做睡眠监测。',
      palpitation: '偶有乏力和肌肉无力，但没有持续心悸或晕厥。',
      'urine-volume': '没有明显多尿或夜尿增多，低钾前后尿量变化不大。'
    },
    'adrenal-insufficiency': {
      'weight-loss': '近几个月体重持续下降，食欲也较前差，不是主动减重。',
      'nausea-vomit': '今天呕吐 3 次，进食和饮水后更明显；目前没有呕血。',
      syncope: '站立时几乎晕倒，坐下后缓解；尚未发生完全意识丧失。',
      vertigo: '主要是站起时头晕发黑，不是旋转性眩晕。',
      consciousness: '目前意识清楚，家属未发现行为异常或持续嗜睡。'
    },
    hypercalcemia: {
      constipation: '近来排便减少、较费力，伴口渴；没有黑便或腹泻。',
      'urine-volume': '近期多尿、夜间起夜增加并主动多饮水，没有尿痛。',
      'nausea-vomit': '没有持续恶心呕吐，进食基本可以维持。',
      consciousness: '目前意识清楚，没有反应变慢、嗜睡或行为改变。'
    },
    osteoporosis: {
      'back-pain': '平地滑倒后出现腰背痛，翻身和起床明显受限；疼痛没有向双下肢放射。',
      syncope: '跌倒前没有心悸、胸痛或意识丧失，是脚下打滑后摔倒。',
      arthralgia: '主要是骨折部位疼痛，没有多关节红肿热痛。'
    },
    'pituitary-vision': {
      headache: '近 1 个月出现持续性头痛，伴双侧周边视野变窄，近期没有雷击样突发剧痛。',
      'vaginal-bleeding': '月经约 4 个月不规律，但没有大出血或妊娠相关阴道流血。',
      'nausea-vomit': '没有持续呕吐或剧烈头痛，近期主要困扰是视野和乏力。',
      consciousness: '意识清楚，没有晕厥、抽搐或进行性嗜睡。'
    },
    'new-t1d': {
      'weight-loss': '近 6 周体重下降约 6 kg，伴口渴、多尿，不是刻意节食。',
      'urine-volume': '近月白天和夜间尿量均增多，未伴尿痛或血尿。',
      'nausea-vomit': '近 2 天有恶心，但没有持续呕吐。',
      'abdominal-pain': '目前没有明显腹痛，仍需结合血酮和酸碱结果排除 DKA。',
      dyspnea: '没有明显深快呼吸，但感到乏力；若出现呼吸加深需立即升级评估。'
    },
    prediabetes: {
      obesity: 'BMI 约 30，腰围增大；久坐、含糖饮料较多，家属提示打鼾。',
      sleep: '入睡后打鼾，白天容易困，尚未完成睡眠呼吸暂停评估。',
      'weight-loss': '近年体重增加约 8 kg，没有不明原因消瘦。',
      'urine-volume': '没有明显多尿或夜尿增多。'
    },
    hyperthyroidism: {
      palpitation: '静息时心跳快、容易心慌，活动后更明显；没有晕厥或胸痛。',
      'weight-loss': '近 3 个月体重下降约 5 kg，食量没有相应减少。',
      sleep: '入睡困难、夜间易醒，白天仍感到疲倦。',
      mood: '近期容易焦虑、急躁，注意力较前差。'
    },
    hypothyroidism: {
      constipation: '近数月排便次数减少、较费力，没有便血或明显腹痛。',
      sleep: '白天困倦、精力差，但没有夜间憋醒或明显打鼾。',
      edema: '没有明显下肢凹陷性水肿，体重增加较缓慢。',
      mood: '兴趣和精力下降，但没有持续自伤想法或行为异常。'
    },
    hyponatremia: {
      headache: '近几天出现头痛和注意力下降，没有突发雷击样头痛。',
      'nausea-vomit': '有恶心，但没有频繁呕吐或呕血。',
      consciousness: '反应比平时慢，但能正确回答问题；没有抽搐。',
      cough: '近 2 周有咳嗽，痰不多，没有咯血或明显呼吸困难。'
    },
    pheochromocytoma: {
      headache: '反复发作性头痛，每次伴心慌和出汗，发作间歇可缓解。',
      palpitation: '心悸突然发作，常与头痛同时出现，偶有胸闷但未晕厥。',
      mood: '发作时强烈紧张和濒死感，发作结束后情绪逐渐恢复。'
    },
    cushing: {
      obesity: '近年躯干体重增加、腰围增大，四肢相对变细；同时发现血压和血糖升高。',
      'back-pain': '偶有腰背酸痛，需结合骨密度和椎体影像评估，未发生明确外伤骨折。',
      mood: '近来情绪波动、睡眠变差，家属认为性格与以前不同。'
    },
    obesity: {
      obesity: '体重和腰围逐年增加，BMI 约 31；饮食、久坐和睡眠不足较突出。',
      sleep: '家属描述打鼾、夜间憋醒，白天嗜睡，符合睡眠呼吸暂停筛查线索。',
      dyspnea: '快走或爬楼时气短，休息后缓解；没有静息呼吸困难。',
      'urinary-incontinence': '否认不自主漏尿，咳嗽或急迫时也没有漏尿。'
    },
    pcos: {
      'vaginal-bleeding': '月经约 2–3 个月来一次，量不规律；没有妊娠期或性交后异常大出血。',
      obesity: '体重偏高、腰围增加，伴面部痤疮和多毛；没有近期快速消瘦。',
      mood: '因月经和备孕问题感到焦虑，但日常功能尚可。'
    },
    'diabetic-foot': {
      fever: '近期出现发热感，最高体温约 38 ℃；伴足部红肿和渗液。',
      edema: '患足红肿、局部肿胀，另一侧下肢无明显水肿。',
      'back-pain': '没有腰背痛；主要疼痛和麻木集中在足部。',
      arthralgia: '足部局部疼痛，不能简单按普通关节炎解释；活动和负重后加重。'
    },
    'gestational-diabetes': {
      'nausea-vomit': '孕早期有恶心，但目前没有持续呕吐、脱水或腹痛。',
      'vaginal-bleeding': '目前没有阴道流血、下腹痛或胎动异常相关表现。',
      edema: '目前没有明显面部或下肢水肿，血压需按产科流程动态复核。'
    },
    hypoparathyroidism: {
      seizure: '没有抽搐或惊厥，但手足搐搦和口周麻木反复出现。',
      palpitation: '发作时可感到心慌，尚未发生晕厥；需要结合心电图和电解质。',
      consciousness: '目前意识清楚，没有嗜睡、意识丧失或行为改变。'
    },
    'male-hypogonadism': {
      obesity: 'BMI 约 31，伴打鼾；体重问题和睡眠情况可能影响性腺轴。',
      sleep: '家属说夜间打鼾，白天容易困；尚未完成睡眠呼吸暂停检查。',
      mood: '因性欲下降和生育计划产生焦虑，但无持续抑郁表现。'
    },
    'growth-delay': {
      diarrhea: '间断腹痛和腹泻，食欲下降；需排查营养吸收和慢性炎症原因。',
      'weight-loss': '近一年体重略下降，和身高增长变慢同时出现。',
      headache: '否认头痛、喷射性呕吐和视野改变。',
      mood: '因身高增长慢感到自卑和担心，但学习和日常功能尚可。'
    }
  };

  function diagnosticSymptomAnswer(template, item) {
    var completion = ctaPatientCompletion(template, state.person.sex);
    if (completion.symptoms && completion.symptoms[item.id]) return completion.symptoms[item.id];
    var overrides = CASE_SYMPTOM_PRESETS[template.id] || {};
    if (overrides[item.id]) return overrides[item.id];
    var matched = ctaHistoryItems().find(function (historyItem) {
      var source = String(historyItem.question || '') + ' ' + String(historyItem.answer || '');
      return (item.keywords || []).some(function (keyword) { return keyword.length >= 2 && source.includes(keyword); });
    });
    if (matched && matched.answer) return matched.answer;
    return DEFAULT_SYMPTOM_RESPONSES[item.id] || '患者回答（本病例固定预设）：目前否认该症状及其相关危险表现；如需进一步判断，继续追问起病时间、严重程度和伴随症状。';
  }

  function freeQuestionAnswer(template, query) {
    var normalized = String(query || '').trim();
    var qLower = normalized.toLowerCase();
    if (state.person.sex === '男' && /月经|阴道|末次月经|孕周|妊娠|哺乳/.test(normalized)) return { answer: '当前为男性训练病例，该问题不适用于本例；请改问性功能、生育计划或其他与主诉相关的问题。', sourceId: 'sex-inapplicable' };
    var matched = ctaHistoryItems().find(function (item) {
      var hay = String(item.question || '') + ' ' + String(item.answer || '');
      return qLower.length >= 2 && (hay.toLowerCase().includes(qLower) || qLower.split(/[，。；、\s]+/).filter(Boolean).some(function (word) {
        return word.length >= 2 && hay.toLowerCase().includes(word.toLowerCase());
      }));
    });
    if (matched) return { answer: matched.answer, sourceId: matched.id, historyId: matched.id };

    var symptom = ctaSymptomItems().find(function (item) {
      return (item.keywords || []).some(function (keyword) { return keyword.length >= 2 && qLower.includes(keyword.toLowerCase()); });
    });
    var completion = ctaPatientCompletion(template, state.person.sex);
    var answers = symptom ? [diagnosticSymptomAnswer(template, symptom)] : [];
    if (/过敏|药物过敏|食物过敏/.test(qLower)) answers.push('患者回答：' + (completion.allergy || '否认已知药物、食物和造影剂过敏。'));
    if (/既往|手术|住院|病史|结核|肝炎|输血/.test(qLower)) {
      answers.push('患者回答：' + (completion.past || '否认与本病例无关的重大手术、长期住院、结核、病毒性肝炎和输血史；相关病史见病例回答。'));
    }
    if (/家族|遗传|父母|兄弟|姐妹/.test(qLower)) {
      answers.push('患者回答：' + (completion.family || '除病例已显示线索外，否认近亲中同类内分泌疾病聚集。'));
    }
    if (/用药|药物|服药|漏服|剂量|胰岛素|保健品|激素/.test(qLower)) {
      var medicationAnswers = ctaHistoryItems().filter(function (item) {
        var source = String(item.id || '') + ' ' + String(item.question || '') + ' ' + String(item.answer || '');
        return /药|用药|服药|胰岛素|激素|保健/.test(source);
      }).map(function (item) { return item.answer; }).filter(Boolean);
      answers.push(medicationAnswers.length ? '患者回答：' + medicationAnswers.join('；') : '患者回答：' + (completion.meds || '当前没有病例外新增药物；已逐项核对药名、剂量、漏服和不良反应。'));
    }
    if (/吸烟|饮酒|酒精|烟草|电子烟|饮食|吃饭|进食|运动|锻炼|活动|饮料|夜宵/.test(qLower)) answers.push('患者回答：' + (completion.social || '不吸烟，饮酒少量；饮食、运动和照护情况按本病例固定记录。'));
    if (/妊娠|怀孕|月经|生育|性生活|乳房|泌乳|哺乳/.test(qLower)) answers.push('患者回答：' + (state.person.sex === '男' ? '本例为男性；不询问月经、妊娠或阴道出血，按适用性改问性功能和生育计划。' : (completion.reproductive || '按适用问题核对末次月经、妊娠可能、生育计划和相关症状。')));
    if (/起病|多久|时间|几天|几周|几月|持续|什么时候|以来|变化/.test(qLower)) answers.push(timelineInfo() + '；下一次变化以病程节点中显示的固定预设为准。');
    if (answers.length) return { answer: answers.join(' '), sourceId: symptom ? 'diagnostic-symptom-preset' : 'free-question-preset', symptomId: symptom ? symptom.id : '' };
    return { answer: '患者回答（本病例固定预设）：目前否认该问题有明显异常，也没有新的需要立即升级的表现；本例主线为“' + ctaPatientIntro() + '”。如需形成诊断依据，请继续追问时间、严重程度和相关危险信号。', sourceId: 'free-question-preset' };
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function loadState() { try { var raw = sessionStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
  function saveState() { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
  function randInt(max) { return Math.floor(Math.random() * max); }
  function choose(arr) { return arr[randInt(arr.length)]; }
  var SURNAME_POOL = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧'];
  function randomSurname() { return choose(SURNAME_POOL); }
  function between(min, max, digits) { var v = min + Math.random() * (max - min); return Number(v.toFixed(digits == null ? 0 : digits)); }
  function newSeed() { try { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0]; } catch { return Date.now() + Math.floor(Math.random() * 100000); } }
  var SCENES = [
    { id: 'outpatient-new', label: '门诊·新发异常', prompt: '完成主诉、现病史、危险信号、首轮检查和门诊计划。', guide: ['主诉与时间线', '危险信号与生命体征', '既往史/用药/过敏/妊娠或生育计划', '首轮检查及每项检查目的', '复诊时间、就医警示和转诊条件'] },
    { id: 'outpatient-followup', label: '门诊·老病号复诊/调整药物', prompt: '先看上次目标和变化，再核对依从性、低血糖/不良反应、共病和复查计划。', guide: ['上次计划完成情况与主诉变化', '药物名称、用法、漏服、费用和不良反应', '家庭监测/CGM/血压/体重趋势', '共病、并发症和新的危险信号', '调整理由、教育与下一次随访'] },
    { id: 'admission-new', label: '住院·新发病例/入院检查', prompt: '完成入院病历：现病史、系统回顾、既往/个人/家族/用药史，初步诊断和入院计划。', guide: ['入院指征和稳定性分层', '完整病史与查体', '问题清单及鉴别诊断', '检查、监测、会诊和告知', '住院期间目标与升级条件'] },
    { id: 'inpatient-day', label: '住院·日常病程/管床', prompt: '写今日病程：新变化、重要结果、疗效/不良反应、问题清单和今日计划。', guide: ['24 小时症状和生命体征变化', '重要化验/影像与趋势，不只抄数字', '每个问题的判断与证据', '药物安全、饮食、活动和护理沟通', '当天目标、复查和升级/出院条件'] },
    { id: 'discharge', label: '住院·出院准备/交接', prompt: '完成出院小结和交接：诊断、住院经过、药物核对、警示症状和随访。', guide: ['出院诊断与仍待解决问题', '住院经过及关键结果解释', '药物、设备、注射/监测教育', '危险信号和再就医途径', '复诊、复查、转诊和患者理解确认'] },
    { id: 'post-discharge', label: '门诊·出院后随访', prompt: '核对出院方案是否可执行，处理新结果、药物问题和复发/再入院风险。', guide: ['出院后症状和功能恢复', '药物/设备/费用/依从性核对', '复查结果与指南目标', '并发症和再入院危险信号', '共享决策与下一节点'] }
  ];
  var DOCUMENT_TEMPLATES = {
    outpatient: {
      label: '门诊病历/首诊记录',
      source: '依据国家卫生健康委《病历书写基本规范》（卫医政发〔2010〕11号）中的门诊病历基本结构；实际门诊模板以所在医院为准。',
      fields: [
        ['主诉', '写清主要症状或异常指标及持续时间，不把诊断名称直接当主诉。'],
        ['现病史', '按时间线写起病、变化、伴随症状、已做检查、用药和患者最关心的问题。'],
        ['相关既往史与用药', '写相关疾病、手术、过敏、妊娠/生育计划及影响本次判断的药物。'],
        ['查体与辅助检查', '只写本例已获得或计划获得的资料，并标出对判断有影响的结果。'],
        ['初步判断与鉴别', '写当前最可能问题、支持证据、尚不能排除的危险情况及理由。'],
        ['处理计划与安全网', '写下一步检查/复诊、教育、依从性核对，以及哪些表现需要立即升级评估。']
      ]
    },
    admission: {
      label: '入院记录/住院志',
      source: '依据国家卫生健康委《病历书写基本规范》（卫医政发〔2010〕11号）中的入院记录项目；实际住院志格式以所在医院为准。',
      fields: [
        ['主诉与入院经过', '写症状或异常指标及时间，并说明本次入院指征和入院前处理。'],
        ['现病史与系统回顾', '按时间线写病情演变、伴随症状、阴性危险信号和已完成检查。'],
        ['既往史/个人史/婚育月经/家族史', '仅记录与本例相关或规范要求核对的内容，妊娠可能和生育计划需在适用时写明。'],
        ['体格与专科检查', '记录生命体征、一般查体和本病相关专科查体，注明关键阳性/阴性所解决的问题。'],
        ['辅助检查与初步诊断', '区分已回报结果和待完成检查，列出初步诊断及需要鉴别的急危重症。'],
        ['入院后诊疗计划', '按问题清单写监测、检查、会诊、治疗/教育、复评节点和升级条件。']
      ]
    },
    firstCourse: {
      label: '首次病程记录',
      source: '依据国家卫生健康委《病历书写基本规范》（卫医政发〔2010〕11号）：首次病程记录应在患者入院后8小时内完成；医院电子病历模板和时限要求优先。',
      fields: [
        ['病例特点', '用几句话概括主诉、关键病史、查体和重要检查，不要把整段入院记录复制过来。'],
        ['拟诊与诊断依据', '列出当前诊断、支持证据和仍需鉴别的疾病，不能把未证实内容写成确定诊断。'],
        ['诊疗计划', '写检查、监测、会诊、治疗/教育及复评节点，并说明每项计划要解决的问题。'],
        ['风险与告知', '写已识别的危险表现、升级条件、沟通重点和患者/家属理解情况。']
      ]
    },
    dailyCourse: {
      label: '日常病程记录',
      source: '依据国家卫生健康委《病历书写基本规范》关于日常病程记录的连续记录要求；实际书写频次和结构以医院制度为准。',
      fields: [
        ['今日病情变化', '写症状、生命体征、出入量或功能变化，突出与昨日相比的变化。'],
        ['检查结果与趋势解释', '写新回报结果及其对问题清单的影响，不只抄数值。'],
        ['问题清单与疗效/不良反应', '逐项写诊断线索、治疗反应、依从性和需要复核的安全问题。'],
        ['今日计划与升级条件', '写当天检查、治疗/护理/教育、复查时间点、会诊和出现何种情况需升级。']
      ]
    },
    discharge: {
      label: '出院记录/出院小结',
      source: '依据国家卫生健康委《病历书写基本规范》关于出院记录项目；实际出院文书和审核流程以医院为准。',
      fields: [
        ['入院情况与出院诊断', '概括入院原因、关键表现及最终诊断状态，区分已确诊与待随访问题。'],
        ['住院经过与关键结果', '按问题写主要检查、治疗反应、重要不良反应和出院时状态。'],
        ['出院用药与核对', '记录继续/停止/调整的药物及需核对的剂量、依从性和监测事项，不在模板中自行生成剂量。'],
        ['复查随访与安全网', '写复查项目、时间、转诊/会诊安排，以及出现何种危险表现应立即就医。']
      ]
    },
    followup: {
      label: '门诊复诊/随访记录',
      source: '依据病历连续记录原则和本网站已标注的疾病随访指南路径；具体随访表单以医院为准。',
      fields: [
        ['上次计划完成情况', '逐项写检查、用药、生活方式和教育计划是否完成及原因。'],
        ['本次症状与客观指标', '写症状变化、家庭监测、体重/血压/血糖等本例实际获得的趋势。'],
        ['疗效、安全性与共病', '写治疗获益、低血糖/不良反应、肾心功能和新出现的危险信号。'],
        ['本次计划与下次节点', '写调整依据、复查项目、随访时间、安全网和患者复述确认。']
      ]
    }
  };
  function workflowTemplateFor(sceneId) {
    if (sceneId === 'admission-new') return 'admission';
    if (sceneId === 'inpatient-day') return 'dailyCourse';
    if (sceneId === 'discharge') return 'discharge';
    if (sceneId === 'post-discharge' || sceneId === 'outpatient-followup') return 'followup';
    return 'outpatient';
  }
  function requiredIds(bucket) {
    return template[bucket].filter(function (x) { return x.redFlag || x.essential || x.id === 'symptoms' || x.id === 'insulin' || x.id === 'crisis'; }).map(function (x) { return x.id; });
  }
  function missingRequired(bucket) {
    return requiredIds(bucket).filter(function (id) { return !state.asked[bucket].includes(id); });
  }
  function ctaWorkflowComplete() {
    var it = state.interview || {};
    return !!(it.started && (it.submitted || (it.stationSubmitted && it.stationSubmitted.three)));
  }
  function gateFor(type) {
    if ((type === 'workflow' || type === 'review') && ctaWorkflowComplete()) return 'done';
    if (!state.asked.communication) return type === 'start' ? 'open' : 'communication';
    if (missingRequired('history').length) return type === 'start' || type === 'history' ? 'open' : 'history';
    if (missingRequired('exams').length) return type === 'start' || type === 'history' || type === 'exams' ? 'open' : 'exams';
    if (missingRequired('tests').length) return type === 'start' || type === 'history' || type === 'exams' || type === 'tests' ? 'open' : 'tests';
    if (!state.asked.decisions.length) return type === 'start' || type === 'history' || type === 'exams' || type === 'tests' || type === 'decisions' ? 'open' : 'decisions';
    return 'done';
  }
  function gateLabel(gate) {
    return ({ communication: '先完成一次有回应的沟通', history: '先完成必问病史，尤其是危险信号', exams: '先完成关键床旁查体', tests: '先完成必要的首轮检查', decisions: '先作出下一步判断', done: '前置临床推理已完成' })[gate] || '';
  }
  function timelineInfo() {
    var completion = ctaPatientCompletion(template, state.person.sex);
    if (completion && completion.timeline) return '本病例固定时间线：' + completion.timeline;
    var text = [ctaPatientIntro()].concat(ctaHistoryItems().map(function (item) { return item.answer || ''; })).join(' ');
    var matches = text.match(/(?:近|约|持续|已有|过去|前)s*[0-9一二三四五六七八九十]+s*(?:天|日|周|星期|个月|月|年|小时)/g) || [];
    var unique = matches.filter(function (item, index) { return matches.indexOf(item) === index; });
    return unique.length ? '本病例时间线：' + unique.join('、') : '本病例时间线：主诉出现后按题干到诊，起病方式、变化趋势和就诊前处理已在“完整时间线”问诊项中预设，仍需在病历中主动记录。';
  }
  function caseDataText() {
    var history = ctaHistoryItems().map(function (item) { return '【' + item.question + '】患者回答：' + item.answer + '；意义：' + item.why; }).join('\n');
    var exams = template.exams.map(function (item) { return '【' + item.label + '】模拟结果：' + item.result + '；意义：' + item.meaning; }).join('\n');
    var tests = template.tests.map(function (item) { return '【' + item.name + '】结果：' + item.result + '；解释：' + item.interpretation; }).join('\n');
    return { history: history, exams: exams, tests: tests };
  }
  function autoDraftsFor(key) {
    var scene = SCENES.find(function (item) { return item.id === state.scene; }) || SCENES[0];
    var data = caseDataText();
    var timeline = timelineInfo();
    var profile = state.profile || {};
    var patient = state.person.age + '岁，' + state.person.sex + '，职业：' + state.person.job + '（虚构教学病例，不含真实身份信息）';
    var chief = state.person.complaint + '；' + timeline;
    var completion = ctaPatientCompletion(template, state.person.sex);
    var history = ctaPatientIntro() + '\n' + timeline + '\n' + data.history + '\n本病例已预设常见病史、过敏史、用药史、个人/家族史和系统回顾；病历只记录你实际主动询问并获得的回答。';
    var background = '既往/共病线索：' + (profile.comorbidities || []).join('、') + '。\n既往史补充：' + (completion.past || '按病例问诊回答核对') + '\n过敏史：' + (completion.allergy || '按病例问诊回答核对') + '\n用药线索：' + (profile.meds || completion.meds || '已逐项核对') + '\n个人/家族/婚育史：' + [completion.social, completion.family, completion.reproductive].filter(Boolean).join('；');
    var exam = '就诊场景：' + scene.label + '；' + (profile.context || '') + '\n生命体征/体格变量：BP ' + (profile.vitals && profile.vitals.bp || '已建立教学基线') + ' mmHg，HR ' + (profile.vitals && profile.vitals.hr || '已建立教学基线') + '/min，T ' + (profile.vitals && profile.vitals.temp || '已建立教学基线') + '℃，BMI ' + (profile.vitals && profile.vitals.bmi || '已建立教学基线') + '。\n' + data.exams;
    var diagnosis = '病例特点：' + template.note + '\n首要判断：根据已完成的检查和下一步判断选项整理，不能把模拟结果外推到真实患者。\n鉴别诊断/排除理由：' + template.decisions.map(function (item) { return item.label + '；理由：' + item.why; }).join('\n');
    var plan = '首轮检查与监测：' + template.tests.filter(function (item) { return item.essential || item.redFlag; }).map(function (item) { return item.name + '（目的：' + item.why + '）'; }).join('；') + '。\n安全网：' + ctaHistoryItems().filter(function (item) { return item.redFlag; }).map(function (item) { return item.question + '；患者回答：' + item.answer; }).join('；') + '。\n下一步：完成临床判断后回到相应指南路径、药物卡和院内急救/会诊流程核对。';
    var drafts = {
      outpatient: {
        '主诉': chief,
        '现病史': history,
        '相关既往史与用药': background,
        '查体与辅助检查': exam + '\n' + data.tests,
        '初步判断与鉴别': diagnosis,
        '处理计划与安全网': plan
      },
      admission: {
        '主诉与入院经过': chief + '。入院场景：' + scene.label + '；' + (profile.context || ''),
        '现病史与系统回顾': history + '\n系统回顾只记录已询问内容，未提供项目列为待补问。',
        '既往史/个人史/婚育月经/家族史': background,
        '体格与专科检查': exam,
        '辅助检查与初步诊断': data.tests + '\n' + diagnosis,
        '入院后诊疗计划': plan + '\n监测、会诊和升级条件按病情及院内流程执行。'
      },
      firstCourse: {
        '病例特点': patient + '；' + chief + '。\n' + data.history + '\n' + data.exams,
        '拟诊与诊断依据': diagnosis + '\n辅助检查依据：' + data.tests,
        '诊疗计划': plan,
        '风险与告知': '已识别的危险表现：' + (ctaHistoryItems().filter(function (item) { return item.redFlag; }).map(function (item) { return item.question; }).join('；') || '本例暂未标注特殊危险表现') + '。\n告知患者本页为虚构训练，真实患者需由上级医师审核。'
      },
      dailyCourse: {
        '今日病情变化': '教学病例今日记录：' + chief + '。\n与前一节点相比的变化需根据本例已打开的问诊、查体和检查结果填写；未提供的变化不得补写。',
        '检查结果与趋势解释': data.tests + '\n趋势：本例仅提供当前教学节点，连续趋势需在真实病程中按时间补记。',
        '问题清单与疗效/不良反应': diagnosis + '\n治疗反应、不良反应、依从性和护理观察未在本例设定者，标记待核对。',
        '今日计划与升级条件': plan
      },
      discharge: {
        '入院情况与出院诊断': chief + '。\n出院诊断状态：依据本例已提供资料整理；未证实项目标为待随访，不自动生成确定诊断。',
        '住院经过与关键结果': history + '\n' + data.exams + '\n' + data.tests,
        '出院用药与核对': '本例只生成需要核对的药物类别和安全问题：' + (profile.meds || '逐项核对处方、过敏和最近一次用药') + '。不自动生成新的剂量或停药指令。',
        '复查随访与安全网': plan + '\n出院前需确认患者/家属能够复述药物、复查、转诊和立即就医条件。'
      },
      followup: {
        '上次计划完成情况': '本例为' + scene.label + '。已知资料：' + data.history + '\n未提供的上次检查、用药和生活方式执行情况需在复诊时逐项核对。',
        '本次症状与客观指标': chief + '\n' + exam + '\n' + data.tests,
        '疗效、安全性与共病': diagnosis + '\n安全性重点：' + (profile.comorbidities || []).join('、') + '；' + (profile.meds || ''),
        '本次计划与下次节点': plan + '\n下次复诊时间和复查项目须依据具体指南、结果和医院流程确定。'
      }
    };
    return drafts[key] || drafts.outpatient;
  }
  function rubricFor(field, value) {
    var rules = {
      '主诉': ['时间', '持续', '起病'], '主诉与入院经过': ['时间', '入院'], '现病史': ['时间线', '伴随', '检查', '用药'], '现病史与系统回顾': ['时间线', '系统', '危险'],
      '相关既往史与用药': ['既往', '用药', '过敏'], '既往史/个人史/婚育月经/家族史': ['既往', '家族', '待补问'], '查体与辅助检查': ['生命体征', '检查'], '体格与专科检查': ['生命体征', '查体'],
      '初步判断与鉴别': ['判断', '鉴别', '理由'], '辅助检查与初步诊断': ['检查', '诊断'], '处理计划与安全网': ['计划', '安全网'], '入院后诊疗计划': ['监测', '会诊', '升级'],
      '病例特点': ['主诉', '病史', '查体'], '拟诊与诊断依据': ['诊断', '依据'], '诊疗计划': ['检查', '计划'], '风险与告知': ['危险', '告知'], '今日病情变化': ['今日', '变化'],
      '检查结果与趋势解释': ['结果', '趋势'], '问题清单与疗效/不良反应': ['问题', '不良反应'], '今日计划与升级条件': ['计划', '升级'], '入院情况与出院诊断': ['入院', '诊断'],
      '住院经过与关键结果': ['经过', '结果'], '出院用药与核对': ['用药', '核对'], '复查随访与安全网': ['复查', '安全网'], '上次计划完成情况': ['上次', '核对'], '本次症状与客观指标': ['症状', '指标'],
      '疗效、安全性与共病': ['疗效', '安全性', '共病'], '本次计划与下次节点': ['计划', '下次']
    }[field] || ['待补问'];
    var text = String(value || ''), lower = text.toLowerCase(), hits = rules.filter(function (word) { return lower.includes(word.toLowerCase()); });
    var present = text.trim().length >= 8;
    return { field: field, score: (present ? 1 : 0) + (hits.length >= Math.max(1, Math.ceil(rules.length * .6)) ? 1 : 0), max: 2, feedback: !present ? '尚未形成可审核内容' : hits.length >= Math.max(1, Math.ceil(rules.length * .6)) ? '结构要点已覆盖，仍需与原始资料逐项核对' : '有文字，但还缺：' + rules.filter(function (word) { return !lower.includes(word.toLowerCase()); }).join('、') };
  }
  function documentScore() {
    var key = state.workflow && state.workflow.documentType ? state.workflow.documentType : workflowTemplateFor(state.scene);
    var doc = DOCUMENT_TEMPLATES[key] || DOCUMENT_TEMPLATES.outpatient;
    var drafts = autoDraftsFor(key);
    var filled = doc.fields.filter(function (f) { return String(state.notes[f[0]] || '').trim().length >= 8; });
    var rubric = doc.fields.map(function (f) { return rubricFor(f[0], state.notes[f[0]]); });
    var totalPoints = rubric.reduce(function (sum, item) { return sum + item.max; }, 0);
    var earnedPoints = rubric.reduce(function (sum, item) { return sum + item.score; }, 0);
    return { key: key, doc: doc, drafts: drafts, filled: filled, total: doc.fields.length, rubric: rubric, totalPoints: totalPoints, earnedPoints: earnedPoints, ratio: Math.round(earnedPoints / Math.max(totalPoints, 1) * 100) };
  }
  function ctaPatientCompletion(template, sex) {
    var completion = Object.assign({}, template.completion || {});
    if (sex !== '男') return completion;
    if (template.id === 'pituitary-vision') {
      completion.timeline = '近 1 个月双侧周边视野逐渐变窄，偶有复视；近 4 个月出现性欲下降和勃起困难，今天因视野变化和泌乳素升高转诊。';
      completion.past = '无颅脑外伤、垂体手术或放疗史；无明确肾上腺疾病；没有影响本次评估的相关用药史。';
      completion.meds = '近 1 个月使用甲氧氯普胺；没有抗精神病药、雌激素或甲状腺激素；需同步核对药物对泌乳素的影响。';
      completion.systemReview = '除头痛、视野改变、性欲下降和乏力外，否认持续呕吐、晕厥、意识改变和突发剧烈头痛。';
      completion.symptoms = Object.assign({}, completion.symptoms || {});
      delete completion.symptoms['vaginal-bleeding'];
    }
    if (template.id === 'cushing') {
      completion.timeline = '近 1 年体重和血压逐渐升高，近 4 个月出现皮肤紫纹和近端肌无力；今日因多项代谢异常转诊。';
      completion.social = '久坐、睡眠不足；不吸烟；性功能和生育相关情况需按患者意愿核对。';
      completion.systemReview = '有体重增加、近端无力和皮肤易瘀青；否认急性意识改变、持续呕吐和胸痛。';
      completion.symptoms = Object.assign({}, completion.symptoms || {});
      delete completion.symptoms['vaginal-bleeding'];
    }
    return completion;
  }
  function ctaPatientComplaints(template, sex) {
    var complaints = (template.complaints || []).slice();
    if (sex === '男' && template.id === 'pituitary-vision') return complaints.map(function (item) { return item.replace('月经紊乱/性欲下降', '性欲下降/勃起困难'); });
    if (sex === '男' && template.id === 'cushing') return complaints.map(function (item) { return item.replace('容易瘀青、月经紊乱', '容易瘀青、性功能/生育方面变化'); });
    return complaints.filter(function (item) { return !(sex === '男' && /月经|妊娠|孕周|阴道/.test(item)); });
  }
  function ctaPatientMoods(template, sex) {
    var moods = (template.moods || []).map(function (item) { return Object.assign({}, item); });
    if (sex === '男' && template.id === 'pituitary-vision') moods.forEach(function (item) { if (item.id === 'shy') item.opening = '有些性功能问题我不太好意思说，但近来确实有变化。'; });
    return moods;
  }
  function ctaPatientIntro() {
    var intro = template.intro || '';
    if (state.person.sex === '男' && template.id === 'pituitary-vision') intro = intro.replace('月经/性功能变化', '性功能变化');
    if (state.person.sex === '男' && template.id === 'cushing') intro = intro.replace('月经紊乱', '性功能或生育方面变化');
    return intro;
  }
  function buildProfile(template, person, scene) {
    var id = template.id;
    var completion = ctaPatientCompletion(template, person.sex);
    var acute = /dka|hypoglycemia|hyponatremia|adrenal-insufficiency|diabetic-foot|hypoparathyroidism/.test(id);
    var age = person.age;
    var bp = acute ? between(92, 128) + '/' + between(56, 82) : /primary-aldosteronism|cushing|obesity|pheochromocytoma/.test(id) ? between(142, 178) + '/' + between(88, 108) : between(108, 148) + '/' + between(66, 92);
    var hr = acute ? between(96, 128) : /hyperthyroidism|pheochromocytoma/.test(id) ? between(96, 132) : between(58, 96);
    var temp = acute ? between(36.4, 38.6, 1) : between(36.2, 37.4, 1);
    var bmi = /osteoporosis|growth-delay|adrenal-insufficiency/.test(id) ? between(18.2, 25.8, 1) : /obesity|prediabetes|pcos/.test(id) ? between(28.0, 38.8, 1) : between(20.4, 31.8, 1);
    var comorbidityPool = age >= 60 ? ['高血压', '血脂异常', '慢性肾病风险', '骨质疏松风险'] : ['家族糖尿病史', '睡眠不足/打鼾', '焦虑或就诊紧张', '既往用药暴露'];
    var comorbidities = [choose(comorbidityPool)];
    if (Math.random() > .55) comorbidities.push(choose(comorbidityPool.filter(function (x) { return !comorbidities.includes(x); })));
    if (/diabetes|prediabetes|obesity|gestational/.test(id) && !comorbidities.includes('家族糖尿病史')) comorbidities.unshift('糖代谢风险');
    if (/thyroid|hyperthyroidism|hypothyroidism/.test(id)) comorbidities.push('甲状腺相关既往史待核对');
    var meds = completion.meds || (/dka|new-t1d|new-t2d|gestational/.test(id) ? '尚未规律使用降糖药或正在建立方案' : /hypoglycemia/.test(id) ? '胰岛素/促泌剂等降糖药（需逐项核对）' : /primary-aldosteronism/.test(id) ? '降压药及可能影响 ARR 的药物（需核对）' : /thyroid/.test(id) ? '甲状腺药物/含碘或生物素产品（需核对）' : '处方药、保健品和近期停药情况需核对');
    var context = scene.id.indexOf('admission') >= 0 ? '本次因新发异常或危险信号收入院' : scene.id.indexOf('inpatient') >= 0 ? '住院第 ' + between(1, 6) + ' 天，需写病程并追踪趋势' : scene.id === 'discharge' ? '症状较入院稳定，正在做出院核对' : scene.id === 'post-discharge' ? '出院后首次/早期随访，重点看方案能否执行' : scene.id === 'outpatient-followup' ? '既往已确诊，今天重点是疗效、安全和目标调整' : '首次门诊评估，需明确是否需要急诊/住院';
    return { scene: scene.label, context: context, vitals: { bp: bp, hr: hr, temp: temp, bmi: bmi }, comorbidities: comorbidities, meds: meds, pastHistory: completion.past || '', allergy: completion.allergy || '', familyHistory: completion.family || '', socialHistory: completion.social || '', reproductiveHistory: completion.reproductive || '', occupationContext: person.job + '，' + (Math.random() > .5 ? '工作日久坐' : '工作时间不规律') };
  }
  function makeCase() {
    var template = choose(CASES);
    var sex = choose(template.demographics.sexes);
    var mood = choose(ctaPatientMoods(template, sex));
    var person = { surname: randomSurname(), age: choose(template.demographics.ages), sex: sex, job: choose(template.demographics.jobs), complaint: choose(ctaPatientComplaints(template, sex)), moodId: mood.id };
    var scene = choose(SCENES);
    return {
      templateId: template.id,
      person: person,
      scene: scene.id,
      profile: buildProfile(template, person, scene),
      asked: { communication: false, history: [], exams: [], tests: [], decisions: [] },
      opened: { history: {}, exams: {}, tests: {}, decisions: {} },
      scores: { communication: 0, history: 0, exams: 0, tests: 0, decisions: 0 },
      hints: 0,
      response: '',
      notes: {},
      workflowGuide: false,
      workflow: { documentType: workflowTemplateFor(scene.id), submitted: false, score: 0, feedback: '', draftInitialized: false, autoGenerated: false },
      interview: { started: false, phase: 'history', station: 1, setting: scene.id.indexOf('inpatient') >= 0 || scene.id === 'discharge' ? 'inpatient' : 'outpatient', day: 1, identityConfirmed: false, askedHistory: [], freeQuestions: [], selectedExams: [], selectedTests: [], testStatus: {}, reviewedTests: [], reassessmentExams: [], reassessmentTests: [], impressionDecision: '', finalDecision: '', evidence: {}, selectedMeds: [], selectedOrders: [], activeOrders: [], stoppedOrders: [], progression: [], currentEvent: null, dischargeSuggested: false, discharged: false, historyReturns: 0, examReturns: 0, stationSubmitted: { one: false, two: false, three: false }, text: { impression: '', diagnosis: '', plan: '', discharge: '' }, submitted: false, score: null },
      activeTab: 'start',
      completed: false,
      seed: newSeed()
    };
  }
  var state = loadState() || makeCase();
  if (!state || !state.templateId || !state.person || !state.asked || !state.opened || !state.scores) state = makeCase();
  var template = CASES.find(function (item) { return item.id === state.templateId; }) || CASES[0];
  var surnameChanged = false;
  if (!state.person.surname || !/^[\u4e00-\u9fff]$/.test(String(state.person.surname))) {
    state.person.surname = randomSurname();
    surnameChanged = true;
  }
  var validComplaints = ctaPatientComplaints(template, state.person && state.person.sex);
  if (state.person && validComplaints.length && !validComplaints.includes(state.person.complaint)) state.person.complaint = validComplaints[0];
  if (!state.scene || !SCENES.some(function (x) { return x.id === state.scene; })) state.scene = SCENES[0].id;
  if (!state.profile) state.profile = buildProfile(template, state.person, SCENES.find(function (x) { return x.id === state.scene; }) || SCENES[0]);
  var currentPatientCompletion = ctaPatientCompletion(template, state.person.sex);
  if (state.profile) {
    state.profile.pastHistory = currentPatientCompletion.past || state.profile.pastHistory || '';
    state.profile.allergy = currentPatientCompletion.allergy || state.profile.allergy || '';
    state.profile.familyHistory = currentPatientCompletion.family || state.profile.familyHistory || '';
    state.profile.socialHistory = currentPatientCompletion.social || state.profile.socialHistory || '';
    state.profile.reproductiveHistory = currentPatientCompletion.reproductive || state.profile.reproductiveHistory || '';
    state.profile.meds = currentPatientCompletion.meds || state.profile.meds || '';
  }
  if (surnameChanged) saveState();
  if (!state.notes) state.notes = {};
  if (!state.workflow) state.workflow = { documentType: workflowTemplateFor(state.scene), submitted: false, score: 0, feedback: '', draftInitialized: false, autoGenerated: false };
  if (typeof state.workflow.draftInitialized !== 'boolean') state.workflow.draftInitialized = false;
  if (typeof state.workflow.autoGenerated !== 'boolean') state.workflow.autoGenerated = false;
  if (!state.workflow.documentType || !DOCUMENT_TEMPLATES[state.workflow.documentType]) state.workflow.documentType = workflowTemplateFor(state.scene);
  if (!state.interview) state.interview = { started: false, phase: 'history', station: 1, setting: 'outpatient', day: 1, identityConfirmed: false, askedHistory: [], freeQuestions: [], selectedExams: [], selectedTests: [], testStatus: {}, reviewedTests: [], reassessmentExams: [], reassessmentTests: [], impressionDecision: '', finalDecision: '', evidence: {}, selectedMeds: [], selectedOrders: [], activeOrders: [], stoppedOrders: [], progression: [], currentEvent: null, dischargeSuggested: false, discharged: false, historyReturns: 0, examReturns: 0, stationSubmitted: { one: false, two: false, three: false }, text: { impression: '', diagnosis: '', plan: '', discharge: '' }, submitted: false, score: null };
  if (!state.interview.text) state.interview.text = { impression: '', diagnosis: '', plan: '', discharge: '' };
  if (typeof state.interview.text.discharge !== 'string') state.interview.text.discharge = '';
  if (!Array.isArray(state.interview.askedHistory)) state.interview.askedHistory = [];
  if (!Array.isArray(state.interview.freeQuestions)) state.interview.freeQuestions = [];
  if (!Array.isArray(state.interview.selectedExams)) state.interview.selectedExams = [];
  if (!Array.isArray(state.interview.selectedTests)) state.interview.selectedTests = [];
  if (!state.interview.testStatus || typeof state.interview.testStatus !== 'object') state.interview.testStatus = {};
  if (!Array.isArray(state.interview.reviewedTests)) state.interview.reviewedTests = [];
  if (!Array.isArray(state.interview.reassessmentExams)) state.interview.reassessmentExams = [];
  if (!Array.isArray(state.interview.reassessmentTests)) state.interview.reassessmentTests = [];
  if (!state.interview.evidence || typeof state.interview.evidence !== 'object') state.interview.evidence = {};
  if (!Array.isArray(state.interview.selectedMeds)) state.interview.selectedMeds = [];
  if (!Array.isArray(state.interview.selectedOrders)) state.interview.selectedOrders = [];
  if (!Array.isArray(state.interview.activeOrders)) state.interview.activeOrders = [];
  if (!Array.isArray(state.interview.stoppedOrders)) state.interview.stoppedOrders = [];
  if (!Array.isArray(state.interview.progression)) state.interview.progression = [];
  if (typeof state.interview.day !== 'number') state.interview.day = 1;
  if (typeof state.interview.dischargeSuggested !== 'boolean') state.interview.dischargeSuggested = false;
  if (typeof state.interview.discharged !== 'boolean') state.interview.discharged = false;
  if (typeof state.interview.started !== 'boolean') state.interview.started = false;
  if (typeof state.interview.submitted !== 'boolean') state.interview.submitted = false;
  if (!state.interview.phase) state.interview.phase = 'history';
  if (!state.interview.setting) state.interview.setting = 'outpatient';
  if (typeof state.interview.historyReturns !== 'number') state.interview.historyReturns = 0;
  if (typeof state.interview.examReturns !== 'number') state.interview.examReturns = 0;
  if (typeof state.interview.station !== 'number') state.interview.station = 1;
  if (typeof state.interview.identityConfirmed !== 'boolean') state.interview.identityConfirmed = false;
  if (!state.interview.stationSubmitted || typeof state.interview.stationSubmitted !== 'object') state.interview.stationSubmitted = { one: false, two: false, three: false };
  var moodOptions = ctaPatientMoods(template, state.person.sex);
  var mood = moodOptions.find(function (item) { return item.id === state.person.moodId; }) || moodOptions[0] || template.moods[0];

  function progressCount() {
    var cta = state.interview && state.interview.started ? state.interview.askedHistory.length + state.interview.selectedExams.length + state.interview.selectedTests.length + (state.interview.finalDecision ? 1 : 0) + (state.interview.submitted ? 1 : 0) : 0;
    return state.asked.history.length + state.asked.exams.length + state.asked.tests.length + state.asked.decisions.length + (state.asked.communication ? 1 : 0) + cta;
  }
  function markOnce(bucket, id, points) {
    if (!state.asked[bucket].includes(id)) { state.asked[bucket].push(id); state.scores[bucket] += points || 1; saveState(); }
  }
  function openLink(link) {
    if (!link) return;
    if (link.type === 'workup' && typeof window.openWorkup === 'function') window.openWorkup(link.id);
    else if (link.type === 'disease' && typeof window.openDiseaseFromSymptom === 'function') window.openDiseaseFromSymptom(link.id);
    else if (typeof window.show === 'function') window.show('workups');
  }
  function linksHtml(links) {
    return (links || []).map(function (link) { return '<button class="sim-link" type="button" data-sim-link="' + esc(link.type + ':' + link.id) + '">' + esc(link.label) + '</button>'; }).join(' ');
  }
  function medicationRefsHtml() {
    var refs = (window.SIM_CASE_MEDICATIONS || {})[template.id] || [];
    if (!refs.length) return '<div class="sim-review-block"><h4>本例药物核对</h4><p class="sim-muted">本例暂未添加统一药物卡；请先完成诊断、分型和安全评估，再回药物剂量卡核对。</p></div>';
    return '<div class="sim-review-block sim-medication-check"><h4>本例药物核对（不是自动处方）</h4><p class="sim-muted">下面是本例应主动核对的候选方向、暂缓/避免项或急症入口。只有带“查看药物卡”的项目才有可直接检索的药物卡；其余项目请打开对应路径，不能自行补剂量。</p><div class="sim-med-ref-list">' + refs.map(function (ref) {
      var action = ref.medSearch ? '<button class="sim-link" type="button" data-sim-action="jump-med-name" data-sim-id="' + esc(ref.medSearch) + '">查看药物卡</button>' : ref.target === 'complication' ? '<button class="sim-link" type="button" data-sim-action="jump-complications">打开并发症分级处置</button>' : '';
      return '<article class="sim-med-ref"><div><span class="sim-stage">' + esc(ref.type || '核对') + '</span><b>' + esc(ref.name) + '</b></div><p><b>本例作用：</b>' + esc(ref.role) + '</p><p><b>安全核对：</b>' + esc(ref.safety) + '</p><p class="sim-muted">依据：' + esc(ref.source) + '</p>' + action + '</article>';
    }).join('') + '</div></div>';
  }
  // CTA模式把“问什么、何时查、如何处理”拆成互相独立的动作。
  // 练习阶段只显示患者回答/检查结果；why、redFlag、correct 等解析字段只在提交后由 ctaReview() 展开。
  function ctaSettingLabel() { return state.interview.setting === 'inpatient' ? '住院病人（含病程复评）' : '门诊病人（首诊/复诊）'; }
  function ctaIdentityHonorific() { return state.person.sex === '女' ? '女士' : '先生'; }
  function ctaIdentityLabel() { return (state.person.surname || '患者') + ctaIdentityHonorific(); }
  function ctaIdentityQuestion() { return '您好，请问您是本病例设定的 ' + ctaIdentityLabel() + ' 吗？为了保障安全，请您说一下年龄、职业和今天来诊的主要原因。'; }
  function ctaIdentityAnswer() { return '是的，我是本病例设定的 ' + ctaIdentityLabel() + '，今年 ' + state.person.age + ' 岁，从事' + state.person.job + '，今天因为“' + state.person.complaint + '”来诊。'; }
  function ctaIdentityHtml() {
    return '<section class="sim-identity-card"><div class="sim-identity-badge">问诊第 0 步 · 身份核对</div><h4>先确认患者身份，再开始病史询问</h4><p class="sim-muted">这是每个病例的固定首步。训练不要求输入真实姓名；请使用“患者姓氏＋女士/先生”称谓，核对年龄、职业和本次就诊原因，并向患者说明身份核对的目的。</p><div class="sim-identity-script"><b>建议话术</b><p>“' + esc(ctaIdentityQuestion()) + '”</p></div><div class="sim-identity-patient"><span class="sim-stage">患者待确认资料</span><b>' + esc(ctaIdentityLabel() + ' · ' + state.person.age + ' 岁') + '</b><span>职业：' + esc(state.person.job) + '</span><small>本例为虚构教学身份，仅使用随机姓氏和职业背景，不填写真实姓名或身份证号码。</small></div><button class="primary" type="button" data-sim-action="cta-confirm-identity">已向患者确认身份，进入问诊</button></section>';
  }
  function ctaPatientHistoryItem(item) {
    var copy = Object.assign({}, item);
    var male = state.person.sex === '男';
    var completion = ctaPatientCompletion(template, state.person.sex);
    var completionKey = { 'completion-timeline': 'timeline', 'completion-past': 'past', 'completion-allergy': 'allergy', 'completion-medications': 'meds', 'completion-family': 'family', 'completion-social': 'social', 'completion-reproductive': 'reproductive', 'completion-system-review': 'systemReview' }[item.id];
    if (completionKey && completion[completionKey]) copy.answer = completion[completionKey];
    if (template.id === 'pituitary-vision' && item.id === 'pituitary') {
      if (male) {
        copy.question = '性欲、勃起、乳溢、头痛和生育计划？';
        copy.answer = '近几个月性欲下降、勃起困难；没有乳溢，近期没有明确生育计划。';
        copy.why = '男性患者应结合性腺功能、泌乳素、垂体轴和生育目标评估，不能套用月经问题。';
      } else {
        copy.question = '月经、泌乳、性欲、头痛和生育计划？';
        copy.answer = '月经 4 个月不规律，有乳溢；近期有生育计划。';
      }
    }
    if (male && item.id === 'completion-reproductive') {
      copy.question = '适用时请询问性功能、性活动相关风险和生育计划。';
      copy.answer = '目前没有新的性功能异常主诉；生育计划需按患者意愿和本例情境确认。';
    }
    if (male) {
      copy.question = String(copy.question || '')
        .replace(/既往有妊娠糖尿病、家族史/g, '家族中有糖尿病')
        .replace(/既往有没有妊娠糖尿病、胰腺疾病或糖尿病家族史/g, '本人有无胰腺疾病或糖尿病家族史')
        .replace(/生育\/妊娠计划/g, '生育计划')
        .replace(/月经\/性功能变化/g, '性功能变化')
        .replace(/月经和体重记录/g, '性功能和体重记录')
        .replace(/月经、妊娠可能、哺乳、/g, '性功能、')
        .replace(/月经、妊娠可能/g, '性功能和生育计划')
        .replace(/妊娠可能或/g, '')
        .replace(/妊娠\/生育计划/g, '生育计划')
        .replace(/月经改变/g, '性功能或生育改变')
        .replace(/月经变化/g, '性功能或生育变化');
      copy.answer = String(copy.answer || '')
        .replace(/月经 4 个月不规律，有乳溢；近期有生育计划/g, '性欲下降、勃起困难；没有乳溢，近期没有明确生育计划')
        .replace(/近半年月经不规律/g, '近半年性功能或生育方面无明显变化')
        .replace(/月经不规律/g, '性功能或生育方面无明显变化')
        .replace(/月经紊乱/g, '性功能或生育方面无明显变化');
      if (/末次月经|月经|阴道|孕周|哺乳/.test(copy.question + ' ' + copy.answer)) return null;
    } else {
      copy.question = String(copy.question || '').replace(/、勃起/g, '').replace(/勃起、/g, '').replace(/勃起或/g, '性功能或');
    }
    return copy;
  }
  function ctaHistoryItems() { return (template.history || []).map(ctaPatientHistoryItem).filter(Boolean); }
  function ctaPatientSymptomItem(item) {
    if (state.person.sex === '男' && item.id === 'vaginal-bleeding') return null;
    var copy = Object.assign({}, item);
    if (state.person.sex === '男' && item.id === 'obesity') copy.question = '体重和腰围近年如何变化？是否有打鼾、白天嗜睡或运动耐量下降？';
    return copy;
  }
  function ctaSymptomItems() { return DIAGNOSTIC_SYMPTOM_BANK.map(ctaPatientSymptomItem).filter(Boolean); }
  function ctaStationForPhase(phase) {
    if (phase === 'history' || phase === 'impression' || phase === 'exams') return 1;
    if (phase === 'workup' || phase === 'diagnosis') return 2;
    return 3;
  }
  function ctaStationLabel(station) {
    return station === 1 ? '第一考站 · 资料收集站' : station === 2 ? '第二考站 · 资料分析站' : '第三考站 · 诊疗决策站';
  }
  function ctaStationHtml() {
    var it = state.interview;
    var current = ctaStationForPhase(it.phase);
    it.station = current;
    var labels = [1, 2, 3].map(function (station) {
      var done = !!(it.stationSubmitted && it.stationSubmitted[['one', 'two', 'three'][station - 1]]);
      var active = current === station;
      return '<div class="sim-cta-station ' + (active ? 'active ' : '') + (done ? 'done' : '') + '"><span class="sim-cta-station-num">' + (done ? '✓' : station) + '</span><div><b>' + esc(ctaStationLabel(station)) + '</b><small>' + (station === 1 ? '问诊与查体' : station === 2 ? '检查、报告与鉴别' : '诊断、医嘱与复评') + '</small></div></div>';
    }).join('<span class="sim-cta-station-line" aria-hidden="true"></span>');
    return '<div class="sim-cta-stations" aria-label="三站训练进度">' + labels + '</div><div class="sim-cta-integrated-note"><b>同一患者连续推进：</b>前一站获得的资料会自动带入下一站；提交后不能返回修改，但始终可以只读查看。</div>';
  }
  function ctaPhaseSteps() {
    return [
      ['history', '病史采集', 1],
      ['impression', '初步印象', 1],
      ['exams', '体格检查', 1],
      ['workup', '辅助检查', 2],
      ['diagnosis', '诊断与鉴别', 2],
      ['plan', '诊疗决策', 3],
      ['reassessment', '病程复评', 3],
      ['discharge', '出院核对', 3]
    ];
  }
  function ctaPhaseIndex(phase) {
    return Math.max(0, ctaPhaseSteps().findIndex(function (item) { return item[0] === phase; }));
  }
  function ctaOperationCount() {
    var it = state.interview;
    return (it.identityConfirmed ? 1 : 0) + (it.askedHistory || []).length + (it.freeQuestions || []).length + (it.selectedExams || []).length + (it.selectedTests || []).length + (it.reviewedTests || []).length + (it.selectedMeds || []).length + (it.selectedOrders || []).length;
  }
  function ctaOperationLimit(station) { return station === 1 ? 100 : station === 2 ? 25 : 20; }
  function ctaToolbarHtml(phase) {
    var current = ctaPhaseIndex(phase);
    return '<nav class="sim-cta-toolbar" aria-label="CTA考站步骤">' + ctaPhaseSteps().map(function (item, index) {
      var status = index < current ? 'done' : index === current ? 'active' : 'locked';
      return '<span class="sim-cta-tool ' + status + '"><span>' + (index < current ? '✓' : index + 1) + '</span><b>' + esc(item[1]) + '</b></span>';
    }).join('') + '</nav>';
  }
  function ctaExamShellHtml(body, phase, phaseTitle, phaseNote) {
    var station = ctaStationForPhase(phase);
    var used = ctaOperationCount();
    var limit = ctaOperationLimit(station);
    var it = state.interview;
    return '<div class="sim-cta-exam-shell">' +
      '<header class="sim-cta-exam-head"><div><span class="sim-cta-brand">CTA 病例考核</span><b>' + esc(ctaStationLabel(station)) + '</b></div><div class="sim-cta-exam-meta"><span>' + esc(ctaSettingLabel()) + '</span>' + (it.setting === 'inpatient' ? '<span>第' + it.day + '天</span>' : '') + '<span>操作 ' + used + '/' + limit + '</span></div></header>' +
      ctaToolbarHtml(phase) + ctaStationHtml() +
      '<div class="sim-cta-exam-grid"><aside class="sim-cta-instruction"><span class="sim-kicker">操作说明</span><h4>' + esc(phaseTitle) + '</h4><p>' + esc(phaseNote) + '</p><dl><div><dt>当前考站</dt><dd>' + station + '/3</dd></div><div><dt>累计操作</dt><dd>' + used + '</dd></div><div><dt>本站上限</dt><dd>' + limit + '</dd></div></dl><p class="sim-muted">提交考站后不能返回修改；后续站点仍可只读查看已获得资料。</p></aside><main class="sim-cta-workspace">' + body + '</main></div>' +
      '<footer class="sim-cta-exam-foot"><span>资料将随患者连续带入下一站</span><b>仅供指南学习与考核训练，不用于真实临床决策</b></footer></div>';
  }
  function ctaWelcomeHtml() {
    var it = state.interview;
    var stationCards = [
      ['第一考站', '资料收集站', '问诊、初步印象与针对性查体', '20分钟', 'active'],
      ['第二考站', '资料分析站', '开立检查、查看报告、诊断与鉴别', '20分钟', 'locked'],
      ['第三考站', '诊疗决策站', '治疗、医嘱、监测、宣教与复评', '20分钟', 'locked']
    ].map(function (item, index) {
      return '<article class="sim-cta-entry-card ' + item[4] + '"><div><span class="sim-cta-entry-num">' + (index + 1) + '</span><div><small>' + item[0] + '</small><h4>' + item[1] + '</h4></div></div><p>' + item[2] + '</p><span class="sim-cta-entry-time">' + item[3] + '</span><b>' + (index === 0 ? '可进入' : '完成前站后开放') + '</b></article>';
    }).join('');
    return '<div class="sim-cta-welcome sim-cta-entry"><header class="sim-cta-entry-head"><span>CTA 病例考核</span><h3>考站快捷入口</h3><p>模拟真实考核：从同一患者依次完成三个考站，提交后不可回退。</p></header><div class="sim-cta-entry-grid">' + stationCards + '</div><div class="sim-patient-card sim-cta-stem"><span class="sim-pill">本次虚构病例题干</span><h3>' + esc(state.person.age + ' 岁 · ' + state.person.sex + ' · ' + state.person.job) + '</h3><p><b>主诉：</b>' + esc(state.person.complaint) + '</p><p class="sim-quote">“' + esc(mood.opening) + '”</p><label class="sim-cta-select"><b>训练场景</b><select data-cta-setting><option value="outpatient"' + (it.setting === 'outpatient' ? ' selected' : '') + '>门诊：首诊/复诊</option><option value="inpatient"' + (it.setting === 'inpatient' ? ' selected' : '') + '>住院：入院/病程/复评</option></select></label></div><div class="sim-actions sim-cta-entry-actions"><button class="primary" type="button" data-sim-action="cta-start">进入第一考站</button><button class="sim-secondary" type="button" data-sim-action="new">换一位患者</button></div><p class="sim-muted">视频中的第四考站和二维码不纳入本网站；本站将前三考站合并为完整就诊训练。</p></div>';
  }
  function ctaTestStatus(id) {
    return (state.interview.testStatus || {})[id] || 'available';
  }
  function ctaReportsReady() {
    return (state.interview.selectedTests || []).some(function (id) { return ctaTestStatus(id) === 'reported'; });
  }
  function ctaReportHtml(item) {
    var status = ctaTestStatus(item.id);
    if (status !== 'reported') return '<article class="sim-detail sim-report-pending"><div class="sim-report-head"><span class="sim-stage">待执行</span><b>' + esc(item.name) + '</b></div><p>检查已开立，点击“执行并返回报告”后才能看到结果。</p></article>';
    var reviewed = (state.interview.reviewedTests || []).includes(item.id);
    return '<article class="sim-detail sim-report-card ' + (item.redFlag ? 'sim-report-critical' : '') + '"><div class="sim-report-head"><div><span class="sim-stage">检查结果已返回</span><h4>' + esc(item.name) + '</h4></div><span class="sim-report-status">' + (reviewed ? '已阅' : '待阅') + '</span></div><details class="sim-report-sheet"' + (reviewed ? ' open' : '') + '><summary>打开检查报告</summary><div class="sim-report-paper"><div class="sim-report-paper-title"><span>检查报告</span><b>' + esc(item.name) + '</b></div><div class="sim-report-meta"><span>患者：' + esc(state.person.age + '岁 · ' + state.person.sex) + '</span><span>场景：' + esc(ctaSettingLabel()) + '</span><span>报告日：第' + esc(state.interview.day) + '天</span><span>状态：教学用预设报告</span></div><div class="sim-report-table"><div class="sim-report-row sim-report-head-row"><b>项目/所见</b><b>结果/报告</b><b>参考信息</b></div><div class="sim-report-row sim-report-data-row"><span><i>项目/所见</i><strong>' + esc(ctaResultLabel(item)) + '</strong></span><span><i>结果/报告</i><strong>' + esc(item.result) + '</strong></span><span><i>参考信息</i><strong>' + esc(ctaReferenceRange(item)) + '</strong></span></div></div><div class="sim-report-extra"><div><b>检查目的</b><p>' + esc(item.why || '用于确认诊断、评估严重程度或排除关键鉴别诊断。') + '</p></div><div><b>结果解释</b><p>' + esc(item.interpretation || '将结果与症状、查体、参考区间和其他检查整合，不把报告单独当作诊断。') + '</p></div></div><p class="sim-report-note">先独立记录结果、参考信息和临床意义；报告单不直接给出诊断结论。提交后再查看指南解析。</p></div></details><button class="sim-link" type="button" data-sim-action="cta-review-test" data-sim-id="' + esc(item.id) + '">' + (reviewed ? '已完成阅报告' : '阅后标记为已阅') + '</button></article>';
  }
  function ctaTestCatalogHtml() {
    var groups = {};
    (template.tests || []).forEach(function (item) { var key = item.stage || '按当前问题选择'; if (!groups[key]) groups[key] = []; groups[key].push(item); });
    return Object.keys(groups).map(function (group) {
      return '<section class="sim-test-group"><h4>' + esc(group) + '</h4><div class="sim-choice-list">' + groups[group].map(function (item) { var status = ctaTestStatus(item.id); var action = status === 'ordered' ? 'cta-execute-test' : status === 'reported' ? 'cta-review-test' : 'cta-test'; var label = status === 'ordered' ? '已开立，执行并返回报告' : status === 'reported' ? ((state.interview.reviewedTests || []).includes(item.id) ? '报告已阅' : '报告可用，标记已阅') : '加入待开检查'; return ctaChoiceButton(action, item.id, item.name, status !== 'available', label); }).join('') + '</div></section>';
    }).join('');
  }
  function ctaEvidenceFacts() {
    var facts = [];
    (state.interview.askedHistory || []).forEach(function (id) { var item = ctaHistoryItems().find(function (x) { return x.id === id; }); if (item) facts.push({ id: 'history:' + id, label: '病史：' + item.question, value: item.answer }); });
    (state.interview.selectedExams || []).forEach(function (id) { var item = template.exams.find(function (x) { return x.id === id; }); if (item) facts.push({ id: 'exam:' + id, label: '查体：' + item.label, value: item.result }); });
    (state.interview.selectedTests || []).forEach(function (id) { var item = template.tests.find(function (x) { return x.id === id; }); if (item && ctaTestStatus(id) === 'reported') facts.push({ id: 'test:' + id, label: '报告：' + item.name, value: item.result }); });
    return facts;
  }
  function ctaEvidenceHtml() {
    var facts = ctaEvidenceFacts();
    if (!facts.length) return '<div class="sim-notice"><b>证据矩阵暂未开放：</b>先完成查体并获得至少一份报告。</div>';
    var decision = template.decisions.find(function (x) { return x.id === state.interview.finalDecision; }) || template.decisions[0];
    if (!decision) return '';
    var selected = state.interview.evidence[decision.id] || {};
    return '<div class="sim-evidence-matrix"><h4>诊断依据矩阵：' + esc(decision.label) + '</h4><p class="sim-muted">把已获得的资料标记为支持、反对或暂不判断。作答时不显示指南解析，提交后才评分。</p><div class="sim-evidence-head"><span>已获得资料</span><span>支持</span><span>反对</span><span>不判断</span></div>' + facts.map(function (fact) { var value = selected[fact.id] || 'unknown'; return '<div class="sim-evidence-row"><div><b>' + esc(fact.label) + '</b><small>' + esc(fact.value) + '</small></div><button type="button" class="sim-evidence-btn ' + (value === 'support' ? 'active' : '') + '" data-sim-action="cta-evidence" data-sim-id="' + esc(fact.id) + '" data-sim-evidence="support" aria-label="标记为支持">支持</button><button type="button" class="sim-evidence-btn ' + (value === 'against' ? 'active' : '') + '" data-sim-action="cta-evidence" data-sim-id="' + esc(fact.id) + '" data-sim-evidence="against" aria-label="标记为反对">反对</button><button type="button" class="sim-evidence-btn ' + (value === 'unknown' ? 'active' : '') + '" data-sim-action="cta-evidence" data-sim-id="' + esc(fact.id) + '" data-sim-evidence="unknown" aria-label="标记为不判断">—</button></div>'; }).join('') + '</div>';
  }
  function ctaOrderOptionsHtml() {
    var options = [
      ['monitor', '生命体征、出入量及相关指标监测'],
      ['repeat', '按本病路径安排复查和趋势记录'],
      ['education', '给出药物、饮食、危险信号和随访教育'],
      ['consult', '必要时申请相关专科或多学科会诊'],
      ['safety', '记录知情沟通、拒绝风险和升级条件']
    ];
    var selected = state.interview.selectedOrders || [];
    return '<div class="sim-order-set"><h4>非药物医嘱与安全计划</h4><p class="sim-muted">这些是医嘱类别训练项，具体项目仍需结合本例、指南和医院制度；不自动等同于真实医嘱。</p><div class="sim-choice-list">' + options.map(function (item) { return ctaChoiceButton('cta-order', item[0], item[1], selected.includes(item[0]), '治疗计划的一部分'); }).join('') + '</div></div>';
  }
  function ctaGroup(item) {
    var id = String(item.id || '');
    if (item.redFlag || /crisis|red|fluid|airway|episode|acute/i.test(id)) return '危险信号与严重程度';
    if (/med|insulin|sglt2|drug|adherence/i.test(id)) return '用药、依从性与不良反应';
    if (/preg|menses|fert|sexual/i.test(id)) return '婚育、月经与妊娠可能';
    if (/family|hered|kidney|heart|comorb/i.test(id)) return '既往史、共病与家族史';
    return '主诉、时间线与伴随症状';
  }
  function ctaQuestionOptions() {
    return ctaHistoryItems().filter(function (item) { return !state.interview.askedHistory.includes(item.id); });
  }
  function ctaKnownFactsHtml() {
    var complaints = (template.complaints || []).filter(function (item) { return item && item !== state.person.complaint; });
    return '<div class="sim-review-block sim-cta-known-data"><h4>问诊前已知病例资料（仅展示本例已设定部分）</h4>' +
      '<p><b>病例主线：</b>' + esc(ctaPatientIntro() || '病例摘要由本次训练题干给出，请从主诉和主动问诊开始。') + '</p>' +
      '<p><b>本次主诉：</b>' + esc(state.person.complaint || '主诉由本次虚构患者固定生成，请先核对患者自述。') + '</p>' +
      '<p><b>题干公开的时间线：</b>' + esc(timelineInfo()) + '</p>' +
      (complaints.length ? '<p><b>本病例其他预设就诊切入点（不等于本次患者已陈述）：</b>' + esc(complaints.join('；')) + '</p>' : '') +
      '<p class="sim-muted"><b>仍需主动追问：</b>起病方式和完整时间线、伴随症状与阴性危险信号、既往史/手术史、用药与过敏、个人与家族史、婚育/月经史（适用时）、系统回顾及照护/依从性。本病例已为这些常用项目准备固定患者回答；未点击的问题不会计入你的问诊记录。</p>' +
      '<p class="sim-cta-boundary"><b>严格学习边界：</b>年龄、职业、情绪和部分背景为随机训练变量；病例主线、已标注检查结果和指南路径固定。全部内容仅供学习，严禁用于真实患者评估、处方或临床决策。</p></div>';
  }
  function ctaMedicationOptions() { return (window.SIM_CASE_MEDICATIONS || {})[template.id] || []; }
  function ctaMedicationUnsafe(ref) { return /停用|避免|暂不|不自动|不适用|避免套用/.test(String(ref.type || '') + String(ref.name || '')); }
  function ctaReferenceRange(item) {
    if (item && item.normalRange) return item.normalRange;
    var text = String((item && item.name) || '') + ' ' + String((item && item.result) || '');
    var normalized = text.replace(/[\s（）()]/g, '');
    var ranges = [];
    (window.ABNORMAL_WORKUPS || []).forEach(function (workup) {
      Object.keys(workup.reference || {}).forEach(function (key) {
        if (normalized.includes(String(key).replace(/[\s（）()]/g, ''))) ranges.push(String(workup.reference[key][0] || ''));
      });
    });
    ranges = ranges.filter(function (value, index) { return value && ranges.indexOf(value) === index; });
    if (ranges.length) return ranges.join('；');
    if (/MRI|CT|超声|彩超|影像|视野|X线|胸片/.test(text)) return '影像/功能检查无统一单一数值参考范围；以影像科或检查报告单的正常描述、年龄和检查方法为准。';
    return '本题所挂指南资料未给出统一参考范围；以所在实验室报告单参考区间为准，不自行套用其他实验室区间。';
  }
  function ctaResultLabel(item) { return /MRI|CT|超声|彩超|影像|视野|X线|胸片/.test(String((item && item.name) || '') + String((item && item.label) || '')) ? '常见文字影像/功能报告' : '模拟辅助检查结果'; }
  function ctaMedicationButton(ref, selected) {
    var meds = window.ENDO_MEDICATIONS || [];
    var med = meds.find(function (item) { return item.name === ref.name || item.name.includes(ref.name) || ref.name.includes(item.name); });
    var safety = med && typeof window.ENDO_MEDICATION_SAFETY_FOR === 'function' ? window.ENDO_MEDICATION_SAFETY_FOR(med) : null;
    var tooltip = med ? '<span class="sim-med-tooltip" role="note"><b>' + esc(med.name) + ' · 通用药物卡</b><span><strong>适用患者：</strong>' + esc(med.patients || '本网站未单列；核对正式说明书。') + '</span><span><strong>作用/用法剂量：</strong>' + esc(med.dose || '本网站未单列统一剂量；核对正式说明书。') + '</span><span><strong>禁忌：</strong>' + esc(safety && safety.contra || '本网站未单列统一禁忌；核对正式说明书。') + '</span><span><strong>慎用/调整：</strong>' + esc(safety && safety.caution || med.adjust || '按肝肾功能、相互作用和患者情况复核。') + '</span><span><strong>监测：</strong>' + esc(med.monitor || '按药品说明书和指南监测。') + '</span><span class="sim-muted">这些是药物通用资料，不代表本病例正确答案；本病例级对错在提交后显示。</span></span>' : '<span class="sim-med-tooltip" role="note"><b>药物通用资料</b><span>本例未匹配到独立药物卡；请打开药物与剂量分栏核对，不能自行补写剂量。</span></span>';
    return '<button type="button" class="sim-choice sim-med-choice ' + (selected ? 'is-selected' : '') + '" data-sim-action="cta-med" data-sim-id="' + esc(ref.name) + '" title="悬停或聚焦查看通用药物卡，不显示本例对错"><span class="sim-choice-index">' + (selected ? '✓' : '•') + '</span><span><b>' + esc(ref.name) + '</b><small>悬停/触碰查看作用、适应证、禁忌和监测</small>' + tooltip + '</span></button>';
  }
  function ctaAdvanceDay() {
    var it = state.interview;
    if (!it.activeOrders.length) it.activeOrders = it.selectedMeds.slice();
    var score = ctaScore();
    var selectedDecision = template.decisions.find(function (x) { return x.id === it.finalDecision; });
    var unsafe = (score.unsafeSelected || []).length > 0;
    var hasReports = ctaReportsReady();
    var planWritten = String(it.text.plan || '').trim().length >= 20;
    // 病情分支由“关键决策是否正确、是否执行报告、是否写出监测计划”决定；
    // 不再用与治疗无关的纯随机数决定好转或恶化。
    var status = unsafe || !selectedDecision || !selectedDecision.correct ? 'worse' : !hasReports || !planWritten ? 'same' : 'better';
    var day = it.day + 1;
    var event = status === 'worse' ? { status: 'worse', title: '病情恶化：需要立即重新评估', detail: '第' + day + '天，教学分支提示关键安全节点未满足或出现不安全选择。请先重新核对生命体征、意识、容量和本病危险信号，必要时升级监护、急诊或专科会诊；不能机械等待下一天。' } : status === 'same' ? { status: 'same', title: '病情变化不明显：继续寻找未解决问题', detail: '第' + day + '天，教学分支提示检查报告或监测计划尚不完整。请重新评估依从性、诱因、报告趋势和治疗安全性，再决定是否继续当前计划。' } : { status: 'better', title: '病情好转：进入出院条件评估', detail: '第' + day + '天，教学分支提示关键诊断、报告和监测计划已覆盖。这不等于自动出院；仍需确认危险信号消失、客观指标趋势、进食/活动和随访可执行性。' };
    it.day = day;
    it.currentEvent = event;
    it.progression.push({ day: day, status: status, title: event.title, detail: event.detail });
    it.reassessmentExams = [];
    it.reassessmentTests = [];
    it.dischargeSuggested = status === 'better' && score.ratio >= 70 && score.selectedDecision && score.selectedDecision.correct;
    it.phase = 'reassessment';
  }
  function ctaProgressionHtml() {
    var it = state.interview;
    if (!it.progression || !it.progression.length) return '<p class="sim-muted">尚未推进到下一天；住院场景可在治疗方案后点击“进入下一天”。</p>';
    return it.progression.map(function (event) { return '<article class="sim-cta-day ' + esc(event.status) + '"><div><span class="sim-stage">第' + event.day + '天</span><b>' + esc(event.title) + '</b></div><p>' + esc(event.detail) + '</p></article>'; }).join('');
  }
  function ctaScore() {
    var it = state.interview;
    var identityEarned = it.identityConfirmed ? 1 : 0;
    var identityMax = 1;
    var patientHistory = ctaHistoryItems();
    var criticalHistory = patientHistory.filter(function (x) { return x.redFlag || x.essential || x.id === 'symptoms' || x.id === 'insulin' || x.id === 'crisis'; });
    var optionalHistory = patientHistory.filter(function (x) { return !criticalHistory.includes(x); });
    var histEarned = criticalHistory.reduce(function (n, x) { return n + (it.askedHistory.includes(x.id) ? 2 : 0); }, 0) + optionalHistory.reduce(function (n, x) { return n + (it.askedHistory.includes(x.id) ? 1 : 0); }, 0);
    var histMax = criticalHistory.length * 2 + optionalHistory.length;
    var criticalExams = template.exams.filter(function (x) { return x.redFlag || x.essential; });
    var optionalExams = template.exams.filter(function (x) { return !criticalExams.includes(x); });
    var examEarned = criticalExams.reduce(function (n, x) { return n + (it.selectedExams.includes(x.id) ? 2 : 0); }, 0) + optionalExams.reduce(function (n, x) { return n + (it.selectedExams.includes(x.id) ? 1 : 0); }, 0);
    var examMax = criticalExams.length * 2 + optionalExams.length;
    var criticalTests = template.tests.filter(function (x) { return x.redFlag || x.essential; });
    var optionalTests = template.tests.filter(function (x) { return !criticalTests.includes(x); });
    var testEarned = criticalTests.reduce(function (n, x) { return n + (ctaTestStatus(x.id) === 'reported' && it.reviewedTests.includes(x.id) ? 2 : 0); }, 0) + optionalTests.reduce(function (n, x) { return n + (ctaTestStatus(x.id) === 'reported' && it.reviewedTests.includes(x.id) ? 1 : 0); }, 0);
    var testMax = criticalTests.length * 2 + optionalTests.length;
    var selectedDecision = template.decisions.find(function (x) { return x.id === it.finalDecision; });
    var decisionEarned = selectedDecision && selectedDecision.correct ? 2 : 0;
    var textEarned = ['impression', 'diagnosis', 'plan'].reduce(function (n, key) { return n + (String(it.text[key] || '').trim().length >= 12 ? 1 : 0); }, 0);
    var refs = ctaMedicationOptions();
    var medMax = refs.length ? 2 : 0;
    var selectedRefs = refs.filter(function (x) { return it.selectedMeds.includes(x.name); });
    var unsafeSelected = selectedRefs.filter(ctaMedicationUnsafe);
    var medEarned = refs.length && selectedRefs.length && !unsafeSelected.length ? 2 : 0;
    var max = identityMax + histMax + examMax + testMax + 2 + 3 + medMax;
    var earned = identityEarned + histEarned + examEarned + testEarned + decisionEarned + textEarned + medEarned;
    return { ratio: Math.round(earned / Math.max(max, 1) * 100), earned: earned, max: max, identityEarned: identityEarned, identityMax: identityMax, criticalHistory: criticalHistory, optionalHistory: optionalHistory, criticalExams: criticalExams, optionalExams: optionalExams, criticalTests: criticalTests, optionalTests: optionalTests, selectedDecision: selectedDecision, selectedRefs: selectedRefs, unsafeSelected: unsafeSelected, medMax: medMax, medEarned: medEarned, histEarned: histEarned, histMax: histMax, examEarned: examEarned, examMax: examMax, testEarned: testEarned, testMax: testMax, decisionEarned: decisionEarned, textEarned: textEarned };
  }
  function ctaChoiceButton(action, id, label, selected, note) {
    return '<button type="button" class="sim-choice ' + (selected ? 'is-selected' : '') + '" data-sim-action="' + action + '" data-sim-id="' + esc(id) + '"><span class="sim-choice-index">' + (selected ? '✓' : '•') + '</span><span><b>' + esc(label) + '</b>' + (note ? '<small>' + esc(note) + '</small>' : '') + '</span></button>';
  }
  function ctaHistoryMatchByKeywords(item) {
    if (!item || !item.keywords) return null;
    var hay = String(item.question || '') + ' ' + String(item.answer || '');
    return ctaHistoryItems().find(function (historyItem) {
      var source = String(historyItem.question || '') + ' ' + String(historyItem.answer || '');
      return item.keywords.some(function (keyword) { return keyword.length >= 2 && source.includes(keyword); }) || hay.includes(String(historyItem.id || ''));
    }) || null;
  }
  function ctaSymptomAsked(item) {
    return (state.interview.freeQuestions || []).some(function (entry) { return entry.symptomId === item.id || entry.question === item.question; });
  }
  function ctaSymptomQuickHtml() {
    return '<details class="sim-cta-quick-panel"><summary>按《诊断学》常见症状目录选择问法</summary><p class="sim-muted">快捷项来自《诊断学（第10版）》常见症状目录（发热至情感症状）。系统会按当前病例性别隐藏不适用项目；每个症状只能主动询问一次。训练回答不等于真实患者资料，不能外推到临床。</p><div class="sim-cta-question-list">' + ctaSymptomItems().map(function (item) { var asked = ctaSymptomAsked(item); return '<button type="button" class="sim-choice' + (asked ? ' is-selected' : '') + '" data-sim-action="cta-symptom-question" data-sim-id="' + esc(item.id) + '"' + (asked ? ' disabled aria-disabled="true"' : '') + '><span class="sim-choice-index">' + (asked ? '已' : '？') + '</span><span><b>' + esc(item.label) + '</b><small>' + esc(item.question) + (asked ? ' · 本次已问过，不能重复' : '') + '</small></span></button>'; }).join('') + '</div></details>';
  }
  function ctaQuickTestHtml() {
    var tests = template.tests || [];
    if (!tests.length) return '';
    return '<details class="sim-cta-quick-panel"><summary>本病例可快捷开立的检查</summary><p class="sim-muted">只列本病例已有指南路径和预设结果的检查；点击后只是加入待开列表，需在第二考站执行后才能查看文字报告。影像检查只显示文字报告，不生成图片。</p><div class="sim-cta-question-list">' + tests.map(function (item) { var status = ctaTestStatus(item.id); return '<button type="button" class="sim-choice" data-sim-action="cta-quick-test" data-sim-id="' + esc(item.id) + '"' + (status !== 'available' ? ' disabled aria-disabled="true"' : '') + '><span class="sim-choice-index">' + (status === 'reported' ? '✓' : '检') + '</span><span><b>' + esc(item.name) + '</b><small>' + (status === 'ordered' ? '已加入待开列表' : status === 'reported' ? '已在报告站获得结果' : esc(item.stage || '按当前问题选择')) + '</small></span></button>'; }).join('') + '</div></details>';
  }
  function ctaQuickResultsHtml() {
    var tests = (template.tests || []).filter(function (item) { return (state.interview.selectedTests || []).includes(item.id); });
    if (!tests.length) return '';
    return '<div class="sim-cta-results sim-cta-quick-results"><h4>本次检查状态</h4>' + tests.map(ctaReportHtml).join('') + '</div>';
  }
  function decorateCtaHistory() {
    if (!state.interview || !state.interview.started || state.interview.submitted || state.interview.phase !== 'history') return;
    var body = root.querySelector('.sim-body');
    var anchor = body && body.querySelector('.sim-free-question');
    if (!anchor || body.querySelector('.sim-cta-symptom-bank')) return;
    var panel = document.createElement('div');
    panel.className = 'sim-cta-symptom-bank';
    panel.innerHTML = ctaKnownFactsHtml() + ctaSymptomQuickHtml() + ctaQuickTestHtml() + ctaQuickResultsHtml();
    anchor.parentNode.insertBefore(panel, anchor);
  }
  function decorateCtaScrollHint() {
    if (!state.interview || !state.interview.started || state.interview.submitted || state.interview.phase !== 'history') return;
    var pane = root.querySelector('.sim-cta-console-pane');
    var transcript = pane && pane.querySelector('.sim-cta-transcript');
    if (!transcript || pane.querySelector('.sim-cta-scroll-hint')) return;
    transcript.insertAdjacentHTML('beforebegin', '<p class="sim-muted sim-cta-scroll-hint">右侧患者回答区可用鼠标滚轮或拖动滚动条；点击左侧问题后会保留当前阅读位置。</p>');
  }
  function ctaTranscript() {
    var it = state.interview;
    if (!state.interview.identityConfirmed && !state.interview.askedHistory.length && !(state.interview.freeQuestions || []).length) return '<p class="sim-muted">患者还没有回答任何问题。请先完成身份核对，再选择一个你想主动询问的问题。</p>';
    var identity = it.identityConfirmed ? '<article class="sim-cta-turn sim-identity-turn"><span class="sim-stage">第 0 步 · 身份核对</span><b>你问：</b>' + esc(ctaIdentityQuestion()) + '<p><b>患者答：</b>' + esc(ctaIdentityAnswer()) + '</p></article>' : '';
    var history = state.interview.askedHistory.map(function (id, index) {
      var item = ctaHistoryItems().find(function (x) { return x.id === id; });
      return item ? '<article class="sim-cta-turn"><span class="sim-stage">第' + (index + 1) + '问 · ' + esc(ctaGroup(item)) + '</span><b>你问：</b>' + esc(item.question) + '<p><b>患者答：</b>' + esc(item.answer) + '</p></article>' : '';
    }).join('');
    var free = (state.interview.freeQuestions || []).map(function (item) {
      return '<article class="sim-cta-turn sim-cta-free-turn"><span class="sim-stage">自由提问</span><b>你问：</b>' + esc(item.question) + '<p><b>患者答：</b>' + esc(item.answer) + '</p></article>';
    }).join('');
    return identity + history + free;
  }
  function ctaReview() {
    var score = ctaScore(), it = state.interview;
    var status = function (ok, critical) { return ok ? '<span class="sim-cta-status good">已覆盖</span>' : critical ? '<span class="sim-cta-status error">严重漏项</span>' : '<span class="sim-cta-status warn">建议补充</span>'; };
    var historyRows = ctaHistoryItems().map(function (item) { var asked = it.askedHistory.includes(item.id); var critical = score.criticalHistory.includes(item); return '<article class="sim-cta-review-row ' + (asked ? 'good' : critical ? 'error' : 'warn') + '"><div>' + status(asked, critical) + '<b>' + esc(ctaGroup(item)) + '</b><p><b>应问：</b>' + esc(item.question) + '</p>' + (asked ? '<p><b>患者回答：</b>' + esc(item.answer) + '</p>' : '<p class="sim-cta-error-text">本次未问到；患者回答已预设，但不会自动计入你的问诊记录。</p>') + '<p><b>为什么：</b>' + esc(item.why || '本病例已设定该问题的学习意义；请结合对应指南和当前危险程度复核。') + '</p></div></article>'; }).join('');
    var examRows = template.exams.map(function (item) { var selected = it.selectedExams.includes(item.id); var critical = score.criticalExams.includes(item); return '<article class="sim-cta-review-row ' + (selected ? 'good' : critical ? 'error' : 'warn') + '"><div>' + status(selected, critical) + '<b>查体：' + esc(item.label) + '</b><p><b>' + ctaResultLabel(item) + '：</b>' + esc(item.result) + '</p><p><b>正常范围/参考区间：</b>' + esc(ctaReferenceRange(item)) + '</p><p><b>临床意义：</b>' + esc(item.meaning || '本病例已设定查体意义；请回到对应指南路径核对。') + '</p></div></article>'; }).join('');
    var testRows = template.tests.map(function (item) { var selected = ctaTestStatus(item.id) === 'reported'; var ordered = it.selectedTests.includes(item.id) && !selected; var critical = score.criticalTests.includes(item); return '<article class="sim-cta-review-row ' + (selected ? 'good' : critical ? 'error' : 'warn') + '"><div>' + status(selected, critical) + '<b>检查：' + esc(item.name) + '</b>' + (ordered ? '<p class="sim-cta-error-text">已开立但未执行，不能把待执行项目当作已获得结果。</p>' : '') + '<p><b>' + ctaResultLabel(item) + '：</b>' + esc(item.result) + '</p><p><b>正常范围/参考区间：</b>' + esc(ctaReferenceRange(item)) + '</p><p><b>如何解释：</b>' + esc(item.interpretation) + '</p><p><b>为什么选择：</b>' + esc(item.why || '本病例已设定该检查的学习意义；请回到指标追查路径核对。') + '</p>' + (item.workupId ? '<button class="sim-link" type="button" data-sim-link="workup:' + esc(item.workupId) + '">打开对应指标追查</button>' : '') + '</div></article>'; }).join('');
    var decisionRows = template.decisions.map(function (item) { var selected = item.id === it.finalDecision; return '<article class="sim-cta-review-row ' + (selected && item.correct ? 'good' : item.correct ? 'error' : selected ? 'error' : 'warn') + '"><div>' + status(selected && item.correct, item.correct) + '<b>' + esc(item.label) + '</b><p><b>指南理由：</b>' + esc(item.why) + '</p>' + linksHtml(item.links) + '</div></article>'; }).join('');
    var medRows = ctaMedicationOptions().map(function (ref) { var selected = it.selectedMeds.includes(ref.name); var unsafe = ctaMedicationUnsafe(ref); return '<article class="sim-cta-review-row ' + (selected && !unsafe ? 'good' : selected && unsafe ? 'error' : 'warn') + '"><div>' + status(selected && !unsafe, unsafe) + '<b>' + esc(ref.name) + '</b><p><b>本例作用：</b>' + esc(ref.role) + '</p><p><b>安全核对：</b>' + esc(ref.safety) + '</p><p class="sim-muted">依据：' + esc(ref.source) + '</p>' + (ref.medSearch ? '<button class="sim-link" type="button" data-sim-action="jump-med-name" data-sim-id="' + esc(ref.medSearch) + '">打开药物剂量卡</button>' : '') + '</div></article>'; }).join('');
    var selectedOrders = (it.selectedOrders || []).map(function (id) { return { monitor: '生命体征、出入量及相关指标监测', repeat: '按本病路径安排复查和趋势记录', education: '药物、饮食、危险信号和随访教育', consult: '必要时申请相关专科或多学科会诊', safety: '记录知情沟通、拒绝风险和升级条件' }[id] || id; });
    return '<div class="sim-review sim-cta-review"><div class="sim-review-head"><span class="sim-kicker">CTA 三站站后解析</span><h3>' + (score.ratio >= 80 ? '三站主线覆盖较完整' : '请按红色缺口重新训练') + '</h3><p>本次为' + esc(ctaSettingLabel()) + '；第一、第二、第三考站已合并为同一患者流程，解析只在提交后开放。</p><div class="sim-score"><b>' + score.ratio + '</b><span>/ 100 学习反馈分</span></div></div><div class="sim-score-grid"><div><b>资料收集</b><span>' + score.histEarned + '/' + score.histMax + '</span></div><div><b>查体</b><span>' + score.examEarned + '/' + score.examMax + '</span></div><div><b>检查报告</b><span>' + score.testEarned + '/' + score.testMax + '</span></div><div><b>诊断判断</b><span>' + score.decisionEarned + '/2</span></div><div><b>文字总结</b><span>' + score.textEarned + '/3</span></div><div><b>药物安全</b><span>' + (score.medMax ? score.medEarned + '/' + score.medMax : '未设候选') + '</span></div></div><div class="sim-review-block sim-cta-guide"><h4>三站连续回放</h4><p>第一考站：问诊与查体 → 第二考站：开立检查、执行、查看报告、建立证据 → 第三考站：最终诊断、治疗医嘱、监测、宣教和病程延伸。</p><p class="sim-muted">红色=患者安全错误或关键漏项；黄色=可补充项目；绿色=本次已覆盖。每条“为什么”均来自本例已标注的指南路径字段。</p></div><div class="sim-review-block"><h4>本次选择的非药物医嘱与安全计划</h4>' + (selectedOrders.length ? '<ul>' + selectedOrders.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p class="sim-muted">未选择非药物医嘱类别，请在第三考站补充监测、复查和宣教。</p>') + '</div><div class="sim-review-block"><h4>一、资料收集：问诊逐项解析</h4><div class="sim-cta-review-list">' + historyRows + '</div></div><div class="sim-review-block"><h4>二、资料收集：查体逐项解析</h4><div class="sim-cta-review-list">' + examRows + '</div></div><div class="sim-review-block"><h4>三、资料分析：辅助检查逐项解析</h4><div class="sim-cta-review-list">' + testRows + '</div></div><div class="sim-review-block"><h4>四、诊断/鉴别诊断与治疗决策解析</h4><div class="sim-cta-review-list">' + decisionRows + '</div>' + (medRows ? '<div class="sim-cta-review-list">' + medRows + '</div>' : '<p class="sim-muted">本例没有挂接药物候选卡；不要自行补写剂量，回到药物剂量卡按适应证和禁忌核对。</p>') + '</div><div class="sim-review-block"><h4>本例指南依据</h4><ul>' + template.source.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div><div class="sim-actions"><button class="primary" type="button" data-sim-action="cta-retry">保留本例，重新做一遍</button><button class="sim-secondary" type="button" data-sim-action="new">抽取新患者</button></div></div>';
  }
  function renderCta() {
    var it = state.interview;
    if (it.submitted) return ctaReview();
    if (!it.started) return ctaWelcomeHtml();
    var phase = it.phase;
    var station = ctaStationForPhase(phase);
    var phaseTitle = phase === 'history' && !it.identityConfirmed ? '资料收集：身份核对' : ({ history: '资料收集：主动问诊', impression: '资料收集：初步印象', exams: '资料收集：针对性查体', workup: '资料分析：开立检查与查看报告', diagnosis: '资料分析：诊断证据与鉴别诊断', plan: '诊疗决策：治疗方案与医嘱', reassessment: '诊疗决策：治疗后复评', discharge: '诊疗决策：出院评估与停医嘱' })[phase] || 'CTA 三站训练';
    var phaseNote = phase === 'history' && !it.identityConfirmed ? '先用患者称谓核对身份、年龄和就诊原因；确认后才能进入一问一答。' : ({ history: '患者只回答你点选的一个问题；不要把未问到的资料当成已知。', impression: '从当前已获得的信息提出初步印象和鉴别；完成第一站后单向进入资料分析。', exams: '只选择能回答当前问题的查体；选择后才显示客观结果。', workup: '先开立，再执行，报告返回后才能进行解释；结果不附带解析。', diagnosis: '从已获得的病史、查体和报告建立支持/反对证据；解析会在提交后开放。', plan: '选择药物、非药物医嘱、监测和宣教；可触碰查看通用药物卡，但病例级对错仍到提交后才显示。', reassessment: '住院场景：第' + it.day + '天治疗后重新选择需要复查的查体/检查，再决定是否继续调整。', discharge: '完成客观复评后进入出院核对；停医嘱需逐项确认，不能一键全部停止。' })[phase];
    var body = '<div class="sim-section-title"><div><span class="sim-kicker">' + esc(ctaStationLabel(station) + ' · ' + ctaSettingLabel()) + (it.setting === 'inpatient' ? ' · 第' + it.day + '天' : '') + '</span><h3>' + esc(phaseTitle) + '</h3><p class="sim-muted">' + esc(phaseNote) + '</p></div><span class="sim-stage">已问 ' + it.askedHistory.length + '/' + ctaHistoryItems().length + ' 项</span></div>';
    if (phase === 'history' && !it.identityConfirmed) {
      body += ctaIdentityHtml();
      return ctaExamShellHtml(body, phase, phaseTitle, phaseNote);
    }
    if (state.response && state.response.indexOf('CTA训练') < 0) body += '<div class="sim-feedback">' + esc(state.response) + '</div>';
    if (phase !== 'history' && phase !== 'impression' && phase !== 'exams') body += '<div class="sim-cta-transcript"><h4>已获得的有效问诊信息（只显示你主动问过的内容）</h4>' + ctaTranscript() + '</div>';
    if (phase === 'history') {
      var questions = ctaQuestionOptions();
      body += '<div class="sim-cta-split"><section class="sim-cta-pane sim-cta-selector-pane"><div class="sim-cta-pane-head"><span>问诊操作栏</span><b>选择下一句</b></div><p class="sim-muted">每个问题只能问一次；可按主诉、时间线、危险表现、用药、共病和婚育史逐项追问。</p><div class="sim-cta-question-list">' + (questions.length ? questions.map(function (item) { return ctaChoiceButton('cta-question', item.id, item.question, false, ctaGroup(item)); }).join('') : '<p class="sim-muted">本例预设问题已全部问过，可以进入初步印象。</p>') + '</div><div class="sim-free-question"><label><b>自由提问（仅匹配本例固定资料）</b><input type="text" data-cta-free-question placeholder="例如：有没有呕吐？最近一次用药是什么时候？"></label><button class="sim-secondary" type="button" data-sim-action="cta-free-question">搜索并询问</button></div></section><section class="sim-cta-pane sim-cta-console-pane"><div class="sim-cta-pane-head"><span>问诊结果</span><b>患者即时回答</b></div><div class="sim-cta-transcript">' + (ctaTranscript() || '<p class="sim-muted">尚未提问。选择左侧问题后，患者回答将在这里逐条出现。</p>') + '</div></section></div><div class="sim-actions sim-cta-sticky-actions"><button class="primary" type="button" data-sim-action="cta-impression">进入初步印象</button></div>';
    } else if (phase === 'impression') {
      body += '<div class="sim-cta-transcript"><h4>目前患者已回答</h4>' + ctaTranscript() + '</div><h4>选择你的初步判断（不显示对错）</h4><div class="sim-choice-list">' + template.decisions.map(function (item) { return ctaChoiceButton('cta-impression-choice', item.id, item.label, item.id === it.impressionDecision, '初步诊断/鉴别选项'); }).join('') + '</div><label class="sim-note-field"><b>初步印象与鉴别理由</b><small>写支持证据、尚不能排除的危险情况和下一步需要验证的内容。</small><textarea data-cta-text="impression" placeholder="先独立书写，不要等解析...">' + esc(it.text.impression || '') + '</textarea></label><div class="sim-actions"><button class="primary" type="button" data-sim-action="cta-exams">进入针对性查体</button></div>';
    } else if (phase === 'exams') {
      body += '<div class="sim-cta-transcript sim-cta-history-strip"><h4>已获得问诊记录</h4>' + ctaTranscript() + '</div><div class="sim-cta-split"><section class="sim-cta-pane sim-cta-selector-pane"><div class="sim-cta-pane-head"><span>体格检查</span><b>选择检查部位与项目</b></div><div class="sim-choice-list">' + template.exams.map(function (item) { return ctaChoiceButton('cta-exam', item.id, item.label, it.selectedExams.includes(item.id), it.selectedExams.includes(item.id) ? '已检查，本项不可重复' : '选择后在右侧显示结果'); }).join('') + '</div></section><section class="sim-cta-pane sim-cta-console-pane"><div class="sim-cta-pane-head"><span>检查结果</span><b>客观所见</b></div><div class="sim-cta-results">' + (template.exams.filter(function (item) { return it.selectedExams.includes(item.id); }).map(function (item) { return '<article class="sim-detail"><h4>' + esc(item.label) + '</h4><p><b>' + ctaResultLabel(item) + '：</b>' + esc(item.result) + '</p><p><b>参考信息：</b>' + esc(ctaReferenceRange(item)) + '</p></article>'; }).join('') || '<p class="sim-muted">尚未进行查体。选择左侧项目后，客观结果显示在这里。</p>') + '</div></section></div><div class="sim-actions sim-cta-sticky-actions"><button class="primary" type="button" data-sim-action="cta-workup">本站结束，进入第二考站</button></div>';
    } else if (phase === 'workup') {
      body += '<p class="sim-muted">严格按“开立 → 执行 → 打开报告 → 标记已阅”推进；未打开报告不能当作已掌握结果。</p><div class="sim-cta-split"><section class="sim-cta-pane sim-cta-selector-pane"><div class="sim-cta-pane-head"><span>检查栏</span><b>选择并执行检查</b></div>' + ctaTestCatalogHtml() + '</section><section class="sim-cta-pane sim-cta-console-pane"><div class="sim-cta-pane-head"><span>检查结果</span><b>已开立/已返回报告</b></div><div class="sim-cta-results">' + (template.tests.filter(function (item) { return it.selectedTests.includes(item.id); }).map(ctaReportHtml).join('') || '<p class="sim-muted">尚未开立检查。左侧选择后需再次执行，报告才会返回。</p>') + '</div></section></div><div class="sim-actions sim-cta-sticky-actions"><button class="primary" type="button" data-sim-action="cta-diagnosis">进入诊断与鉴别</button></div>';
    } else if (phase === 'diagnosis') {
      body += '<div class="sim-cta-split"><section class="sim-cta-pane sim-cta-selector-pane"><div class="sim-cta-pane-head"><span>诊断病种</span><b>选择最终诊断/下一步判断</b></div><div class="sim-choice-list">' + template.decisions.map(function (item) { return ctaChoiceButton('cta-final-choice', item.id, item.label, item.id === it.finalDecision, '加入诊断清单'); }).join('') + '</div></section><section class="sim-cta-pane sim-cta-console-pane"><div class="sim-cta-pane-head"><span>已添加诊断</span><b>' + esc((template.decisions.find(function (item) { return item.id === it.finalDecision; }) || {}).label || '尚未选择') + '</b></div>' + ctaEvidenceHtml() + '<label class="sim-note-field"><b>最终诊断与鉴别诊断理由</b><small>写支持证据、反对证据、仍需排除的危险情况和选择本方案的原因。</small><textarea data-cta-text="diagnosis" placeholder="先独立书写，不要等解析...">' + esc(it.text.diagnosis || '') + '</textarea></label></section></div><div class="sim-actions sim-cta-sticky-actions"><button class="primary" type="button" data-sim-action="cta-plan">本站结束，进入第三考站</button></div>';
    } else if (phase === 'plan') {
      var refs = ctaMedicationOptions();
      body += '<p class="sim-muted">先把治疗、监测和宣教加入方案，再统一提交。悬停或触碰药物可查看通用药物卡，但不会提前显示病例级对错。</p><div class="sim-cta-split"><section class="sim-cta-pane sim-cta-selector-pane"><div class="sim-cta-pane-head"><span>治疗方案</span><b>药物与处置方向</b></div><div class="sim-choice-list">' + (refs.length ? refs.map(function (ref) { return ctaMedicationButton(ref, it.selectedMeds.includes(ref.name)); }).join('') : '<p class="sim-muted">本例未挂接药物候选卡；请写治疗原则，提交后回到指南和药物卡复核。</p>') + '</div>' + ctaOrderOptionsHtml() + '</section><section class="sim-cta-pane sim-cta-console-pane"><div class="sim-cta-pane-head"><span>已添加方案</span><b>治疗、监测与宣教</b></div><label class="sim-note-field"><b>治疗计划与监测/宣教</b><small>写治疗目标、监测项目、复评节点、患者教育和升级条件；不要凭空补剂量。</small><textarea data-cta-text="plan" placeholder="先独立书写，不要等解析...">' + esc(it.text.plan || '') + '</textarea></label></section></div><div class="sim-actions sim-cta-sticky-actions"><button class="primary" type="button" data-sim-action="cta-submit">提交第三考站并查看解析</button>' + (it.setting === 'inpatient' ? '<button class="sim-secondary" type="button" data-sim-action="cta-next-day">进入病程延伸：第' + (it.day + 1) + '天</button><button class="sim-secondary" type="button" data-sim-action="cta-reassessment">治疗后复评</button>' : '') + '</div>';
    } else if (phase === 'reassessment') {
      var activeOrders = it.activeOrders || [];
      body += '<div class="sim-review-block sim-cta-day-log"><h4>病情变化记录</h4>' + ctaProgressionHtml() + '</div><div class="sim-notice"><b>住院病程节点：</b>治疗后病情会变化；再次选择需要复查的查体和检查。系统不会凭空生成新的化验数值，需由你主动开立后获取本例文字结果。</div><h4>治疗后需要复查的查体</h4><div class="sim-choice-list">' + template.exams.map(function (item) { return ctaChoiceButton('cta-reexam', item.id, item.label, it.reassessmentExams && it.reassessmentExams.includes(item.id), '治疗后复评'); }).join('') + '</div><h4>治疗后需要复查的检查</h4><div class="sim-choice-list">' + template.tests.map(function (item) { return ctaChoiceButton('cta-retest', item.id, item.name, it.reassessmentTests && it.reassessmentTests.includes(item.id), '治疗后复评'); }).join('') + '</div><div class="sim-review-block"><h4>当前有效医嘱（模拟）</h4>' + (activeOrders.length ? activeOrders.map(function (name) { var stopped = (it.stoppedOrders || []).includes(name); return '<div class="sim-order-row ' + (stopped ? 'stopped' : '') + '"><span><b>' + esc(name) + '</b><small>' + (stopped ? '已记录停用' : '继续观察/核对') + '</small></span>' + (stopped ? '' : '<button class="sim-link" type="button" data-sim-action="cta-stop-order" data-sim-id="' + esc(name) + '">记录停用该医嘱</button>') + '</div>'; }).join('') : '<p class="sim-muted">尚未选择药物方向；请在治疗方案阶段形成可核对的模拟医嘱。</p>') + '</div><div class="sim-actions"><button class="primary" type="button" data-sim-action="cta-next-day">进入第' + (it.day + 1) + '天</button>' + (it.dischargeSuggested ? '<button class="sim-secondary" type="button" data-sim-action="cta-discharge">进入出院评估</button>' : '') + '<button class="sim-secondary" type="button" data-sim-action="cta-submit">结束住院模拟并查看解析</button></div>';
    } else if (phase === 'discharge') {
      body += '<div class="sim-review-block sim-cta-day-log"><h4>出院前病情记录</h4>' + ctaProgressionHtml() + '<p class="sim-cta-error-text">“好转”只是教学剧情提示，不等于自动满足出院标准；请按指南、客观指标、用药核对和随访条件由上级医师审核。</p></div><div class="sim-review-block"><h4>出院前医嘱核对</h4>' + ((it.activeOrders || []).map(function (name) { var stopped = (it.stoppedOrders || []).includes(name); return '<div class="sim-order-row ' + (stopped ? 'stopped' : '') + '"><span><b>' + esc(name) + '</b><small>' + (stopped ? '已记录停用' : '仍需核对是否继续/调整') + '</small></span>' + (stopped ? '' : '<button class="sim-link" type="button" data-sim-action="cta-stop-order" data-sim-id="' + esc(name) + '">记录停用该医嘱</button>') + '</div>'; }).join('') || '<p class="sim-muted">无已选模拟药物医嘱。</p>') + '</div><label class="sim-note-field"><b>出院交代、复查和安全网</b><small>写清继续/停用/调整后需核对的项目、复诊时间、危险信号和患者复述。</small><textarea data-cta-text="discharge" placeholder="先独立书写，不要等解析...">' + esc(it.text.discharge || '') + '</textarea></label><div class="sim-actions"><button class="primary" type="button" data-sim-action="cta-submit">结束住院模拟并查看解析</button></div>';
    }
    return ctaExamShellHtml(body, phase, phaseTitle, phaseNote);
  }
  function defensiveCommunicationHtml() {
    var templates = window.SIM_DEFENSIVE_COMMUNICATION || [];
    var sources = window.SIM_DEFENSIVE_SOURCES || [];
    if (!templates.length) return '';
    return '<div class="sim-review-block sim-defensive"><h4>患者安全沟通与文书留痕（DRG/DIP背景下）</h4><p class="sim-muted">这不是为了“多开检查”或规避收治，而是把病情依据、患者选择、风险告知和后续安全网写清楚。必要检查和治疗仍由病情、指南和院内流程决定，不由支付分组替代。</p><div class="sim-defensive-list">' + templates.map(function (item) {
      return '<article class="sim-defensive-item"><div><span class="sim-stage">' + esc(item.applies) + '</span><b>' + esc(item.title) + '</b></div><p><b>推荐话术：</b>' + esc(item.phrase) + '</p><p><b>病历要点：</b>' + esc(item.record) + '</p><p class="sim-muted"><b>避免：</b>' + esc(item.risk) + '</p></article>';
    }).join('') + '</div><p class="sim-muted sim-source-links"><b>制度背景：</b>' + sources.map(function (source) { return '<a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.label) + '</a>'; }).join('；') + '。页面只作学习提示，具体文书格式和医保编码按本机构制度执行。</p></div>';
  }
  function itemButton(type, item, index, active) {
    var bucket = type === 'history' ? 'history' : type === 'exams' ? 'exams' : type === 'tests' ? 'tests' : 'decisions';
    var opened = !!state.opened[bucket][item.id];
    var gate = gateFor(type);
    var locked = gate !== 'open' && gate !== 'done';
    return '<button type="button" class="sim-choice ' + (opened ? 'is-open ' : '') + (active ? ' is-selected' : '') + (locked ? ' is-locked' : '') + '" data-sim-action="' + (locked ? 'locked' : type) + '" data-sim-id="' + esc(item.id) + '"' + (locked ? ' aria-disabled="true"' : '') + '><span class="sim-choice-index">' + (index + 1) + '</span><span><b>' + esc(item.question || item.label || item.name) + '</b>' + (locked ? '<small>需先完成：' + esc(gateLabel(gate)) + '</small>' : opened ? '<small>已查看</small>' : '<small>点击查看患者回答/检查意义</small>') + '</span></button>';
  }
  function renderStartBase() {
    return '<div class="sim-intro"><p class="sim-muted">建议顺序：先回应感受 → 问关键病史 → 做床旁查体 → 选择首轮检查 → 解释结果 → 选择下一步。</p><div class="sim-patient-card"><div class="sim-patient-meta"><span class="sim-pill">虚构教学病例</span><span class="sim-pill sim-pill-soft">每次可重新抽取</span><span class="sim-pill sim-pill-soft">指南路径固定，表达方式随机</span></div><h3>' + esc(state.person.age + ' 岁 · ' + state.person.sex + ' · ' + state.person.job) + '</h3><p><b>主诉：</b>' + esc(state.person.complaint) + '</p><p><b>患病时间信息：</b>' + esc(timelineInfo()) + '</p><p class="sim-quote">“' + esc(mood.opening) + '”</p><p class="sim-muted">当前情绪：' + esc(mood.label) + '。' + esc(mood.style) + '</p></div><div class="sim-actions"><button class="primary" type="button" data-sim-action="new">重新抽取患者</button><button class="sim-secondary" type="button" data-sim-action="restart">从头开始本例</button><button class="sim-secondary" type="button" data-sim-action="hint">显示一个提示</button></div><div class="sim-communication"><h4>第一句话怎么说？</h4><p class="sim-muted">人文沟通不计“诊断正确”，但会影响患者是否愿意继续提供信息。</p><div class="sim-grid sim-grid-3"><button class="sim-choice" type="button" data-sim-action="empathy">先回应：“我能理解你现在很担心，我们一步一步来。”</button><button class="sim-choice" type="button" data-sim-action="explain">先解释流程：“我会先确认危险信号，再安排必要检查。”</button><button class="sim-choice" type="button" data-sim-action="direct">直接问：“哪里不舒服？多久了？”</button></div></div>' + (state.response ? '<div class="sim-feedback">' + esc(state.response) + '</div>' : '') + '</div>';
  }
  function renderProfileHtml() {
    var p = state.profile || {};
    return '<div class="sim-profile-grid"><div><b>就诊场景</b><span>' + esc(p.scene || '') + '</span><small>' + esc(p.context || '') + '</small></div><div><b>生命体征/体格变量</b><span>BP ' + esc(p.vitals && p.vitals.bp) + ' mmHg · HR ' + esc(p.vitals && p.vitals.hr) + '/min · T ' + esc(p.vitals && p.vitals.temp) + '℃ · BMI ' + esc(p.vitals && p.vitals.bmi) + '</span><small>这些是教学模拟变量，需与本例危险信号和检查结果一起解释。</small></div><div><b>基础病/风险线索</b><span>' + esc((p.comorbidities || []).join('、')) + '</span><small>通过病史核对，不把随机标签当作诊断。</small></div><div><b>用药/生活背景</b><span>' + esc(p.meds || '') + '</span><small>' + esc(p.occupationContext || '') + '</small></div><div><b>既往史/过敏史</b><span>' + esc(p.pastHistory || '') + '</span><small>' + esc(p.allergy || '') + '</small></div><div><b>家族史/个人史</b><span>' + esc(p.familyHistory || '') + '</span><small>' + esc(p.socialHistory || '') + '</small></div><div><b>婚育/月经史（适用时）</b><span>' + esc(p.reproductiveHistory || '') + '</span><small>敏感问题需说明询问目的并尊重隐私。</small></div></div>';
  }
  function renderStart() { return renderStartBase().replace('<div class="sim-intro">', '<div class="sim-intro">' + renderProfileHtml()); }
  function renderWorkflow() {
    var scene = SCENES.find(function (x) { return x.id === state.scene; }) || SCENES[0];
    var defaultType = workflowTemplateFor(scene.id);
    var selected = DOCUMENT_TEMPLATES[state.workflow.documentType] ? state.workflow.documentType : defaultType;
    var doc = DOCUMENT_TEMPLATES[selected];
    state.workflow.documentType = selected;
    if (!state.workflow.draftInitialized) {
      var initialDraft = autoDraftsFor(selected);
      var hasCurrentFields = doc.fields.some(function (field) { return String(state.notes[field[0]] || '').trim(); });
      if (!hasCurrentFields) Object.keys(initialDraft).forEach(function (field) { state.notes[field] = initialDraft[field]; });
      state.workflow.draftInitialized = true;
      state.workflow.autoGenerated = !hasCurrentFields;
      saveState();
    }
    var note = function (field) { return '<label class="sim-note-field"><b>' + esc(field[0]) + '</b><small>' + esc(field[1]) + '</small><textarea data-sim-note="' + esc(field[0]) + '" aria-label="' + esc(field[0]) + '" placeholder="先自行书写，再对照结构提示；不要复制患者真实身份信息。">' + esc(state.notes[field[0]] || '') + '</textarea></label>'; };
    var options = Object.keys(DOCUMENT_TEMPLATES).map(function (key) { return '<option value="' + esc(key) + '"' + (key === selected ? ' selected' : '') + '>' + esc(DOCUMENT_TEMPLATES[key].label) + '</option>'; }).join('');
    var score = documentScore();
    var gate = gateFor('workflow');
    var feedback = state.workflow.feedback ? '<div class="sim-feedback">' + esc(state.workflow.feedback) + '</div>' : '';
    return '<div class="sim-section-title"><div><span class="sim-kicker">病历与管床训练</span><h3>' + esc(scene.label) + '</h3><p class="sim-muted">' + esc(scene.prompt) + '</p></div><button class="sim-secondary" type="button" data-sim-action="workflow-guide">' + (state.workflowGuide ? '隐藏结构提示' : '显示结构提示') + '</button></div><div class="sim-notice"><b>先完成临床推理再写文书：</b>' + (gate === 'done' ? '前置问诊、查体、检查和判断已完成，可以提交文书复盘。' : '当前还不能提交文书；需要先完成“' + esc(gateLabel(gate)) + '”。') + '</div><label class="sim-note-field sim-document-select"><b>本次训练文书类型</b><small>文书骨架按现行病历书写规范整理；医院电子病历模板、科室制度和上级医师要求优先。</small><select data-sim-document>' + options + '</select></label><div class="sim-workflow-grid">' + doc.fields.map(note).join('') + '</div>' + feedback + '<div class="sim-workflow-actions"><span class="sim-stage">已完成 ' + score.filled.length + '/' + score.total + ' 项结构</span><button class="primary" type="button" data-sim-action="workflow-submit">提交文书复盘</button><button class="sim-secondary" type="button" data-sim-action="workflow-guide">' + (state.workflowGuide ? '隐藏结构提示' : '显示结构提示') + '</button><button class="sim-secondary" type="button" data-sim-action="jump-education">打开日常宣教</button></div>' + (state.workflowGuide ? '<div class="sim-review-block"><h4>' + esc(doc.label) + '结构提示</h4><ul>' + doc.fields.map(function (x) { return '<li><b>' + esc(x[0]) + '：</b>' + esc(x[1]) + '</li>'; }).join('') + '</ul><p class="sim-muted">' + esc(doc.source) + ' 先自己写，再逐项核对；这是训练骨架，不是正式病历表单。</p></div>' : '') + medicationRefsHtml() + defensiveCommunicationHtml() + '<div class="sim-notice"><b>记录边界：</b>本页保存的是虚构病例学习笔记，仅保存在当前浏览器会话，不上传。真实病历必须使用医院正式模板，遵守病历书写规范、知情沟通、审核和签名流程；不要把本页内容直接粘贴为病历或医嘱。</div>';
  }
  function renderDataTab(tab) {
    var map = { history: ['问诊', ctaHistoryItems(), '先问能改变分流和检查顺序的问题，并跳过性别不适用项目。'], exams: ['床旁查体', template.exams, '查体结果不是装饰，要说明它改变了什么。'], tests: ['选择检查', template.tests, '优先选能确认危象、诊断或改变下一步的检查。'], decisions: ['下一步判断', template.decisions, '选择最符合当前信息和指南顺序的路径。'] };
    var cfg = map[tab];
    if (!cfg) return renderStart();
    var list = cfg[1].map(function (item, i) { return itemButton(tab, item, i, state.opened[tab][item.id]); }).join('');
    var details = Object.keys(state.opened[tab]).filter(function (id) { return state.opened[tab][id]; }).map(function (id) {
      var item = cfg[1].find(function (x) { return x.id === id; });
      if (!item) return '';
      if (tab === 'history') return '<article class="sim-detail"><h4>问诊：' + esc(item.question) + '</h4><p><b>患者回答：</b>' + esc(item.answer) + '</p><p><b>为什么问：</b>' + esc(item.why) + '</p>' + (item.redFlag ? '<span class="sim-danger">需要立即升级或急诊评估的危险表现</span>' : '') + '</article>';
      if (tab === 'exams') return '<article class="sim-detail"><h4>查体：' + esc(item.label) + '</h4><p><b>模拟结果：</b>' + esc(item.result) + '</p><p><b>临床意义：</b>' + esc(item.meaning) + '</p>' + (item.redFlag ? '<span class="sim-danger">需要立即升级或急诊评估的危险表现</span>' : '') + '</article>';
      if (tab === 'tests') return '<article class="sim-detail"><h4>' + esc(item.name) + ' <span class="sim-stage">' + esc(item.stage) + '</span></h4><p><b>模拟结果：</b>' + esc(item.result) + '</p><p><b>如何解释：</b>' + esc(item.interpretation) + '</p><p><b>为什么选：</b>' + esc(item.why) + '</p>' + (item.redFlag ? '<span class="sim-danger">需要立即升级或急诊评估的危险表现</span>' : '') + (item.workupId ? '<p><button class="sim-link" type="button" data-sim-link="workup:' + esc(item.workupId) + '">打开指标追查：' + esc(item.workupId) + '</button></p>' : '') + '</article>';
      return '<article class="sim-detail ' + (item.correct ? 'sim-correct' : 'sim-wrong') + '"><h4>' + esc(item.label) + '</h4><p>' + (item.correct ? '<b>路径判断：更符合当前信息</b>' : '<b>路径判断：不建议作为当前首选</b>') + '</p><p><b>指南理由：</b>' + esc(item.why) + '</p>' + linksHtml(item.links) + '</article>';
    }).join('');
    var gate = gateFor(tab);
    var gateNote = gate !== 'open' && gate !== 'done' ? '<div class="sim-notice"><b>当前步骤已锁定：</b>' + esc(gateLabel(gate)) + '。完成前置步骤后再查看本组结果，避免只靠点击记答案。</div>' : gate === 'done' && ctaWorkflowComplete() ? '<div class="sim-notice sim-cta-bridge"><b>CTA 三站已完成：</b>本例的问诊、查体、检查报告和诊疗决策可直接用于文书结构复盘；文书内容仍需你按已获得资料独立整理。</div>' : '';
    return '<div class="sim-section-title"><div><span class="sim-kicker">' + esc(cfg[0]) + '</span><h3>' + esc(cfg[2]) + '</h3></div><button class="sim-secondary" type="button" data-sim-action="hint">给我提示</button></div>' + gateNote + '<div class="sim-choice-list">' + list + '</div><div class="sim-details">' + (details || '<p class="sim-muted">完成本步骤后逐项查看患者回答、检查意义或路径理由；每一项都要回答“它改变了什么”。</p>') + '</div>';
  }
  function renderTab(tab) { return tab === 'workflow' ? renderWorkflow() : tab === 'interview' ? renderCta() : renderDataTab(tab); }
  function reviewHtml() {
    var gate = gateFor('review');
    if (gate !== 'done' || !state.workflow.submitted) {
      var documentState = documentScore();
      return '<div class="sim-review"><div class="sim-review-head"><span class="sim-kicker">复盘暂未开放</span><h3>先完成一遍完整临床推理</h3><p>复盘不是“随便点完就给分”。请按沟通 → 必问病史 → 关键查体 → 必要检查 → 下一步判断 → 文书提交的顺序完成。</p></div><div class="sim-review-block sim-missed"><h4>当前还缺什么</h4><p>' + esc(gate === 'done' ? '还没有提交文书复盘。' : gateLabel(gate)) + '</p><p class="sim-muted">当前文书结构分：' + documentState.earnedPoints + '/' + documentState.totalPoints + '。进入“病历与流程”继续训练。</p></div><div class="sim-actions"><button class="primary" type="button" data-sim-tab="workflow">去写病历与流程</button><button class="sim-secondary" type="button" data-sim-action="hint">给我提示</button></div></div>';
    }
    if (ctaWorkflowComplete()) return ctaReview();
    var essentialHistory = ctaHistoryItems().filter(function (x) { return x.redFlag || x.id === 'symptoms' || x.id === 'insulin' || x.id === 'crisis'; }).map(function (x) { return x.id; });
    var essentialExams = template.exams.filter(function (x) { return x.redFlag; }).map(function (x) { return x.id; });
    var essentialTests = template.tests.filter(function (x) { return x.essential; }).map(function (x) { return x.id; });
    var missed = [];
    essentialHistory.forEach(function (id) { if (!state.asked.history.includes(id)) { var x = ctaHistoryItems().find(function (i) { return i.id === id; }); if (x) missed.push('问诊：' + x.question); } });
    essentialExams.forEach(function (id) { if (!state.asked.exams.includes(id)) { var x = template.exams.find(function (i) { return i.id === id; }); missed.push('查体：' + x.label); } });
    essentialTests.forEach(function (id) { if (!state.asked.tests.includes(id)) { var x = template.tests.find(function (i) { return i.id === id; }); missed.push('检查：' + x.name); } });
    var documentState = documentScore();
    var total = state.scores.communication + state.scores.history + state.scores.exams + state.scores.tests + state.scores.decisions + documentState.earnedPoints;
    var max = 2 + essentialHistory.length + essentialExams.length + essentialTests.length + template.decisions.length * 2 + documentState.totalPoints;
    var ratio = Math.round(total / Math.max(max, 1) * 100);
    var safe = ratio >= 75 && state.scores.decisions >= 2;
    var tab = safe ? '本例的主线基本抓住了' : '还可以再练一遍主线';
    state.completed = true; saveState();
    return '<div class="sim-review"><div class="sim-review-head"><span class="sim-kicker">复盘</span><h3>' + esc(tab) + '</h3><p>本例得分仅用于学习反馈，不代表真实临床能力评价。</p><div class="sim-score"><b>' + ratio + '</b><span>/ 100 学习反馈分</span></div></div><div class="sim-score-grid"><div><b>沟通</b><span>' + state.scores.communication + '</span></div><div><b>问诊</b><span>' + state.scores.history + '</span></div><div><b>查体</b><span>' + state.scores.exams + '</span></div><div><b>检查</b><span>' + state.scores.tests + '</span></div><div><b>判断</b><span>' + state.scores.decisions + '</span></div><div><b>文书结构</b><span>' + documentState.earnedPoints + '/' + documentState.totalPoints + '</span></div></div><div class="sim-review-block"><h4>本例最重要的路径</h4><p>' + esc(template.note) + '</p><p><b>建议顺序：</b>回应感受 → 需要立即升级或急诊评估的危险表现 → 病史/查体 → 首轮检查 → 解释结果 → 下一步 → 文书复盘。</p></div><div class="sim-review-block sim-document-rubric"><h4>文书逐项评分</h4><ul>' + documentState.rubric.map(function (item) { return '<li><b>' + esc(item.field) + '：</b>' + item.score + '/' + item.max + ' · ' + esc(item.feedback) + '</li>'; }).join('') + '</ul><p class="sim-muted">评分只检查训练结构和关键词覆盖；自动生成的参考稿不是独立书写能力证明。建议清空后重写，再与本例已知资料逐项核对。</p></div>' + (missed.length ? '<div class="sim-review-block sim-missed"><h4>下次优先补齐</h4><ul>' + missed.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '<div class="sim-review-block sim-good"><h4>关键项目已覆盖</h4><p>可以再换一个患者，练习同一疾病在不同场景和情绪下的表达。</p></div>') + medicationRefsHtml() + '<div class="sim-review-block"><h4>依据与边界</h4><ul>' + template.source.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><p class="sim-muted">模拟结果为教学用固定值；真实患者需结合原始指南、药品说明书、检验参考区间、监护条件和多学科判断。</p></div><div class="sim-actions"><button class="primary" type="button" data-sim-action="new">再抽取一位患者</button><button class="sim-secondary" type="button" data-sim-action="restart">重新做本例</button><button class="sim-secondary" type="button" data-sim-action="jump-workup">去指标追查</button><button class="sim-secondary" type="button" data-sim-action="jump-med">去药物剂量卡</button></div></div>';
  }
  function renderBase() {
    template = CASES.find(function (item) { return item.id === state.templateId; }) || CASES[0];
    mood = template.moods.find(function (item) { return item.id === state.person.moodId; }) || template.moods[0];
    var ctaLockedTabs = state.interview && state.interview.started && !state.interview.submitted;
    var tabs = ctaLockedTabs ? [{ id: 'interview', label: 'CTA练习' }] : [{ id: 'start', label: '患者与沟通' }, { id: 'interview', label: 'CTA练习' }, { id: 'history', label: '问诊' }, { id: 'exams', label: '床旁查体' }, { id: 'tests', label: '选择检查' }, { id: 'decisions', label: '下一步判断' }, { id: 'review', label: '复盘' }];
    tabs = tabs.filter(function (tab) { return ['start', 'interview', 'review'].includes(tab.id); });
    if (!['start', 'interview', 'review', 'workflow'].includes(state.activeTab)) state.activeTab = 'interview';
    var tabHtml = tabs.map(function (tab) { return '<button type="button" class="sim-tab ' + (state.activeTab === tab.id ? 'active' : '') + '" data-sim-tab="' + tab.id + '">' + tab.label + '</button>'; }).join('');
    root.innerHTML = '<div class="sim-top"><div><span class="sim-kicker">随机患者模拟器</span><h3>把指南路径练成一次有温度的问诊</h3><p>每次进入本页会保留当前病例；点击“重新抽取患者”生成新的虚构患者。随机的是背景、表达和情绪，诊断事实、检查结果与安全边界来自已标注的指南路径。</p></div><div class="sim-progress"><b>' + progressCount() + '</b><span>个学习动作</span></div></div><div class="sim-notice"><b>学习边界：</b>这是虚构教学病例，不是真实医嘱。模拟器不替代急诊分诊、原指南、药品说明书或专科会诊；涉及 DKA/HHS、低钾、肾上腺危象、视力下降等危险信号时，现实中应立即升级处理。</div><div class="sim-tabs">' + tabHtml + '</div><div class="sim-body">' + (state.activeTab === 'review' ? reviewHtml() : renderTab(state.activeTab)) + '</div>';
  }
  function decorateCtaResults() {
    if (!state.interview || !state.interview.started || state.interview.submitted || state.interview.phase !== 'reassessment') return;
    var body = root.querySelector('.sim-body');
    if (!body || body.querySelector('.sim-cta-reassessment-results')) return;
    var exams = template.exams.filter(function (item) { return (state.interview.reassessmentExams || []).includes(item.id); });
    var tests = template.tests.filter(function (item) { return (state.interview.reassessmentTests || []).includes(item.id); });
    if (!exams.length && !tests.length) return;
    var html = '<div class="sim-review-block sim-cta-reassessment-results"><h4>已开立复查结果</h4><p class="sim-muted">本区只回放本病例已标注的文字结果与参考区间；系统不会凭空生成新的化验数值。实际病程需以重新开立检查后的真实报告和趋势判读为准。</p>';
    if (exams.length) html += '<h5>复查查体</h5>' + exams.map(function (item) { return '<article class="sim-detail"><h4>' + esc(item.label) + '</h4><p><b>' + esc(ctaResultLabel(item)) + '：</b>' + esc(item.result) + '</p><p><b>正常范围/参考区间：</b>' + esc(ctaReferenceRange(item)) + '</p></article>'; }).join('');
    if (tests.length) html += '<h5>复查检查</h5>' + tests.map(function (item) { return '<article class="sim-detail"><h4>' + esc(item.name) + '</h4><p><b>' + esc(ctaResultLabel(item)) + '：</b>' + esc(item.result) + '</p><p><b>正常范围/参考区间：</b>' + esc(ctaReferenceRange(item)) + '</p></article>'; }).join('');
    html += '</div>';
    var actions = body.querySelectorAll('.sim-actions');
    var last = actions[actions.length - 1];
    if (last) last.insertAdjacentHTML('beforebegin', html);
  }
  function decorateStart() {
    var body = root.querySelector('.sim-body');
    if (!body || body.querySelector('.sim-cta-bridge')) return;
    var card = body.querySelector('.sim-patient-card');
    if (card && !body.querySelector('.sim-cta-known-data')) card.insertAdjacentHTML('afterend', ctaKnownFactsHtml());
    var communication = body.querySelector('.sim-communication');
    if (!communication) return;
    communication.insertAdjacentHTML('afterend', '<div class="sim-notice sim-cta-bridge"><b>主动问诊入口</b><p>完整病史不应凭空出现：进入 CTA 后，每点击一个具体问题，患者才回答这一项；你没有问到的内容会明确标记为“尚未获得”。</p><button class="primary" type="button" data-sim-tab="interview">进入 CTA 主动问诊</button></div>');
  }
  function ctaScrollTargets() {
    if (!root) return [];
    return Array.prototype.slice.call(root.querySelectorAll('.sim-cta-console-pane .sim-cta-transcript, .sim-cta-history-strip, .sim-cta-selector-pane .sim-choice-list, .sim-cta-selector-pane .sim-cta-question-list, .sim-cta-toolbar'));
  }
  function captureCtaScroll() {
    var targets = ctaScrollTargets();
    return {
      tab: state.activeTab,
      phase: state.interview && state.interview.phase,
      pageTop: window.pageYOffset || document.documentElement.scrollTop || 0,
      pageLeft: window.pageXOffset || document.documentElement.scrollLeft || 0,
      panels: targets.map(function (el) { return { top: el.scrollTop, left: el.scrollLeft }; })
    };
  }
  function restoreCtaScroll(snapshot) {
    if (!snapshot || snapshot.tab !== state.activeTab || snapshot.phase !== (state.interview && state.interview.phase)) return;
    var restore = function () {
      var targets = ctaScrollTargets();
      snapshot.panels.forEach(function (position, index) {
        var el = targets[index];
        if (!el) return;
        el.scrollTop = position.top;
        el.scrollLeft = position.left;
      });
      if (snapshot.pageTop || snapshot.pageLeft) window.scrollTo(snapshot.pageLeft, snapshot.pageTop);
    };
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(function () { window.requestAnimationFrame(restore); });
    } else restore();
  }
  function render() {
    var scrollSnapshot = captureCtaScroll();
    renderBase();
    var tabs = root.querySelector('.sim-tabs');
    if (tabs && !tabs.querySelector('[data-sim-tab="workflow"]') && !(state.interview && state.interview.started && !state.interview.submitted)) tabs.insertAdjacentHTML('beforeend', '<button type="button" class="sim-tab ' + (state.activeTab === 'workflow' ? 'active' : '') + '" data-sim-tab="workflow">病历与流程</button>');
    if (state.activeTab === 'workflow') decorateWorkflow();
    if (state.activeTab === 'interview') decorateCtaResults();
    if (state.activeTab === 'interview') decorateCtaHistory();
    if (state.activeTab === 'interview') decorateCtaScrollHint();
    if (state.activeTab === 'interview' && state.interview && !state.interview.started) {
      var ctaWelcomeCard = root.querySelector('.sim-cta-welcome .sim-patient-card');
      if (ctaWelcomeCard && !root.querySelector('.sim-cta-welcome .sim-cta-known-data')) ctaWelcomeCard.insertAdjacentHTML('afterend', ctaKnownFactsHtml());
    }
    if (state.activeTab === 'start') decorateStart();
    restoreCtaScroll(scrollSnapshot);
  }
  function decorateWorkflow() {
    var body = root.querySelector('.sim-body');
    var title = root.querySelector('.sim-section-title');
    if (!body || !title) return;
    var score = documentScore();
    title.insertAdjacentHTML('afterend', '<div class="sim-document-tools"><div><b>自动生成文书训练</b><p>以下内容只使用本例已设定的虚构资料；没有设定的患病时间、阴性症状或用药不会被补造，会明确写成“待补问”。自动草稿可直接删除，建议清空后独立重写再提交评分。</p></div><div class="sim-workflow-actions"><span class="sim-stage">' + (state.workflow.autoGenerated ? '当前：自动参考稿' : '当前：独立练习') + '</span><span class="sim-stage">文书结构分：' + score.earnedPoints + '/' + score.totalPoints + '（' + score.ratio + '%）</span><button class="primary" type="button" data-sim-action="workflow-autofill">重新生成参考文书</button><button class="sim-secondary" type="button" data-sim-action="workflow-clear">清空并开始独立训练</button></div></div>');
    var fields = root.querySelector('.sim-workflow-grid');
    if (fields) fields.insertAdjacentHTML('afterend', '<div class="sim-document-rubric"><b>评分维度：</b>每个字段按“是否形成可审核文字 + 是否覆盖结构关键词”各1分；不等于真实病历质量评价。提交后显示逐项反馈。</div>');
  }
  function handle(action, id, extra) {
    if (action === 'new') { state = makeCase(); render(); return; }
    if (action === 'restart') { var fresh = makeCase(); fresh.templateId = state.templateId; fresh.person = state.person; fresh.seed = newSeed(); state = fresh; render(); return; }
    if (action === 'hint') { state.hints += 1; state.response = '提示：' + (state.activeTab === 'start' ? '先回应患者情绪，再询问会改变急诊分流的危险信号。' : state.activeTab === 'history' ? '优先问时间线、用药、妊娠/生育、心肾功能和危险信号。' : state.activeTab === 'exams' ? '查体要回答“患者是否稳定、是否需要升级、下一项检查是什么”。' : state.activeTab === 'tests' ? '优先选择能确认诊断、危象或改变下一步的检查，并说明为什么。' : '先说出当前主导矛盾，再解释为什么其他选项会延误或增加风险。'); render(); return; }
    if (action === 'empathy' || action === 'explain' || action === 'direct') { state.asked.communication = true; state.scores.communication = action === 'empathy' ? 2 : action === 'explain' ? 1 : 0; state.response = action === 'empathy' ? mood.after : action === 'explain' ? '好的，先告诉我流程，我会尽量配合。' : '好吧，你问什么我就回答什么。'; saveState(); render(); return; }
    if (action === 'locked') { state.response = '当前步骤不能跳过：' + gateLabel(gateFor(state.activeTab)); saveState(); render(); return; }
    if (action === 'cta-start') { state.interview.started = true; state.interview.phase = 'history'; state.interview.station = 1; state.interview.identityConfirmed = false; state.interview.submitted = false; state.activeTab = 'interview'; saveState(); render(); return; }
    if (action === 'cta-confirm-identity') { state.interview.identityConfirmed = true; state.response = '患者已确认身份：' + ctaIdentityLabel() + '，' + state.person.age + ' 岁，从事' + state.person.job + '；本次就诊原因为“' + state.person.complaint + '”。现在进入一问一答病史采集。'; saveState(); render(); return; }
    if (action === 'cta-question') {
      if (!state.interview.identityConfirmed) { state.response = '请先完成“' + ctaIdentityLabel() + '”的身份核对，再开始问诊。'; saveState(); render(); return; }
      var questionItem = ctaHistoryItems().find(function (x) { return x.id === id; });
      if (questionItem && !state.interview.askedHistory.includes(id)) { state.interview.askedHistory.push(id); saveState(); render(); }
      return;
    }
    if (action === 'cta-symptom-question') {
      if (!state.interview.identityConfirmed) { state.response = '请先完成“' + ctaIdentityLabel() + '”的身份核对，再开始问诊。'; saveState(); render(); return; }
      var symptomItem = ctaSymptomItems().find(function (item) { return item.id === id; });
      if (!symptomItem) return;
      if (ctaSymptomAsked(symptomItem)) { state.response = '这个症状本次已经问过，不能重复提问；请继续选择其他症状或进入下一步。'; saveState(); render(); return; }
      var matchedHistory = ctaHistoryMatchByKeywords(symptomItem);
      if (matchedHistory && !state.interview.askedHistory.includes(matchedHistory.id)) state.interview.askedHistory.push(matchedHistory.id);
      state.interview.freeQuestions.push({ symptomId: symptomItem.id, question: symptomItem.question, answer: diagnosticSymptomAnswer(template, symptomItem), sourceId: matchedHistory ? matchedHistory.id : 'diagnostic-symptom-preset' });
      state.response = '已按本病例症状预设资料返回患者回答；练习阶段不显示指南解析。';
      saveState(); render(); return;
    }
    if (action === 'cta-quick-test') {
      var quickTest = template.tests.find(function (item) { return item.id === id; });
      if (!quickTest) return;
      if (!state.interview.selectedTests.includes(id)) state.interview.selectedTests.push(id);
      if (!state.interview.testStatus[id]) state.interview.testStatus[id] = 'ordered';
      state.response = '检查已加入待开列表；请进入第二考站执行后再查看报告。';
      saveState(); render(); return;
    }
    if (action === 'cta-free-question') {
      if (!state.interview.identityConfirmed) { state.response = '请先完成“' + ctaIdentityLabel() + '”的身份核对，再开始问诊。'; saveState(); render(); return; }
      var input = root.querySelector('[data-cta-free-question]');
      var query = input ? String(input.value || '').trim() : '';
      if (!query) { state.response = '请先写下你想问的症状、时间线、用药或危险表现。'; saveState(); render(); return; }
      var freeAnswer = freeQuestionAnswer(template, query);
      if (freeAnswer.historyId && !state.interview.askedHistory.includes(freeAnswer.historyId)) state.interview.askedHistory.push(freeAnswer.historyId);
      state.interview.freeQuestions.push({ question: query, answer: freeAnswer.answer, sourceId: freeAnswer.sourceId, symptomId: freeAnswer.symptomId || '' });
      state.response = '已按本病例预设训练资料回答；未显示指南解析。';
      saveState(); render(); return;
    }
    if (action === 'cta-impression') { if (!state.interview.identityConfirmed) { state.response = '请先完成“' + ctaIdentityLabel() + '”的身份核对。'; saveState(); render(); return; } if (!state.interview.askedHistory.length) { state.response = '至少主动询问一个问题后，才能结束资料收集。'; saveState(); render(); return; } state.interview.stationSubmitted.one = true; state.interview.phase = 'impression'; state.interview.station = 1; state.response = ''; saveState(); render(); return; }
    if (action === 'cta-history-return' || action === 'cta-exams-return') { state.response = 'CTA训练按站点单向推进；已获得的问诊和检查信息会在后续站点保留查看，不能返回上一站。'; saveState(); render(); return; }
    if (action === 'cta-exams') { if (!state.interview.impressionDecision) { state.response = '先选择一个初步判断，再进入针对性查体。'; saveState(); render(); return; } state.interview.phase = 'exams'; state.response = ''; saveState(); render(); return; }
    if (action === 'cta-exam') {
      var examId = id;
      if (state.interview.selectedExams.includes(examId)) state.interview.selectedExams = state.interview.selectedExams.filter(function (x) { return x !== examId; });
      else state.interview.selectedExams.push(examId);
      saveState(); render(); return;
    }
    if (action === 'cta-workup') { if (!state.interview.selectedExams.length) { state.response = '至少选择一项针对性查体后，才能进入辅助检查。'; saveState(); render(); return; } state.interview.stationSubmitted.one = true; state.interview.phase = 'workup'; state.interview.station = 2; state.response = ''; saveState(); render(); return; }
    if (action === 'cta-test') {
      var testId = id;
      if (!state.interview.selectedTests.includes(testId)) state.interview.selectedTests.push(testId);
      state.interview.testStatus[testId] = 'ordered';
      state.response = '检查已开立；请点击同一项目的“执行并返回报告”，报告返回前不能进行结果解释。';
      saveState(); render(); return;
    }
    if (action === 'cta-execute-test') {
      if (!state.interview.selectedTests.includes(id)) state.interview.selectedTests.push(id);
      state.interview.testStatus[id] = 'reported';
      state.response = '检查已执行，模拟报告返回。请打开报告并标记已阅后再解释结果。';
      saveState(); render(); return;
    }
    if (action === 'cta-review-test') {
      if (!state.interview.reviewedTests.includes(id)) state.interview.reviewedTests.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-exams-return') {
      if (state.interview.examReturns < 2) { state.interview.examReturns += 1; state.interview.phase = state.interview.phase === 'diagnosis' ? 'workup' : 'exams'; }
      saveState(); render(); return;
    }
    if (action === 'cta-diagnosis') { if (!ctaReportsReady()) { state.response = '至少执行并获得一份辅助检查报告后，才能进入诊断分析；仅加入待开列表不算获得结果。'; saveState(); render(); return; } if (!state.interview.reviewedTests.length) { state.response = '检查报告已经返回，但你尚未打开并标记已阅。请先查看至少一份报告，再进入诊断分析。'; saveState(); render(); return; } state.interview.phase = 'diagnosis'; state.interview.station = 2; state.response = ''; saveState(); render(); return; }
    if (action === 'cta-final-choice' || action === 'cta-impression-choice') {
      if (action === 'cta-final-choice') state.interview.finalDecision = id;
      else state.interview.impressionDecision = id;
      saveState(); render(); return;
    }
    if (action === 'cta-plan') { if (!state.interview.finalDecision) { state.response = '先选择最终诊断/下一步判断，再进入治疗方案。'; saveState(); render(); return; } state.interview.stationSubmitted.two = true; state.interview.phase = 'plan'; state.interview.station = 3; state.response = ''; saveState(); render(); return; }
    if (action === 'cta-med') {
      if (state.interview.selectedMeds.includes(id)) state.interview.selectedMeds = state.interview.selectedMeds.filter(function (x) { return x !== id; });
      else state.interview.selectedMeds.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-order') {
      if (!Array.isArray(state.interview.selectedOrders)) state.interview.selectedOrders = [];
      if (state.interview.selectedOrders.includes(id)) state.interview.selectedOrders = state.interview.selectedOrders.filter(function (x) { return x !== id; });
      else state.interview.selectedOrders.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-evidence') {
      var decisionId = state.interview.finalDecision || (template.decisions[0] && template.decisions[0].id);
      if (!decisionId) return;
      if (!state.interview.evidence[decisionId]) state.interview.evidence[decisionId] = {};
      state.interview.evidence[decisionId][id] = extra || 'unknown';
      saveState(); render(); return;
    }
    if (action === 'cta-reassessment') { state.interview.phase = 'reassessment'; state.interview.reassessmentExams = state.interview.reassessmentExams || []; state.interview.reassessmentTests = state.interview.reassessmentTests || []; saveState(); render(); return; }
    if (action === 'cta-next-day') {
      if (state.interview.setting !== 'inpatient') { state.response = '只有住院场景可以推进病程日；门诊病例请提交本次诊疗计划后查看解析。'; saveState(); render(); return; }
      if (!state.interview.finalDecision) { state.response = '请先完成最终判断并进入治疗方案，再推进到下一天。'; saveState(); render(); return; }
      ctaAdvanceDay(); state.response = ''; saveState(); render(); return;
    }
    if (action === 'cta-stop-order') {
      if (!state.interview.stoppedOrders.includes(id)) state.interview.stoppedOrders.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-discharge') {
      if (!state.interview.dischargeSuggested) { state.response = '当前剧情尚未给出出院评估入口；请先按病情变化复查并核对出院条件。'; saveState(); render(); return; }
      state.interview.discharged = true; state.interview.phase = 'discharge'; state.response = ''; saveState(); render(); return;
    }
    if (action === 'cta-reexam') {
      if (state.interview.reassessmentExams.includes(id)) state.interview.reassessmentExams = state.interview.reassessmentExams.filter(function (x) { return x !== id; });
      else state.interview.reassessmentExams.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-retest') {
      if (state.interview.reassessmentTests.includes(id)) state.interview.reassessmentTests = state.interview.reassessmentTests.filter(function (x) { return x !== id; });
      else state.interview.reassessmentTests.push(id);
      saveState(); render(); return;
    }
    if (action === 'cta-submit') { state.interview.stationSubmitted.three = true; state.interview.submitted = true; state.interview.score = ctaScore().ratio; saveState(); render(); return; }
    if (action === 'cta-retry') {
      var currentSetting = state.interview.setting;
      state.interview = { started: true, phase: 'history', station: 1, setting: currentSetting, day: 1, identityConfirmed: false, askedHistory: [], freeQuestions: [], selectedExams: [], selectedTests: [], testStatus: {}, reviewedTests: [], reassessmentExams: [], reassessmentTests: [], impressionDecision: '', finalDecision: '', evidence: {}, selectedMeds: [], selectedOrders: [], activeOrders: [], stoppedOrders: [], progression: [], currentEvent: null, dischargeSuggested: false, discharged: false, historyReturns: 0, examReturns: 0, stationSubmitted: { one: false, two: false, three: false }, text: { impression: '', diagnosis: '', plan: '', discharge: '' }, submitted: false, score: null };
      state.activeTab = 'interview'; saveState(); render(); return;
    }
    if (action === 'cta-reset') { state.interview.started = false; state.interview.submitted = false; state.activeTab = 'interview'; saveState(); render(); return; }
    if (action === 'history' || action === 'exams' || action === 'tests' || action === 'decisions') {
      var list = template[action]; var item = list.find(function (x) { return x.id === id; }); if (!item) return;
      state.opened[action][id] = true;
      if (action === 'history') markOnce('history', id, item.redFlag || id === 'symptoms' || id === 'insulin' || id === 'crisis' ? 1 : 0);
      if (action === 'exams') markOnce('exams', id, item.redFlag ? 1 : 0);
      if (action === 'tests') markOnce('tests', id, item.essential ? 1 : 0);
      if (action === 'decisions') { if (!state.asked.decisions.includes(id)) { state.asked.decisions.push(id); state.scores.decisions += item.correct ? 2 : 0; } }
      saveState(); render(); return;
    }
    if (action === 'jump-workup') { if (typeof window.show === 'function') window.show('workups'); return; }
    if (action === 'jump-med') { if (typeof window.show === 'function') window.show('medications'); return; }
    if (action === 'jump-education') { if (typeof window.show === 'function') window.show('education'); return; }
    if (action === 'jump-complications') { if (typeof window.show === 'function') window.show('complications'); return; }
    if (action === 'jump-med-name') {
      if (typeof window.show === 'function') window.show('medications');
      var medInput = document.getElementById('medSearch');
      if (medInput) {
        medInput.value = id || '';
        if (typeof window.renderMedications === 'function') window.renderMedications(id || '');
        else medInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    if (action === 'workflow-guide') { state.workflowGuide = !state.workflowGuide; saveState(); render(); return; }
    if (action === 'workflow-autofill') {
      var selectedKey = state.workflow.documentType || workflowTemplateFor(state.scene);
      var generated = autoDraftsFor(selectedKey);
      Object.keys(generated).forEach(function (field) { state.notes[field] = generated[field]; });
      state.workflow.draftInitialized = true;
      state.workflow.autoGenerated = true;
      state.workflow.submitted = false;
      state.workflow.feedback = '已按本例已知资料生成参考文书；请先核对时间线、危险表现和未提供项目，再决定是否清空独立练习。';
      saveState(); render(); return;
    }
    if (action === 'workflow-clear') {
      var clearKey = state.workflow.documentType || workflowTemplateFor(state.scene);
      (DOCUMENT_TEMPLATES[clearKey] || DOCUMENT_TEMPLATES.outpatient).fields.forEach(function (field) { delete state.notes[field[0]]; });
      state.workflow.draftInitialized = true;
      state.workflow.autoGenerated = false;
      state.workflow.submitted = false;
      state.workflow.feedback = '已清空本次文书字段；请按主诉 → 时间线 → 危险表现 → 证据 → 计划的顺序独立书写。';
      saveState(); render(); return;
    }
    if (action === 'workflow-submit') {
      var gate = gateFor('workflow');
      var result = documentScore();
      if (gate !== 'done') {
        state.workflow.submitted = false;
        state.workflow.feedback = '文书暂不能提交：请先完成“' + gateLabel(gate) + '”，再把临床推理写进文书。';
      } else {
        state.workflow.submitted = true;
        state.workflow.score = result.ratio;
        state.workflow.feedback = '已提交文书评分：' + result.earnedPoints + '/' + result.totalPoints + '（' + result.ratio + '%）。进入“复盘”查看逐项缺口；未完成字段不需要编造，可保留为待补问。';
      }
      saveState(); render(); return;
    }
  }
  root.addEventListener('click', function (event) {
    var tab = event.target.closest('[data-sim-tab]'); if (tab) { state.activeTab = tab.dataset.simTab; saveState(); render(); return; }
    var link = event.target.closest('[data-sim-link]'); if (link) { var parts = link.dataset.simLink.split(':'); openLink({ type: parts[0], id: parts.slice(1).join(':') }); return; }
    var btn = event.target.closest('[data-sim-action]'); if (btn) { handle(btn.dataset.simAction, btn.dataset.simId, btn.dataset.simEvidence); }
  });
  root.addEventListener('input', function (event) {
    var field = event.target.closest('[data-sim-note]');
    if (field) { state.notes[field.dataset.simNote] = field.value; saveState(); }
    var ctaText = event.target.closest('[data-cta-text]');
    if (ctaText) { state.interview.text[ctaText.dataset.ctaText] = ctaText.value; saveState(); }
  });
  root.addEventListener('change', function (event) {
    var selector = event.target.closest('[data-sim-document]');
    if (selector) { state.workflow.documentType = selector.value; state.workflow.submitted = false; state.workflow.feedback = ''; state.workflow.draftInitialized = false; state.workflow.autoGenerated = false; state.notes = {}; saveState(); render(); }
    var ctaSetting = event.target.closest('[data-cta-setting]');
    if (ctaSetting) { state.interview.setting = ctaSetting.value; saveState(); render(); }
  });
  window.PATIENT_SIMULATOR_CASES = CASES;
  window.PATIENT_SIMULATOR = { reset: function () { state = makeCase(); render(); }, cases: CASES };
  render();
})();
