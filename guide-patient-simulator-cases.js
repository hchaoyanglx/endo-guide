(function () {
  'use strict';
  var MOODS = [
    { id: 'anxious', label: '有些焦虑', opening: '我看到检查结果就很担心，能不能先告诉我最需要做什么？', after: '谢谢你先解释，我愿意一步一步配合。', style: '会反复确认结果是不是很严重。' },
    { id: 'quiet', label: '话不多、略拘谨', opening: '嗯……我也不知道该从哪里说起。', after: '这样问我就容易多了，我可以继续回答。', style: '敏感问题在建立信任前回答较简短。' },
    { id: 'irritable', label: '疲惫、略急躁', opening: '我已经很难受了，能不能先做最必要的检查？', after: '好，先做必要检查，问病史可以同步进行。', style: '回答简短，但不等于不配合。' },
    { id: 'calm', label: '平静配合', opening: '我把以前的报告和用药记录也带来了。', after: '好的，我明白每项检查是为了解决什么问题。', style: '能主动补充病史。' }
  ];
  function make(c) {
    return Object.assign({
      demographics: { ages: [35, 46, 58, 68], sexes: ['男', '女'], jobs: ['教师', '职员', '个体经营者', '退休人员'] },
      complaints: ['体检发现异常', '最近有些不舒服', '担心检查结果'], moods: MOODS,
      history: [], exams: [], tests: [], decisions: [], source: [], note: ''
    }, c);
  }
  window.SIM_EXTRA_CASES = [
    make({
      id: 'new-t1d', group: '糖尿病/糖尿病前期', title: '青年人消瘦、口渴与酮体阳性',
      intro: '一位年轻患者近来消瘦、口渴，多尿，检查发现高血糖和血酮。请先识别分解代谢和 DKA 风险，再考虑分型。',
      demographics: { ages: [16, 22, 29, 34], sexes: ['男', '女'], jobs: ['大学生', '设计师', '研究助理', '客服'] },
      complaints: ['近月明显消瘦、口渴多尿', '体检血糖高且血酮阳性', '担心是不是 1 型糖尿病'],
      history: [
        { id: 'catabolic', question: '体重下降、口渴、多尿从什么时候开始？有没有呕吐、腹痛或深快呼吸？', answer: '6 周体重下降 6 kg，近两天恶心；没有明显深快呼吸。', why: '分解代谢和 DKA 危险信号决定是否急诊升级。', redFlag: true },
        { id: 'autoimmune', question: '本人或家族有甲状腺、自身免疫病或 1 型糖尿病吗？', answer: '姐姐有自身免疫性甲状腺病，患者本人没有既往糖尿病。', why: '自身免疫背景支持分型线索，但不能单独确诊。', sensitive: true },
        { id: 'meds', question: '近期是否用糖皮质激素、SGLT2 抑制剂，或因进食少而停用胰岛素？', answer: '未用糖皮质激素和 SGLT2 抑制剂；尚未开始胰岛素。', why: '排除药物和饥饿性酮症，并避免延误胰岛素缺乏处理。' }
      ],
      exams: [
        { id: 'vitals', label: '生命体征与容量', result: 'HR 104/min，BP 108/70 mmHg，轻度口干，意识清楚。', meaning: '目前未见休克，但有脱水和酮症风险，需尽快完成急症检查。', redFlag: true },
        { id: 'breath', label: '呼吸模式与腹部', result: '呼吸略深，无明确腹膜刺激征。', meaning: '要结合血气、碳酸氢根和血酮判断，不能靠外观排除 DKA。', redFlag: true },
        { id: 'thyroid', label: '甲状腺和其他自身免疫线索', result: '无明显甲亢体征；皮肤无明显黑棘皮。', meaning: '查体仅提供线索，分型需结合抗体、C 肽、病程和同步血糖。' }
      ],
      tests: [
        { id: 'dka', name: '血 β-羟丁酸、血气/碳酸氢根、电解质', stage: '立即', workupId: 'ketosis-hyperosmolar', result: 'β-羟丁酸 3.8 mmol/L，pH 7.28，HCO₃⁻ 16 mmol/L；K⁺ 4.1 mmol/L。', interpretation: '支持酮症和代谢性酸中毒，需按 DKA 路径监护、补液、电解质动态复查并启动胰岛素相关处理。', why: '先判断危象，再谈分型。', essential: true, redFlag: true },
        { id: 'glucose', name: '同步血糖与 HbA1c', stage: '立即', workupId: 'glucose-high', result: '随机血糖 19.2 mmol/L，HbA1c 11.2%。', interpretation: '提示持续高血糖和近期分解代谢；严重高血糖伴酮症不应仅按门诊轻症处理。', why: '量化高血糖并结合病程解释。', essential: true },
        { id: 'type', name: '胰岛自身抗体与 C 肽（稳定后分型）', stage: '稳定后', workupId: 'glucose-high', result: 'GAD 抗体阳性；C 肽需与同步血糖一起解释。', interpretation: '支持自身免疫性糖尿病方向，但分型需结合临床、抗体组合和胰岛功能。', why: '避免因年龄或 BMI 直接把患者归为 2 型。', essential: true }
      ],
      decisions: [
        { id: 'dka-first', label: '先按 DKA/胰岛素缺乏急症路径处理，再完善 1 型/LADA 分型和长期教育', correct: true, why: '酮症和酸中毒优先级高；分型检查不能延误急症安全。', links: [{ type: 'workup', id: 'ketosis-hyperosmolar', label: '打开 DKA/HHS 追查' }] },
        { id: 'oral-only', label: '先用口服降糖药观察，酮症以后再说', correct: false, why: '酮症和酸中毒提示胰岛素缺乏风险，不能按普通轻症高血糖等待。' },
        { id: 'antibody-only', label: '只凭 GAD 抗体阳性就结束评估', correct: false, why: '抗体是分型线索，还要结合 C 肽、同步血糖、病程和临床表型。' }
      ],
      source: ['2026 ADA 糖尿病诊疗标准.pdf；中国1型糖尿病诊治指南（2021版）-.pdf；儿童1型糖尿病防治指南（2026）.pdf', 'DKA 真实处理需要连续监护和当地急症流程；本模拟器不提供固定剂量'],
      note: '学习重点：年轻、消瘦或酮体阳性时不能只看 BMI；先排 DKA，再做分型和长期计划。'
    }),
    make({
      id: 'prediabetes', group: '糖尿病/糖尿病前期', title: '体检发现糖尿病前期',
      intro: '患者没有明显症状，但 FPG 和 HbA1c 落在糖尿病前期范围。请确认结果、评估风险并给出可追踪的干预计划。',
      demographics: { ages: [38, 49, 56, 64], sexes: ['男', '女'], jobs: ['办公室职员', '公务员', '销售', '照护家属'] },
      complaints: ['体检发现 HbA1c 偏高', '空腹血糖反复临界升高', '想知道是否需要吃药'],
      history: [
        { id: 'risk', question: '既往有妊娠糖尿病、家族史、肥胖、睡眠不足或久坐吗？', answer: 'BMI 30，母亲患糖尿病；每天久坐，睡眠不足。', why: '风险因素决定干预强度和随访频率。', sensitive: false },
        { id: 'diet', question: '典型饮食、饮料、运动和体重变化？', answer: '含糖饮料较多，近年体重增加 8 kg，每周很少运动。', why: '将建议落到可观察的行为和体重轨迹。' },
        { id: 'meds', question: '近期是否有急性病、糖皮质激素或影响 HbA1c 的情况？', answer: '没有急性感染和糖皮质激素使用。', why: '排除暂时性高血糖和 HbA1c 解读干扰。' }
      ],
      exams: [
        { id: 'anthro', label: 'BMI、腰围与血压', result: 'BMI 30.2 kg/m²，腰围 103 cm，BP 142/88 mmHg。', meaning: '肥胖、腹型肥胖和血压升高提示心代谢风险需要并行管理。' },
        { id: 'sleep', label: '睡眠呼吸暂停线索', result: '打鼾、白天嗜睡；家属观察到夜间呼吸暂停。', meaning: '睡眠呼吸暂停可能影响体重和代谢风险，应按症状转诊评估。' },
        { id: 'complications', label: '基线并发症线索', result: '目前无明显多尿、视物模糊或足部症状。', meaning: '无症状不等于无风险；达到糖尿病诊断后再按相应时间点筛查。' }
      ],
      tests: [
        { id: 'confirm', name: '重复 HbA1c/FPG（必要时 OGTT）', stage: '首轮/确认', workupId: 'glucose-high', result: '重复 HbA1c 6.0%，FPG 6.2 mmol/L；未达到糖尿病诊断阈值。', interpretation: '符合糖尿病前期范围；应进入强化生活方式、风险评估和定期复查路径。', why: '区分糖尿病前期与糖尿病，避免一次结果过度诊断。', essential: true },
        { id: 'risk', name: '脂质、肝肾功能与血压风险评估', stage: '首轮', workupId: 'obesity-measures', result: '甘油三酯升高，ALT 轻度升高；eGFR 正常。', interpretation: '并行评估代谢相关脂肪性肝病、心血管风险和生活方式目标。', why: '糖尿病前期管理不只盯血糖。', essential: true },
        { id: 'sleep-test', name: '睡眠呼吸暂停评估（按症状）', stage: '按需', workupId: 'obesity-measures', result: '建议根据症状和量表决定睡眠监测。', interpretation: '属于可干预共病，不能用血糖结果替代专科评估。', why: '解释乏力和体重管理困难的可能原因。', essential: false }
      ],
      decisions: [
        { id: 'lifestyle', label: '确认糖尿病前期后，制定可量化的减重、饮食、运动和随访计划，并管理心代谢风险', correct: true, why: '糖尿病前期是干预窗口；计划应可执行、可记录、可复查。', links: [{ type: 'workup', id: 'obesity-measures', label: '打开肥胖/体重指标追查' }] },
        { id: 'diagnose', label: '一次 HbA1c 临界升高就直接诊断糖尿病并开多种药', correct: false, why: '需要结合诊断阈值、重复结果和临床背景。' },
        { id: 'recheck-years', label: '没有症状，几年后再看', correct: false, why: '糖尿病前期有进展风险，应按风险制定随访。' }
      ],
      source: ['2026 ADA 糖尿病诊疗标准.pdf；中国成人糖尿病前期干预的专家共识（2023版）.pdf', '生活方式和药物选择需结合患者风险、偏好、禁忌和当地可及性；本模拟器不替代处方'],
      note: '学习重点：糖尿病前期不是“没事”；确认结果后要把风险、行为和随访具体化。'
    }),
    make({
      id: 'hyperthyroidism', group: '甲状腺', title: '心悸、怕热与体重下降',
      intro: '患者出现心悸、手抖和体重下降。请确认甲亢生化模式，区分 Graves、自主结节、甲状腺炎和药物因素，并识别甲状腺危象。',
      demographics: { ages: [24, 37, 55, 72], sexes: ['男', '女'], jobs: ['教师', '护士', '销售', '退休人员'] },
      complaints: ['心悸、手抖、怕热', '体重下降、失眠', '眼睛突出或眼干'],
      history: [
        { id: 'crisis', question: '有无高热、明显心动过速、意识改变、心衰或持续呕吐？', answer: '无高热和意识改变，但静息时心慌明显。', why: '先排除甲状腺危象和心血管并发症。', redFlag: true },
        { id: 'thyroid', question: '既往甲状腺病、颈部疼痛、近期碘/造影剂和药物？', answer: '无甲状腺病史；近期做过含碘造影检查。', why: '药物/碘暴露和甲状腺炎可改变病因判断。', sensitive: false },
        { id: 'eye', question: '有无眼痛、复视、视力或色觉下降？', answer: '眼干和轻度突眼，无视力下降。', why: '甲状腺眼病的活动性和严重度影响转诊与治疗。', redFlag: true }
      ],
      exams: [
        { id: 'vitals', label: '心率、体温、心衰体征', result: 'HR 128/min，体温 37.3℃；无肺水肿和意识障碍。', meaning: '明显心动过速需做心电图并评估诱因；若伴高热、意识改变或心衰应升级。', redFlag: true },
        { id: 'thyroid', label: '甲状腺与震颤', result: '甲状腺弥漫性轻度肿大，有细震颤。', meaning: '支持甲亢线索，但病因需生化和抗体/影像。' },
        { id: 'eye', label: '眼部筛查', result: '轻度双侧突眼、闭眼不全，无角膜损伤。', meaning: '需要记录视力、色觉、眼球运动和活动性危险信号。', redFlag: true }
      ],
      tests: [
        { id: 'tft', name: 'TSH、FT4、FT3', stage: '首轮', workupId: 'tsh-low', result: 'TSH 抑制，FT4 和 FT3 升高。', interpretation: '符合显性甲状腺毒症；结合病因和严重度决定治疗路径。', why: '确认生化模式。', essential: true },
        { id: 'trab', name: 'TRAb/TSI，必要时甲状腺摄取或超声血流', stage: '第二轮', workupId: 'tsh-low', result: 'TRAb 阳性；影像用于病因不清或治疗规划。', interpretation: '支持 Graves 方向，但仍需结合临床、眼病和共病。', why: '区分 Graves、自主功能和甲状腺炎。', essential: true },
        { id: 'ecg', name: '心电图及并发症评估', stage: '同步', workupId: 'tsh-low', result: '窦性心动过速；未见房颤。', interpretation: '甲亢相关心律失常需持续观察和个体化处理。', why: '心脏风险会改变紧迫程度。', essential: false }
      ],
      decisions: [
        { id: 'thyrotox', label: '先确认甲状腺毒症并评估危象/心眼并发症，再按病因选择路径', correct: true, why: '甲亢不是单一疾病，治疗取决于病因、严重度、妊娠和眼病。', links: [{ type: 'workup', id: 'tsh-low', label: '打开低 TSH 追查' }] },
        { id: 'surgery', label: '只凭心悸就直接手术，不做甲功和病因评估', correct: false, why: '需要先确认生化和病因，并评估手术/放射性碘/药物适宜性。' },
        { id: 'ignore-eye', label: '把突眼当美容问题，不记录视力和色觉', correct: false, why: '视力、色觉下降或角膜/视神经风险是眼科升级信号。' }
      ],
      source: ['中国甲状腺功能亢进症和其他原因所致甲状腺毒症诊治指南.pdf；中国甲状腺相关眼病诊断和治疗指南（2022年）.pdf', '抗甲状腺药物选择和剂量需在药物卡/原指南中按妊娠、肝功能和粒细胞风险核对'],
      note: '学习重点：先确认“甲状腺毒症”，再回答“为什么”和“有没有危象/心眼并发症”。'
    }),
    make({
      id: 'hypothyroidism', group: '甲状腺', title: '乏力、怕冷与 TSH 升高',
      intro: '患者因乏力、怕冷和便秘检查发现 TSH 升高。请区分原发性甲减、药物/疾病影响和中枢性甲减。',
      demographics: { ages: [31, 47, 63, 78], sexes: ['男', '女'], jobs: ['会计', '教师', '退休人员', '照护家属'] },
      complaints: ['乏力、怕冷、便秘', '体重增加、皮肤干燥', '体检 TSH 升高'],
      history: [
        { id: 'severe', question: '有无嗜睡、低体温、意识改变、呼吸变慢或明显心动过缓？', answer: '没有意识改变和低体温，但近来反应变慢。', why: '先排除重度甲减/黏液性水肿危象。', redFlag: true },
        { id: 'meds', question: '是否使用胺碘酮、锂剂、免疫治疗或补充含碘/生物素产品？', answer: '使用胺碘酮治疗心律失常，服用复合维生素。', why: '药物和检测干扰会造成甲功异常。', sensitive: false },
        { id: 'pituitary', question: '有无头痛、视野改变、产后出血或其他垂体轴症状？', answer: '无头痛和视野改变；没有产后出血史。', why: 'FT4 低而 TSH 不高时需考虑中枢性甲减。', sensitive: true }
      ],
      exams: [
        { id: 'vitals', label: '体温、心率与意识', result: '体温 36.0℃，HR 54/min，意识清楚。', meaning: '目前无明显危象，但老年人和心脏病患者需要谨慎评估。', redFlag: true },
        { id: 'thyroid', label: '甲状腺、皮肤和反射', result: '皮肤干燥，跟腱反射放松相延长；甲状腺未明显肿大。', meaning: '支持甲减线索，但需与生化和药物史结合。' },
        { id: 'edema', label: '水肿、心肺和神经', result: '轻度踝部水肿，无肺水肿；无局灶神经体征。', meaning: '评估心衰、肾病和其他乏力原因。' }
      ],
      tests: [
        { id: 'tft', name: 'TSH + FT4（必要时 FT3）', stage: '首轮', workupId: 'tsh-high', result: 'TSH 18 mIU/L，FT4 降低。', interpretation: '符合原发性甲减生化模式；需结合抗体、药物、妊娠和心血管风险。', why: '确认甲功模式。', essential: true },
        { id: 'antibody', name: 'TPOAb/TgAb 与甲状腺超声（按需）', stage: '第二轮/病因', workupId: 'tsh-high', result: 'TPOAb 阳性；超声用于结构性问题或病因不清时。', interpretation: '支持自身免疫性甲状腺炎方向，但治疗决定仍需结合 FT4、症状和风险。', why: '区分病因和长期趋势。', essential: true },
        { id: 'interference', name: '复核药物、补充剂和检测干扰', stage: '同步', workupId: 'tsh-high', result: '需核对胺碘酮、含碘产品和生物素使用时间。', interpretation: '不要在未核对干扰因素时仅凭单次结果调整治疗。', why: '降低假异常风险。', essential: false }
      ],
      decisions: [
        { id: 'primary', label: '确认原发性甲减后结合年龄、心脏病、妊娠和症状制定替代与复查计划', correct: true, why: '甲减治疗需要个体化；重度症状和危象信号需升级。', links: [{ type: 'workup', id: 'tsh-high', label: '打开高 TSH 追查' }] },
        { id: 'tsh-only', label: '只看 TSH，不看 FT4、药物和心血管风险', correct: false, why: 'TSH 模式、FT4、病因和共病共同决定下一步。' },
        { id: 'central', label: 'TSH 升高就诊断中枢性甲减', correct: false, why: '中枢性甲减通常表现为 FT4 低而 TSH 不适当正常/低，需结合垂体轴。' }
      ],
      source: ['【医脉通】甲状腺功能减退症基层合理用药指南.pdf', '左甲状腺素剂量需结合年龄、妊娠、心血管病和复查结果在药物卡中核对'],
      note: '学习重点：先读懂 TSH–FT4 组合，再问药物、妊娠、心脏和垂体线索。'
    }),
    make({
      id: 'hyponatremia', group: '电解质急症', title: '低钠伴头痛、恶心和意识改变',
      intro: '患者血钠降低并出现神经系统症状。请先判断是否为低渗性低钠、容量状态和严重症状，再排查甲状腺/肾上腺。',
      demographics: { ages: [43, 59, 72, 84], sexes: ['男', '女'], jobs: ['退休人员', '教师', '销售', '照护家属'] },
      complaints: ['头痛、恶心、注意力下降', '检查发现血钠低', '近期开始利尿剂或精神科药物'],
      history: [
        { id: 'neuro', question: '有无呕吐、嗜睡、癫痫、意识改变或进行性头痛？', answer: '出现嗜睡和一次呕吐，家属觉得反应变慢。', why: '严重神经症状决定急诊监护和纠正速度。', redFlag: true },
        { id: 'fluid', question: '饮水、腹泻呕吐、利尿剂和心肾肝病史？', answer: '近期为“排毒”每天大量饮水，并使用噻嗪类利尿剂。', why: '低容量、正常容量和高容量病因不同，药物/饮水可能是关键。', sensitive: false },
        { id: 'endo', question: '有无甲减、肾上腺功能减退、肺病或恶性肿瘤线索？', answer: '没有已知甲减或肾上腺病；近期咳嗽两周。', why: 'SIADH、肾上腺功能减退和甲减需要按病史排查。', sensitive: true }
      ],
      exams: [
        { id: 'neuro', label: '神经状态', result: '嗜睡但可唤醒，无癫痫发作；定向力略差。', meaning: '有神经症状时要提高紧迫度，并在监护下纠正，避免过快或过度纠正。', redFlag: true },
        { id: 'volume', label: '容量状态', result: '无明显水肿，口腔黏膜略干，卧立位心率变化明显。', meaning: '提示低容量线索，但需结合尿钠/尿渗透压而非单凭查体。' },
        { id: 'lung', label: '肺部与其他体征', result: '无明显肺水肿；轻咳。', meaning: '若持续咳嗽需按症状排查肺部诱因。' }
      ],
      tests: [
        { id: 'serum', name: '血清渗透压、血糖、尿素氮/肌酐', stage: '立即', workupId: 'sodium-low', result: '血钠 121 mmol/L，血清渗透压降低；血糖不高，eGFR 尚可。', interpretation: '支持低渗性低钠；需根据症状和下降速度升级处理。', why: '先确认是不是低渗性低钠。', essential: true, redFlag: true },
        { id: 'urine', name: '尿渗透压与尿钠', stage: '同步', workupId: 'sodium-low', result: '尿液未被充分稀释，尿钠偏高；需结合利尿剂解释。', interpretation: '结果支持进一步考虑 SIADH 等方向，但利尿剂可干扰判断。', why: '帮助容量和病因分型。', essential: true },
        { id: 'endo', name: '晨间皮质醇、TSH/FT4', stage: '同步/按病因', workupId: 'cortisol-low', result: '需排除肾上腺功能减退和甲减后再归因于 SIADH。', interpretation: '低钠不能只归因于饮水或利尿剂。', why: '内分泌病因可逆且不能漏诊。', essential: true }
      ],
      decisions: [
        { id: 'severe', label: '按有神经症状的低渗性低钠升级监护，控制纠正速度并同步查病因', correct: true, why: '症状和纠正速度比单个数字更决定风险；需防止渗透性脱髓鞘。', links: [{ type: 'workup', id: 'sodium-low', label: '打开低钠追查' }] },
        { id: 'water-only', label: '只嘱咐少喝水，门诊一周后复查', correct: false, why: '神经症状和 Na 121 mmol/L 需要急诊级别评估。' },
        { id: 'siadh-now', label: '尿钠高就直接诊断 SIADH，不查皮质醇和甲功', correct: false, why: '利尿剂、肾上腺和甲状腺疾病均可混淆结果。' }
      ],
      source: ['低钠血症的中国专家共识.pdf', '高渗盐水和纠正方案需在监护条件下按急症指南与本地流程执行，本模拟器不提供固定剂量'],
      note: '学习重点：先判定低渗性和症状严重度，再按容量/尿液指标和内分泌原因分层。'
    }),
    make({
      id: 'pheochromocytoma', group: '肾上腺', title: '阵发性头痛、心悸与高血压',
      intro: '患者反复出现头痛、心悸、出汗和血压骤升。请规范采集甲氧基儿茶酚胺类，避免先做穿刺或只凭影像诊断。',
      demographics: { ages: [28, 40, 51, 63], sexes: ['男', '女'], jobs: ['程序员', '教师', '工程师', '销售'] },
      complaints: ['阵发性头痛、心悸、出汗', '血压忽高忽低', '肾上腺偶发结节'],
      history: [
        { id: 'attack', question: '发作持续多久，是否伴面色改变、震颤、胸痛或晕厥？', answer: '每次约 20–30 分钟，伴心悸、出汗和剧烈头痛，无晕厥。', why: '典型阵发性症状提示儿茶酚胺过多，需评估心血管风险。', redFlag: true },
        { id: 'drugs', question: '是否使用减充血剂、兴奋剂、抗抑郁药或大量咖啡因？', answer: '每天大量咖啡，偶尔使用含伪麻黄碱的感冒药。', why: '药物和应激可造成假阳性，需要在采样前核对。', sensitive: false },
        { id: 'family', question: '家族中有嗜铬细胞瘤、甲状腺髓样癌、甲旁亢或遗传综合征吗？', answer: '父亲曾有“肾上腺肿瘤”，具体不清楚。', why: '家族史可能提示遗传性嗜铬细胞瘤/副神经节瘤。', sensitive: true }
      ],
      exams: [
        { id: 'bp', label: '血压、心率与心脏', result: '发作间歇 BP 150/92 mmHg，HR 96/min；无肺水肿。', meaning: '需记录发作期和间歇期，并评估心肌损伤和心律。' },
        { id: 'abdomen', label: '腹部与体位', result: '腹部无明显包块；站立时头晕。', meaning: '容量和体位变化可影响风险；不要因间歇期血压不高而排除。' },
        { id: 'thyroid', label: '遗传综合征线索', result: '颈部无明显结节；皮肤无典型神经纤维瘤表现。', meaning: '查体阴性不能排除遗传性疾病，需结合家族史和遗传咨询。' }
      ],
      tests: [
        { id: 'metanephrine', name: '血浆游离或尿分馏甲氧基儿茶酚胺', stage: '首轮', workupId: 'metanephrine-high', result: '规范采样后结果明显升高；需复核药物和应激条件。', interpretation: '生化结果支持进一步定位，但检测前条件和结果幅度很重要。', why: '生化确认优先于影像或穿刺。', essential: true },
        { id: 'imaging', name: '肾上腺/全身定位影像', stage: '生化确认后', workupId: 'metanephrine-high', result: '影像发现肾上腺 3 cm 结节；需结合生化和遗传背景。', interpretation: '影像用于定位与分期，不能替代生化诊断。', why: '避免偶发结节误诊。', essential: true },
        { id: 'cardiac', name: '心电图、超声心动图与并发症评估', stage: '同步', workupId: 'metanephrine-high', result: '窦性心动过速，无明显心衰；需要继续评估。', interpretation: '心血管并发症会改变围手术期准备和监护。', why: '先评估风险再讨论治疗。', essential: false }
      ],
      decisions: [
        { id: 'biochem', label: '先规范生化确认，再定位、评估遗传性和心血管风险；避免未准备的穿刺/手术', correct: true, why: '嗜铬细胞瘤路径强调生化优先和围手术期安全准备。', links: [{ type: 'workup', id: 'metanephrine-high', label: '打开甲氧基儿茶酚胺追查' }] },
        { id: 'ct-first', label: '看到肾上腺结节就直接穿刺', correct: false, why: '未排除嗜铬细胞瘤前穿刺可能诱发危象。' },
        { id: 'symptom-ignore', label: '间歇期血压尚可，认为只是焦虑', correct: false, why: '阵发性症状和家族史需要规范生化评估。' }
      ],
      source: ['嗜铬细胞瘤围术期管理专家共识（2025版）.pdf；转移性副神经节瘤和嗜铬细胞瘤诊治专家共识.pdf', '围手术期药物顺序和剂量需由专科按原指南及监护条件制定'],
      note: '学习重点：功能性肾上腺肿瘤先做生化，不要把影像偶发结节当作诊断。'
    }),
    make({
      id: 'cushing', group: '垂体/肾上腺', title: '紫纹、近端肌无力与高血压',
      intro: '患者出现向心性肥胖、紫纹、近端肌无力和难治性高血压。请先排除外源性糖皮质激素，再用推荐筛查试验确认。',
      demographics: { ages: [33, 45, 57, 69], sexes: ['男', '女'], jobs: ['办公室职员', '教师', '销售', '退休人员'] },
      complaints: ['体重增加、紫纹、肌无力', '血压和血糖同时升高', '容易瘀青、月经紊乱'],
      history: [
        { id: 'steroid', question: '口服、吸入、外用、关节腔或保健品中是否含糖皮质激素？', answer: '长期使用含激素的“草本膏”治疗皮炎；具体成分不清楚。', why: '外源性糖皮质激素是常见混淆，需完整核对后再筛查。', redFlag: true },
        { id: 'features', question: '紫纹、近端无力、骨折、感染、情绪/睡眠和月经变化？', answer: '腹部紫纹、爬楼困难、近半年月经不规律。', why: '多系统表现提高内源性高皮质醇可能。', sensitive: true },
        { id: 'red', question: '有无严重低钾、感染、血栓、精神症状或失控高血压/血糖？', answer: '无意识改变，但血压 168/102 mmHg，血糖持续偏高。', why: '并发症严重度影响筛查和转诊优先级。', redFlag: true }
      ],
      exams: [
        { id: 'appearance', label: '体型、皮肤与肌力', result: 'BMI 31 kg/m²，面部圆、皮肤薄，腹部宽紫纹；髋带肌力下降。', meaning: '表型支持进一步筛查，但单一体征不能确诊。', redFlag: true },
        { id: 'bp', label: '血压、血糖与感染', result: 'BP 168/102 mmHg，空腹血糖 9.8 mmol/L；无发热。', meaning: '高血压/糖代谢异常属于并发症评估的一部分。' },
        { id: 'bone', label: '骨折和性腺线索', result: '身高下降 2 cm，无近期骨折；月经稀发。', meaning: '骨和性腺受累提示病程影响，需要综合评估。' }
      ],
      tests: [
        { id: 'screen', name: '推荐初筛：1 mg DST、24 h 尿游离皮质醇或午夜唾液皮质醇', stage: '确认高皮质醇', workupId: 'cortisol-high', result: '两种不同方式的筛查结果均异常；需复核药物和假阳性背景。', interpretation: '至少有一致的异常结果后再进入 ACTH 分层；随机血皮质醇不能作为唯一筛查。', why: '筛查和定位是不同步骤。', essential: true },
        { id: 'acth', name: 'ACTH 分层与垂体/肾上腺定位', stage: '确认后', workupId: 'cortisol-high', result: 'ACTH 处于可疑范围，需按指南决定垂体 MRI、肾上腺影像或进一步试验。', interpretation: '不能跳过 ACTH 直接做手术或把影像当病因。', why: '确定 ACTH 依赖性。', essential: true },
        { id: 'complications', name: '骨、糖脂代谢、血压和感染评估', stage: '同步', workupId: 'cortisol-high', result: 'HbA1c、脂质、骨密度和感染风险需按病史评估。', interpretation: '并发症治疗与病因处理并行。', why: '高皮质醇是多系统疾病。', essential: false }
      ],
      decisions: [
        { id: 'screen-first', label: '先排外源性激素，再用推荐筛查试验确认，随后按 ACTH 分层定位', correct: true, why: '随机皮质醇和单一影像都不能替代规范筛查与分层。', links: [{ type: 'workup', id: 'cortisol-high', label: '打开高皮质醇追查' }] },
        { id: 'random', label: '抽一次随机血皮质醇正常就排除库欣', correct: false, why: '随机血皮质醇受节律影响，不能作为唯一筛查。' },
        { id: 'imaging-first', label: '先做肾上腺 CT，看到结节即诊断', correct: false, why: '影像定位必须建立在生化确认和分层之后。' }
      ],
      source: ['库欣病诊治专家共识(2025).pdf；2026 KES／JES联合共识声明：库欣病的诊断.pdf', '筛查试验受药物、睡眠、抑郁/酒精和急性病影响，需由专科解释'],
      note: '学习重点：先问清楚所有激素暴露；筛查、确认、分层、定位不能混成一步。'
    }),
    make({
      id: 'obesity', group: '肥胖与体重管理', title: '肥胖合并 2 型糖尿病和睡眠呼吸暂停',
      intro: '患者 BMI 和腰围升高，同时有糖尿病、脂肪肝和打鼾。请从并发症、药物目标、行为支持和减重治疗分层。',
      demographics: { ages: [39, 51, 62], sexes: ['男', '女'], jobs: ['办公室职员', '司机', '个体经营者'] },
      complaints: ['体重持续增加', '血糖控制不佳又担心药物增重', '打鼾和白天嗜睡'],
      history: [
        { id: 'trajectory', question: '体重轨迹、饮食、活动、睡眠和既往减重尝试？', answer: '5 年增加 18 kg；夜间进食，工作久坐；曾短期节食后反弹。', why: '体重管理需要长期行为和环境评估，不能只问“自制力”。', sensitive: true },
        { id: 'complication', question: '糖尿病、血压、脂肪肝、关节痛和生育/妊娠计划？', answer: 'T2D、脂肪肝和膝痛；无近期妊娠计划。', why: '共病和人生阶段会改变治疗选择。', sensitive: true },
        { id: 'eating', question: '是否有暴食、抑郁、药物增重或内分泌继发原因线索？', answer: '压力大时会失控进食；正在使用可能增加体重的抗抑郁药。', why: '识别可干预因素和需要心理支持的情况。', sensitive: true }
      ],
      exams: [
        { id: 'anthro', label: 'BMI、腰围和体成分', result: 'BMI 34.6 kg/m²，腰围 112 cm；血压 148/92 mmHg。', meaning: '腹型肥胖和高血压提示较高心代谢风险。' },
        { id: 'sleep', label: '睡眠呼吸暂停筛查', result: '大声打鼾、目击呼吸暂停、白天嗜睡。', meaning: '需按症状进行睡眠评估，治疗睡眠呼吸暂停可改善安全和生活质量。', redFlag: true },
        { id: 'mental', label: '情绪、暴食与功能', result: '压力相关失控进食，膝痛限制运动；无自伤想法。', meaning: '制定可执行计划，必要时转介心理/营养/运动团队。' }
      ],
      tests: [
        { id: 'metabolic', name: 'HbA1c、血压、脂质、肝肾功能', stage: '首轮', workupId: 'obesity-measures', result: 'HbA1c 8.4%，甘油三酯升高，ALT 轻度升高，eGFR 68。', interpretation: '减重和糖尿病治疗目标需要共同制定，兼顾心肾代谢获益和低血糖风险。', why: '选择治疗前先明确共病。', essential: true },
        { id: 'sleep-test', name: '睡眠监测（按症状）', stage: '首轮/转诊', workupId: 'obesity-measures', result: '建议进行睡眠呼吸暂停诊断性评估。', interpretation: '不是所有嗜睡都归因于肥胖；需确认并处理。', why: '影响安全、血压和体重管理。', essential: true },
        { id: 'secondary', name: '继发性肥胖筛查（按病史）', stage: '按需', workupId: 'cortisol-high', result: '无明显库欣特异体征；药物、睡眠和行为因素更突出。', interpretation: '没有指征时不做无差别激素套餐；有红旗再进入相应路径。', why: '避免过度检查和误诊。', essential: false }
      ],
      decisions: [
        { id: 'integrated', label: '制定以健康获益为目标的综合减重计划，并把糖尿病、睡眠和心理/功能共病一起管理', correct: true, why: '肥胖治疗是长期综合管理，药物/手术适应证需要结合 BMI、共病、偏好和禁忌。', links: [{ type: 'workup', id: 'obesity-measures', label: '打开肥胖指标追查' }] },
        { id: 'willpower', label: '只要求少吃多动，不询问睡眠、药物和暴食', correct: false, why: '忽略共病和环境会降低可持续性，也可能漏掉可治疗原因。' },
        { id: 'cosmetic', label: '只以体重数字为目标，不管血糖、血压和功能', correct: false, why: '指南强调健康结局、共病和功能，而非单一体重数字。' }
      ],
      source: ['2026 ADA 糖尿病诊疗标准.pdf；2026 ADA超重和肥胖诊疗标准：成人肥胖的药物治疗(译).pdf；国家基层肥胖症综合管理技术指南（2025）.pdf', '具体减重药物剂量和禁忌需在药物剂量卡、说明书和个体共病中核对'],
      note: '学习重点：肥胖是慢性疾病；把体重、血糖、睡眠、心理和功能放进同一张计划。'
    }),
    make({
      id: 'pcos', group: '性腺与生殖', title: '月经稀发、多毛与代谢风险',
      intro: '育龄期患者月经稀发、痤疮和多毛。请先排除妊娠和其他内分泌病，再根据诊断标准判断 PCOS 表型和代谢风险。',
      demographics: { ages: [19, 27, 34], sexes: ['女'], jobs: ['大学生', '教师', '设计师'] },
      complaints: ['月经 2–3 个月一次', '面部痤疮、多毛', '备孕困难或担心多囊卵巢'],
      history: [
        { id: 'cycle', question: '初潮、月经周期、末次月经和妊娠可能？', answer: '近一年周期 50–70 天不等；末次月经 8 周前，近期无避孕。', why: '先排除妊娠，确认排卵障碍时间线。', redFlag: true },
        { id: 'androgen', question: '多毛/痤疮何时出现，是否快速进展、声音变粗或肌肉增加？', answer: '多毛逐渐增加，无声音改变和快速男性化。', why: '快速男性化需排除分泌雄激素肿瘤。', redFlag: true },
        { id: 'metabolic', question: '体重、家族糖尿病、睡眠和情绪？', answer: 'BMI 29，母亲患糖尿病；近来情绪低落但无自伤想法。', why: 'PCOS 与糖代谢、睡眠和心理健康相关。', sensitive: true }
      ],
      exams: [
        { id: 'androgen', label: '多毛、痤疮和男性化体征', result: '轻中度多毛和痤疮，无声音粗、阴蒂增大等快速男性化。', meaning: '表型提示高雄激素，但要结合生化和病程。', redFlag: true },
        { id: 'anthro', label: 'BMI、腰围与血压', result: 'BMI 29.3 kg/m²，腰围 91 cm，BP 132/84 mmHg。', meaning: '代谢风险需要与生殖症状并行处理。' },
        { id: 'thyroid', label: '甲状腺、乳房和溢乳线索', result: '甲状腺无明显肿大，无乳溢。', meaning: '甲减和高泌乳素是月经紊乱的常见鉴别。' }
      ],
      tests: [
        { id: 'preg', name: '妊娠检测、TSH、泌乳素、17-OHP', stage: '首轮排除', workupId: 'pcos-androgen', result: '妊娠阴性，TSH/泌乳素未见明显异常，17-OHP 不支持非经典先天性肾上腺增生。', interpretation: '完成常见鉴别后，再结合高雄激素和排卵障碍评估 PCOS。', why: 'PCOS 是排除性诊断框架，不是只看超声。', essential: true },
        { id: 'androgen', name: '总/游离睾酮、DHEAS（按需）', stage: '首轮', workupId: 'pcos-androgen', result: '总睾酮轻度升高，DHEAS 未明显升高。', interpretation: '支持生化高雄激素；明显极高或快速进展需转入肿瘤排查。', why: '确定高雄激素来源和严重度。', essential: true },
        { id: 'metabolic', name: '糖耐量/血糖、脂质和睡眠心理评估', stage: '首轮', workupId: 'pcos-androgen', result: 'OGTT 提示糖代谢风险增加；脂质轻度异常。', interpretation: '代谢风险需要长期随访，不能只处理月经。', why: 'PCOS 是全身代谢和生殖疾病。', essential: true }
      ],
      decisions: [
        { id: 'pcos-path', label: '排除妊娠、甲减、泌乳素异常和非经典 CAH 后，结合高雄激素/排卵障碍分层管理', correct: true, why: 'PCOS 诊断需要排除其他病因，并根据生育计划和代谢风险制定方案。', links: [{ type: 'workup', id: 'pcos-androgen', label: '打开 PCOS/雄激素追查' }] },
        { id: 'ultrasound-only', label: '只因超声有多囊样卵巢就确诊', correct: false, why: '超声不能替代症状、生化和排除其他病因。' },
        { id: 'tumor', label: '轻度逐渐多毛就按雄激素肿瘤处理', correct: false, why: '肿瘤线索是快速男性化或雄激素显著升高，需按风险分层。' }
      ],
      source: ['国际循证 PCOS 指南及内分泌/妇科相关指南：诊断排除、雄激素、代谢风险和生育计划', '药物选择需结合妊娠可能、生育目标、禁忌和共同决策'],
      note: '学习重点：PCOS 不是一张超声报告；先排除，再按生殖、代谢和心理目标分层。'
    }),
    make({
      id: 'diabetic-foot', group: '糖尿病并发症', title: '足部溃疡、红肿与发热',
      intro: '糖尿病患者足部出现破溃和红肿。请同时评估感染严重度、缺血、神经病变和骨髓炎，并决定是否急诊/多学科处理。',
      demographics: { ages: [56, 64, 73], sexes: ['男', '女'], jobs: ['退休人员', '司机', '个体经营者'] },
      complaints: ['足底溃疡', '足部红肿、渗液、发热', '脚麻但不太疼'],
      history: [
        { id: 'infection', question: '红肿范围、脓液、恶臭、发热寒战和进展速度？', answer: '3 天内红肿扩大，有脓性渗液和发热 38.2℃。', why: '感染范围和全身反应决定分级和转诊。', redFlag: true },
        { id: 'ischemia', question: '静息痛、夜间痛、既往截肢/血管病和行走距离？', answer: '夜间足趾痛，既往有吸烟史和冠心病。', why: '缺血会影响愈合和感染处理，需同步血管评估。', redFlag: true },
        { id: 'care', question: '足部护理、鞋袜、减压、既往培养和抗菌药使用？', answer: '穿硬底鞋，未规律减压；自行吃过两天抗菌药。', why: '减压、抗菌药暴露和既往病原影响评估。', sensitive: true }
      ],
      exams: [
        { id: 'wound', label: '溃疡测量、探针触骨与坏死', result: '足底溃疡 2 cm，边缘红肿，探针可触及骨；无明显坏疽。', meaning: '探针触骨和深部感染线索提高骨髓炎可能，需要影像/培养。', redFlag: true },
        { id: 'vascular', label: '足背动脉、皮温和 ABI/TBI 线索', result: '足部偏凉，足背动脉弱；需要 ABI/TBI 或血管专科评估。', meaning: '缺血与感染并存时需多学科、快速分流。', redFlag: true },
        { id: 'neuro', label: '10 g 单丝、振动觉和畸形', result: '10 g 单丝感觉减退，足弓压力点明显。', meaning: '神经病变和压力点是溃疡复发风险。' }
      ],
      tests: [
        { id: 'infection', name: '血常规、CRP/ESR、肾功能与血培养（按全身反应）', stage: '立即', workupId: 'diabetic-foot', result: '白细胞和 CRP 升高；肾功能需核对后决定抗菌药安全。', interpretation: '结合临床感染分级，不能单凭炎症指标判断严重度。', why: '评估全身感染和治疗安全。', essential: true, redFlag: true },
        { id: 'bone', name: '足部 X 线；疑骨髓炎时 MRI；深部组织培养', stage: '立即/按需', workupId: 'diabetic-foot', result: 'X 线早期不确定；因探针触骨和深部溃疡考虑 MRI，培养应取深部组织。', interpretation: '影像和培养共同决定骨髓炎/深部感染路径，表面拭子不能替代深部标本。', why: '确定深度和病原。', essential: true },
        { id: 'vascular', name: 'ABI/TBI、足部血流和必要时血管影像', stage: '同步', workupId: 'diabetic-foot', result: 'ABI 受血管钙化影响需结合 TBI/波形；血管专科评估缺血。', interpretation: '正常 ABI 也不能完全排除缺血，尤其有糖尿病和钙化时。', why: '缺血决定愈合与保肢策略。', essential: true }
      ],
      decisions: [
        { id: 'urgent', label: '按至少中度感染线索/疑骨髓炎并缺血风险快速转入足病多学科路径，完成减压、培养、影像和血流评估', correct: true, why: '发热、扩大红肿、探针触骨和缺血线索不适合延迟门诊观察；最终感染严重度仍需按指南完整分级。', links: [{ type: 'workup', id: 'diabetic-foot', label: '打开糖尿病足追查' }] },
        { id: 'oral-self', label: '继续自行口服抗菌药，等一周观察', correct: false, why: '深部感染/缺血可能需要住院、多学科和手术评估。' },
        { id: 'wound-only', label: '只换药不评估血流、神经和骨髓炎', correct: false, why: '糖尿病足是感染、缺血、神经和压力共同问题。' }
      ],
      source: ['中国糖尿病足诊治临床路径（2023版）.pdf；中国糖尿病足防治实践指南.pdf；糖尿病足溃疡创面治疗专家共识(2024).pdf', '抗菌药具体选择、剂量和疗程需按感染严重度、培养、肾功能和当地规范核对'],
      note: '学习重点：糖尿病足要同时问感染、缺血、神经和减压；“红肿”不是完整诊断。'
    }),
    make({
      id: 'gestational-diabetes', group: '糖尿病特殊人群', title: '妊娠期 75 g OGTT 异常',
      intro: '孕妇在规定孕周进行 75 g OGTT 后出现异常。请明确诊断、母胎风险、监测和分娩后随访，不把妊娠期路径套用到普通成人。',
      demographics: { ages: [27, 31, 36], sexes: ['女'], jobs: ['教师', '职员', '护士'] },
      complaints: ['产检发现 OGTT 异常', '餐后血糖偏高', '担心需要胰岛素和宝宝安全'],
      history: [
        { id: 'preg', question: '孕周、既往妊娠糖尿病、胎儿生长和妊娠并发症？', answer: '孕 26 周，上一胎有妊娠糖尿病；目前超声提示胎儿偏大趋势。', why: '孕周和既往史改变筛查与管理强度。', sensitive: false },
        { id: 'diet', question: '饮食、恶心呕吐、运动和低血糖症状？', answer: '早孕后食欲波动，餐后血糖常高；没有低血糖。', why: '饮食与监测计划需适应妊娠和耐受。' },
        { id: 'risk', question: '高血压、肾病、视网膜病变或正在用药？', answer: '无肾病和视网膜病变；未用降糖药。', why: '妊娠前/期并发症会影响目标和分娩计划。', sensitive: true }
      ],
      exams: [
        { id: 'vitals', label: '体重、血压和水肿', result: 'BP 132/82 mmHg，无明显水肿；体重增长略快。', meaning: '妊娠期血压和体重需动态记录。' },
        { id: 'fetal', label: '产科和胎儿生长信息', result: '胎儿估重偏大趋势，羊水量尚可。', meaning: '胎儿生长和羊水变化会影响监测和分娩讨论。' },
        { id: 'education', label: '自我监测和注射能力', result: '患者愿意监测，但担心针头；家属可协助。', meaning: '教育和可及性是治疗方案可实施性的组成部分。' }
      ],
      tests: [
        { id: 'ogtt', name: '75 g OGTT 三点结果', stage: '诊断', workupId: 'glucose-high', result: '空腹和 1/2 小时中至少一项达到妊娠期诊断标准；需按原始报告确认。', interpretation: '按妊娠期标准诊断和分层，不直接套用非妊娠阈值。', why: '妊娠期阈值和目标不同。', essential: true },
        { id: 'monitor', name: '空腹/餐后血糖或 CGM 记录', stage: '首轮管理', workupId: 'glucose-high', result: '餐后峰值反复偏高；未见明显低血糖。', interpretation: '用于评估饮食和治疗反应，目标需按产科/糖尿病指南和个体情况制定。', why: '监测结果指导是否升级治疗。', essential: true },
        { id: 'complication', name: '肾脏、眼底和胎儿监测（按风险）', stage: '同步', workupId: 'kidney-albuminuria', result: '根据既往糖尿病类型和孕周安排；本模拟不预设全部结果。', interpretation: '孕期需要母体和胎儿双向随访。', why: '避免只看血糖。', essential: false }
      ],
      decisions: [
        { id: 'gdm', label: '按妊娠期糖尿病路径进行饮食/运动、血糖监测、必要时胰岛素和产科协同随访', correct: true, why: '妊娠是特殊人群，目标、药物和胎儿监测需单独依据指南。', links: [{ type: 'workup', id: 'glucose-high', label: '打开妊娠期血糖追查' }] },
        { id: 'adult-path', label: '按普通成人 2 型糖尿病自行选择所有降糖药', correct: false, why: '妊娠期药物胎盘暴露、证据和安全边界不同。' },
        { id: 'ignore', label: '只等分娩后再处理餐后高血糖', correct: false, why: '孕期血糖和胎儿风险需要现在管理。' }
      ],
      source: ['2026 ADA 糖尿病诊疗标准.pdf；妊娠期糖尿病相关指南', '妊娠期具体目标和胰岛素剂量需按产科/糖尿病专科原文和个体监测核对'],
      note: '学习重点：妊娠期糖尿病要把母体血糖、胎儿生长、药物安全和产后随访连起来。'
    }),
    make({
      id: 'hypoparathyroidism', group: '骨与矿物质', title: '手足搐搦、口周麻木与低钙',
      intro: '患者出现口周麻木、手足搐搦和 QT 延长。请先确认离子钙/镁和心电安全，再区分术后、免疫和维生素 D 等病因。',
      demographics: { ages: [32, 48, 66], sexes: ['男', '女'], jobs: ['护士', '职员', '退休人员'] },
      complaints: ['口周麻木、手足抽搐', '甲状腺手术后低钙', '心电图 QT 延长'],
      history: [
        { id: 'acute', question: '有无喉痉挛、癫痫、明显心悸或晕厥？', answer: '出现手足搐搦和心悸，没有喉痉挛或晕厥。', why: '症状性低钙和 QT 延长需要急诊监护。', redFlag: true },
        { id: 'surgery', question: '甲状腺/甲状旁腺手术、放疗、颈部损伤和病程？', answer: '3 个月前做了甲状腺手术，术后反复手足麻木。', why: '术后甲状旁腺功能减退是重要病因。', sensitive: false },
        { id: 'vitd', question: '维生素 D、钙、镁摄入，腹泻和肾病？', answer: '近期腹泻，未规律补充；无慢性肾病。', why: '低镁、吸收不良和维生素 D 缺乏可造成或加重低钙。', sensitive: true }
      ],
      exams: [
        { id: 'ecg', label: '心电图与神经肌肉', result: 'QTc 延长，Chvostek 征阳性；意识清楚。', meaning: '提示症状性低钙心律风险，应先按急症路径。', redFlag: true },
        { id: 'neck', label: '颈部术后和伤口', result: '手术瘢痕愈合；无感染表现。', meaning: '支持术后病因线索，但需生化确认。' },
        { id: 'renal', label: '容量和肾功能', result: '无明显脱水；肌酐正常。', meaning: '肾功能影响长期钙磷治疗和监测。' }
      ],
      tests: [
        { id: 'ca', name: '离子钙/总钙、白蛋白、镁、磷', stage: '立即', workupId: 'calcium-low', result: '离子钙降低，磷升高，镁偏低。', interpretation: '确认真性低钙并识别低镁这一可逆加重因素。', why: '不能只看总钙。', essential: true, redFlag: true },
        { id: 'pth', name: 'PTH、25(OH)D、肾功能', stage: '首轮/病因', workupId: 'calcium-low', result: 'PTH 不适当偏低；25(OH)D 待补充。', interpretation: '低钙伴低/不适当正常 PTH 支持甲状旁腺功能减退方向。', why: '区分 PTH 缺乏、维生素 D 缺乏和 CKD。', essential: true },
        { id: 'urine', name: '尿钙与长期并发症监测', stage: '稳定后', workupId: 'calcium-low', result: '长期治疗需监测尿钙、肾脏影像和钙磷乘积。', interpretation: '治疗目标不仅是血钙，还要避免高尿钙和肾脏并发症。', why: '长期安全监测。', essential: false }
      ],
      decisions: [
        { id: 'acute', label: '先按症状性低钙/QT 延长急症监护并纠正低镁，稳定后明确术后病因和长期监测', correct: true, why: '症状和心电异常优先；低镁不纠正会使低钙难以改善。', links: [{ type: 'workup', id: 'calcium-low', label: '打开低钙/PTH 追查' }] },
        { id: 'vitd-only', label: '只补维生素 D，忽略心电图和低镁', correct: false, why: '急性症状性低钙需要监护和即时安全处理。' },
        { id: 'total-only', label: '总钙接近正常就排除低钙', correct: false, why: '白蛋白和酸碱影响总钙，症状时应结合离子钙。' }
      ],
      source: ['2026 波兰立场声明：甲状旁腺功能减退的治疗（更新版）.pdf', '急性补钙和长期替代方案需由监护团队按指南和实验室结果执行'],
      note: '学习重点：低钙要看症状、离子钙、镁、PTH 和心电图，不能只看一张化验单。'
    }),
    make({
      id: 'male-hypogonadism', group: '性腺与生殖', title: '性欲下降、勃起困难与低晨间睾酮',
      intro: '成年男性持续性欲下降、勃起困难和乏力。请确认症状与重复晨间睾酮，再按 LH/FSH 和泌乳素分层。',
      demographics: { ages: [36, 49, 62], sexes: ['男'], jobs: ['工程师', '教师', '销售'] },
      complaints: ['性欲下降、勃起困难', '乏力、肌肉量减少', '体检睾酮偏低'],
      history: [
        { id: 'sexual', question: '症状持续时间、晨勃、性欲、射精和生育计划？', answer: '症状持续 8 个月，晨勃减少；近期仍有生育计划。', why: '确认症状并先问生育目标，因为治疗选择不同。', sensitive: true },
        { id: 'illness', question: '肥胖、睡眠呼吸暂停、急性病、阿片/糖皮质激素和饮酒？', answer: 'BMI 31，打鼾；未用阿片或糖皮质激素。', why: '可逆共病和药物可导致功能性低睾酮。', sensitive: true },
        { id: 'pituitary', question: '头痛、视野改变、乳溢或嗅觉变化？', answer: '无头痛和视野改变；无乳溢。', why: '提示是否需要垂体路径和泌乳素检查。', redFlag: true }
      ],
      exams: [
        { id: 'body', label: 'BMI、体毛、肌力和乳房', result: 'BMI 31，体毛减少，轻度乳房发育；无睾丸肿块。', meaning: '提示性腺轴问题和肥胖相关因素，需结合激素。' },
        { id: 'testis', label: '睾丸体积与外生殖器', result: '双侧睾丸体积偏小，无压痛或肿块。', meaning: '有助于区分原发/继发性方向，需专科规范测量。' },
        { id: 'red', label: '垂体红旗', result: '无视野缺损、剧烈头痛或意识改变。', meaning: '无红旗不能排除垂体病变，但可按稳定路径分层。', redFlag: true }
      ],
      tests: [
        { id: 'testosterone', name: '两次不同日晨间总睾酮（必要时 SHBG/游离睾酮）', stage: '确认', workupId: 'gynecomastia-hypogonadism', result: '两次晨间总睾酮均低；需结合检测方法和 SHBG。', interpretation: '症状和重复低值共同支持低睾酮；单次结果不足以确诊。', why: '确认可重复性。', essential: true },
        { id: 'lhfsh', name: 'LH/FSH、泌乳素、TSH/FT4', stage: '分层', workupId: 'gynecomastia-hypogonadism', result: 'LH/FSH 偏低或不适当正常；泌乳素需复核。', interpretation: '提示继发性/中枢性方向，需查肥胖、药物、垂体病因和生育计划。', why: '区分原发和继发。', essential: true },
        { id: 'fertility', name: '精液分析和生育评估（按计划）', stage: '共同决策', workupId: 'gynecomastia-hypogonadism', result: '如有生育计划，先进行生育相关评估。', interpretation: '不能在未讨论生育的情况下直接进入替代治疗。', why: '治疗目标与患者计划一致。', essential: false }
      ],
      decisions: [
        { id: 'confirm', label: '重复晨间睾酮并按 LH/FSH、泌乳素、药物/肥胖和生育目标分层', correct: true, why: '低睾酮诊断和治疗需要症状、重复检测和病因评估。', links: [{ type: 'workup', id: 'gynecomastia-hypogonadism', label: '打开低睾酮/乳房发育追查' }] },
        { id: 'single', label: '单次低睾酮就开始替代治疗，不问生育计划', correct: false, why: '单次低值和未讨论生育可能造成错误治疗。' },
        { id: 'age', label: '把所有症状归咎于年龄，不做复测', correct: false, why: '持续症状和重复低值需要进一步分层。' }
      ],
      source: ['男性性腺功能减退相关指南：症状、晨间睾酮重复确认、LH/FSH、泌乳素、生育和安全评估', '睾酮制剂适应证、禁忌和剂量需在药物卡/原指南中按生育、前列腺和心血管风险核对'],
      note: '学习重点：低睾酮不是单个数字；先确认、分原发/继发，再讨论生育和治疗。'
    }),
    make({
      id: 'growth-delay', group: '儿童生长发育', title: '身高增长速度下降',
      intro: '儿童身高曲线下移、生长速度减慢。请先确认测量和生长趋势，再排营养、甲减、慢性病和生长激素轴。',
      demographics: { ages: [7, 10, 13], sexes: ['男', '女'], jobs: ['学生'] },
      complaints: ['近两年长得慢', '身高百分位下滑', '家长担心生长激素缺乏'],
      history: [
        { id: 'growth', question: '过去 2–3 年身高、体重、测量间隔和青春期变化？', answer: '身高百分位从 25 降到 8，近一年生长速度偏慢；体重也略下降。', why: '连续生长趋势比单次身高更重要。', redFlag: true },
        { id: 'family', question: '父母身高、家族青春期时间和出生情况？', answer: '父亲 170 cm，母亲 158 cm；出生足月，无严重新生儿问题。', why: '靶身高和家族性矮身材帮助区分正常变异。', sensitive: false },
        { id: 'chronic', question: '腹泻、腹痛、慢性咳嗽、头痛/视野和长期用药？', answer: '反复腹痛和食欲下降；无头痛和视野改变。', why: '慢性病和垂体占位是重要鉴别。', redFlag: true }
      ],
      exams: [
        { id: 'anthro', label: '规范身高、体重、坐高和体态', result: '身高 SDS 约 -1.8，生长速度下降；体重 SDS 也下降。', meaning: '体重先下降提示营养/慢性病可能，不能直接跳到 GH 缺乏。' },
        { id: 'puberty', label: '青春期分期与甲状腺', result: '青春期尚未启动，甲状腺无明显肿大。', meaning: '需结合年龄、骨龄和家族青春期时间。' },
        { id: 'neuro', label: '神经和视野红旗', result: '无头痛、呕吐、视野异常。', meaning: '出现这些表现需加快垂体影像。', redFlag: true }
      ],
      tests: [
        { id: 'basic', name: '血常规、炎症、肝肾、营养与乳糜泻筛查（按病史）', stage: '首轮', workupId: 'growth-igf1', result: '血常规轻度贫血，需进一步排查营养和慢性炎症。', interpretation: '先排常见可逆原因，避免把矮小直接归因于 GH。', why: '基础评估建立先验概率。', essential: true },
        { id: 'thyroid', name: 'TSH/FT4、骨龄与 IGF-1', stage: '首轮', workupId: 'growth-igf1', result: 'TSH/FT4 正常；骨龄落后，IGF-1 偏低但需按年龄解释。', interpretation: 'IGF-1 低是线索，不等于 GH 缺乏；营养和慢性病可影响结果。', why: '避免单项误诊。', essential: true },
        { id: 'gh', name: 'GH 刺激试验/垂体 MRI（有指征时）', stage: '第二轮', workupId: 'growth-igf1', result: '是否进入刺激试验和 MRI 取决于生长趋势、IGF-1、骨龄和垂体线索。', interpretation: '随机 GH 不能诊断缺乏，需按专科路径确认。', why: '确诊需要动态试验和病因评估。', essential: false }
      ],
      decisions: [
        { id: 'growth-path', label: '先确认生长趋势和基础病因，再按先验概率决定 IGF-1、刺激试验和垂体影像', correct: true, why: '生长评估不能靠随机 GH 或单次身高，需结合年龄、骨龄、营养和慢性病。', links: [{ type: 'workup', id: 'growth-igf1', label: '打开生长/IGF-1 追查' }] },
        { id: 'random-gh', label: '抽一次随机 GH 偏低就诊断生长激素缺乏', correct: false, why: 'GH 呈脉冲分泌，随机值不能确诊。' },
        { id: 'height-only', label: '只看身高，不问体重、慢性病和青春期', correct: false, why: '生长曲线和全身病因需要一起评估。' }
      ],
      source: ['儿童生长评估和生长激素缺乏相关指南/共识：生长速度、骨龄、IGF-1、动态试验与 MRI', '生长激素治疗适应证、剂量和监测需由儿科内分泌专科依据原指南执行'],
      note: '学习重点：先确认生长趋势，再排常见病因；随机 GH 不能诊断。'
    })
  ];
})();
