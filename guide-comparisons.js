window.GUIDELINE_COMPARISONS = [
  {
    id: 'evidence-systems',
    category: '证据体系',
    status: '不可直接比较',
    title: 'A、1A、Ⅱa B 和 1b：不是同一把尺子',
    question: '看到不同字母或罗马数字时，能不能按“数字越小、字母越前”直接排序？',
    rows: [
      { guide: 'ADA A/B/C/E', recommendation: '表示 ADA 自己的证据质量分层；A 最高，E 为专家共识，ADA 体系没有 D。', scope: '只在 ADA 推荐内部解释。' },
      { guide: 'GRADE 1/2 + A–D', recommendation: '数字通常表示推荐强弱，字母或四级圆点表示证据质量；强推荐不等于证据必然最高。', scope: '必须先看该指南的方法学图例。' },
      { guide: 'AHA Ⅰ/Ⅱa/Ⅱb/Ⅲ + A/B/C', recommendation: '罗马数字表示推荐类别，字母表示证据水平；Ⅱb 不是“二级证据”。', scope: '适用于采用 AHA/ACC 体系的指南。' },
      { guide: 'Oxford CEBM 1a–5', recommendation: '按研究设计和临床问题给证据层级，与推荐强度不是同一概念。', scope: '不能换算成 ADA 的 A/B/C/E。' }
    ],
    takeaway: '先认分级体系，再读适用人群、推荐动词和限定条件；本站保留原分级，不做跨体系换算。',
    sources: ['ADA 2026《Introduction and Methodology》', 'GRADE Working Group 分级标准', 'AHA 推荐类别与证据水平表', 'Oxford CEBM 2009']
  },
  {
    id: 't2d-initial-no-comorbidity',
    category: '糖尿病用药',
    status: '存在差异',
    title: '无主导共病的 2 型糖尿病：起始用药并不完全相同',
    question: '新诊断、无 ASCVD、心衰或 CKD 的患者，是否固定从二甲双胍加 SGLT2 抑制剂开始？',
    rows: [
      { guide: 'ADA 2026', recommendation: '采用以患者为中心的共同决策，综合降糖效力、体重、低血糖、费用、可及性、不良反应和偏好；可考虑起始联合治疗。', scope: '推荐 9.5｜E；9.6｜A。没有规定所有人固定使用同一二联方案。' },
      { guide: 'AACE 2026', recommendation: '先排主导并发症/共病；无主导条件时进入独立的血糖中心算法，并根据离目标的距离选择治疗强度。', scope: '共病中心与血糖中心两套算法相互衔接。' },
      { guide: 'NICE NG28（2026 更新）', recommendation: '无相关共病时，推荐缓释二甲双胍加 SGLT2 抑制剂；二甲双胍禁忌或不耐受时使用 SGLT2 抑制剂单药。药物需依次引入以识别耐受性。', scope: '推荐 1.13.1–1.13.2、1.20.1–1.20.2；属于英国卫生体系路径。' }
    ],
    takeaway: '这是“路径形成方法和卫生体系”造成的真差异。临床学习时先标明采用哪份指南，不能把 NICE 的固定初始组合误写成 ADA 的统一要求。',
    sources: ['ADA 2026 推荐 9.5–9.6', 'AACE 2026 成人 T2D 管理算法', 'NICE NG28 推荐 1.13.1–1.13.2、1.20.1–1.20.2']
  },
  {
    id: 't2d-ascvd',
    category: '糖尿病用药',
    status: '存在差异',
    title: '合并 ASCVD：药物类别一致，组合写法不同',
    question: '合并动脉粥样硬化性心血管病时，是选有获益的药物类别，还是固定三联？',
    rows: [
      { guide: 'ADA 2026', recommendation: '方案应包括具有心血管事件获益证据的 GLP-1 RA 和/或 SGLT2 抑制剂，不受当前 A1C 是否达标影响。', scope: '推荐 9.7｜A；强调有结局证据的具体制剂。' },
      { guide: 'AACE 2026', recommendation: '先进入共病中心算法；ASCVD/高危时优先具有结局获益的 GLP-1 RA 或 SGLT2 抑制剂，再按血糖需要叠加。', scope: '先处理共病，再进入血糖中心算法。' },
      { guide: 'NICE NG28（2026 更新）', recommendation: 'ASCVD 起始路径更具处方性：缓释二甲双胍、SGLT2 抑制剂和皮下注射司美格鲁肽；司美格鲁肽在该推荐中至每周 1 mg。', scope: '推荐 1.15.1–1.15.2；受英国批准范围与成本效果框架影响。' }
    ],
    takeaway: '三者都把心血管结局置于单纯降糖之前，但 NICE 指定组合和制剂更具体。跨地区使用时必须重新核对当地适应证、可及性和说明书。',
    sources: ['ADA 2026 推荐 9.7｜A', 'AACE 2026 成人 T2D 管理算法', 'NICE NG28 推荐 1.15.1–1.15.2']
  },
  {
    id: 'adult-a1c-target',
    category: '治疗目标',
    status: '存在差异',
    title: '多数非妊娠成人 A1C：<7% 与 ≤6.5% 怎么理解',
    question: '同一个成年人，为什么 ADA 与 AACE 的“通常目标”看起来不同？',
    rows: [
      { guide: 'ADA 2026', recommendation: '多数非妊娠成人通常以 A1C <7% 为起点，再根据低血糖、共病、寿命、治疗负担和偏好收紧或放宽。', scope: '不是所有患者的固定终点。' },
      { guide: 'AACE 2026', recommendation: '多数成人在安全、可实现且负担可接受时，通常以 A1C ≤6.5% 为目标；同样允许因低血糖和共病等因素放宽。', scope: '需与 CGM/血糖、红细胞周转和个体风险共同解释。' }
    ],
    takeaway: '这是目标起点的差异，不是“6.5% 永远优于 7%”。先排低血糖和测量失真，再书写个体化目标及理由。',
    sources: ['ADA 2026《Glycemic Goals and Hypoglycemia》', 'AACE 2026 成人 T2D 管理算法']
  },
  {
    id: 'older-a1c',
    category: '老年糖尿病',
    status: '存在差异',
    title: '老年糖尿病：血糖目标的分层语言不同',
    question: '健康、复杂和衰弱老年患者，如何避免只抄一个 A1C 数字？',
    rows: [
      { guide: 'ADA 2026', recommendation: '健康者通常 A1C <7.0%–7.5%；复杂/中等健康状态可 <8.0%；极复杂或健康差者避免依赖 A1C，重点防低血糖和有症状高血糖。', scope: '推荐 13.7a–13.7c；同时给出 TIR/TBR 目标。' },
      { guide: '中国老年 T2D 指南 2026', recommendation: '良好控制 ≤7.0%；中间过渡 >7.0%–8.0%；可接受 >8.0%–8.5%，并配套空腹和餐后血糖范围。', scope: '结合预期寿命、功能、认知、衰弱和照护条件。' }
    ],
    takeaway: '两者都要求个体化，但分层名称和阈值组合不同。病历应先写健康/功能状态，再写目标，不能只凭年龄放宽。',
    sources: ['ADA 2026 推荐 13.7a–13.7c', '《中国老年2型糖尿病防治临床指南（2026年版）》']
  },
  {
    id: 'older-bp',
    category: '老年糖尿病',
    status: '存在差异',
    title: '老年糖尿病：血压目标与安全下限的表达不同',
    question: '老年患者是否都应追求 <130/80 mmHg？',
    rows: [
      { guide: 'ADA 2026', recommendation: '多数老年人安全可达时以 <130/80 mmHg 为目标；健康差、预期寿命有限或不良反应风险高时可放宽如 <140/90。', scope: '强调心肾获益与治疗伤害平衡。' },
      { guide: '中国老年 T2D 指南 2026', recommendation: '一般 <140/85；已有 DKD/肾损伤可 <130/80；脑梗死或长期控制不良者可 <150/85，并提示不宜低于 110/60。', scope: '更明确写出特定放宽场景和过低血压风险。' }
    ],
    takeaway: '差异主要在默认起点和安全边界的具体写法。实际学习应同时记录直立性症状、跌倒、肾功能、脑血管病和家庭血压。',
    sources: ['ADA 2026《Older Adults》血压框架', '《中国老年2型糖尿病防治临床指南（2026年版）》']
  },
  {
    id: 'prediabetes-scope',
    category: '糖尿病前期',
    status: '不可直接比较',
    title: '糖尿病前期：指南是否覆盖，先于“推荐是否不同”',
    question: 'NICE NG28 没写 ADA 的糖尿病前期方案，能否解释为 NICE 反对？',
    rows: [
      { guide: 'ADA 2026', recommendation: '设有独立预防主题：至少每年监测；结构化生活方式目标减重 5%–7%、每周至少 150 min 中等强度活动；高危亚组可讨论二甲双胍。', scope: '推荐 3.1｜E、3.3｜A、3.7｜A、3.10｜B。' },
      { guide: 'AACE 2026', recommendation: '设有独立糖尿病前期算法，把体重、血糖进展和肥胖相关并发症放入同一风险管理框架。', scope: '属于成人糖尿病管理算法的明确组成。' },
      { guide: 'NICE NG28', recommendation: '主题是成人 2 型糖尿病管理，并非糖尿病前期诊断与预防指南。', scope: '不能用“未覆盖”推断为反对 ADA/AACE。' }
    ],
    takeaway: '先核对指南范围。缺少某条推荐可能只是该指南不处理这个问题，不能制造“指南冲突”。',
    sources: ['ADA 2026《Prevention or Delay of Diabetes》', 'AACE 2026 成人 T2D 管理算法', 'NICE NG28《Type 2 diabetes in adults: management》']
  },
  {
    id: 'cgm-aid-scope',
    category: '糖尿病技术',
    status: '范围不同',
    title: 'CGM 与 AID：广覆盖推荐和 1 型专病共识各有用途',
    question: '一份文件覆盖所有糖尿病，另一份只写 1 型，是否代表推荐冲突？',
    rows: [
      { guide: 'ADA 2026', recommendation: 'CGM 可在起病时或此后用于使用胰岛素者、使用可致低血糖非胰岛素药者，以及任何有助于管理的治疗场景。', scope: '推荐 9.25：胰岛素 A；致低血糖非胰岛素药 B；其他有助管理的治疗 B。' },
      { guide: '中国 1 型糖尿病技术相关共识', recommendation: '聚焦 1 型糖尿病的 CGM、胰岛素泵/AID 选择、教育、数据解读和实施细节。', scope: '专病操作范围更窄，不能反推其他糖尿病人群“不适用”。' }
    ],
    takeaway: 'ADA 回答“哪些人可用”，专病共识更擅长回答“在 1 型糖尿病中怎么实施”。二者是范围互补。',
    sources: ['ADA 2026 推荐 9.25', '中国 1 型糖尿病技术与智能胰岛素输注相关共识']
  },
  {
    id: 'ckd-sglt2-entry',
    category: '糖尿病用药',
    status: '范围不同',
    title: 'SGLT2 抑制剂：器官保护入口不等于降糖效力阈值',
    question: 'eGFR 降低后降糖作用减弱，是否就应停掉器官保护思路？',
    rows: [
      { guide: 'ADA 2026', recommendation: 'T2D 合并确认的 eGFR 20–60 和/或白蛋白尿时，使用有获益证据的 SGLT2 抑制剂或 GLP-1 RA；SGLT2 抑制剂 eGFR <45 时降糖效力减弱。', scope: '推荐 9.10｜A；把降糖效力和心肾结局分开判断。' },
      { guide: 'NICE NG28（2026 更新）', recommendation: '同样强调 SGLT2 抑制剂的心血管和肾脏获益，并在无相关共病的起始路径中也推荐该类药物。', scope: '覆盖面和用药架构不同；还需遵循英国产品限制与病假停药规则。' }
    ],
    takeaway: '“降糖变弱”不能直接等同“器官保护无效”，也不能只凭 eGFR 一个数字决定启停；要核对具体制剂、适应证、容量状态和酮症风险。',
    sources: ['ADA 2026 推荐 9.10｜A', 'NICE NG28 2026 初始用药说明']
  },
  {
    id: 'dpp4-glp1',
    category: '糖尿病用药',
    status: '基本一致',
    title: 'DPP-4 抑制剂与 GLP-1 相关治疗：两份指南都不支持叠加',
    question: '为了“加强肠促胰素作用”，是否可以把 DPP-4 抑制剂和 GLP-1 RA/替尔泊肽一起用？',
    rows: [
      { guide: 'ADA 2026', recommendation: '不推荐 DPP-4 抑制剂与 GLP-1 RA 或双 GIP/GLP-1 RA 同用，因为不能带来额外降糖。', scope: '推荐 9.18｜B。' },
      { guide: 'NICE NG28（2026 更新）', recommendation: '明确不要把 GLP-1 RA 或替尔泊肽与 DPP-4 抑制剂合用。', scope: '属于进一步用药组合限制。' }
    ],
    takeaway: '这是基本一致的禁配方向。若切换到 GLP-1 相关治疗，应重新审查 DPP-4 抑制剂，而不是机械叠加。',
    sources: ['ADA 2026 推荐 9.18｜B', 'NICE NG28 2026《Further medication》']
  },
  {
    id: 'dka-potassium',
    category: '急症',
    status: '基本一致',
    title: 'DKA/HHS 合并低钾：当前路径要求先补钾，再启动胰岛素',
    question: 'DKA 血糖很高时，是否应该马上输入胰岛素和葡萄糖？',
    rows: [
      { guide: '2024 成人高血糖危象国际共识', recommendation: '血钾 <3.5 mmol/L 时先补钾并暂缓胰岛素，通常以 10 mmol/h 开始，直至血钾 >3.5 mmol/L；随后按危象路径启动胰岛素。', scope: '低钾时立即胰岛素可进一步降低血钾并诱发心律失常。' },
      { guide: 'ADA 2026', recommendation: '急性高血糖危象管理沿用当前国际共识框架，先液体、钾和循环评估，再按条件启动胰岛素；葡萄糖在血糖下降到相应节点后加入以继续清除酮体。', scope: '急症需连续监测并使用院内方案。' }
    ],
    takeaway: '这里不是指南冲突，而是必须统一到当前共识的易错点：K <3.5 mmol/L 时先补钾、暂缓胰岛素，不能因高血糖跳过钾处理。',
    sources: ['2024《Hyperglycemic Crises in Adults With Diabetes: A Consensus Report》', 'ADA 2026《Diabetes Care in the Hospital》']
  },
  {
    id: 'obesity-bmi-thresholds',
    category: '肥胖',
    status: '不可直接比较',
    title: 'BMI 数字：诊断切点与治疗入口不能放在同一列',
    question: '看到 BMI 28、30 或亚洲人 27.5，能否认为指南互相矛盾？',
    rows: [
      { guide: '中国成人体重管理指南', recommendation: '中国成人 BMI 24.0–27.9 kg/m² 为超重，≥28.0 kg/m² 为肥胖；中心性肥胖还结合腰围，男性 ≥90 cm、女性 ≥85 cm。', scope: '属于中国成人筛查与诊断框架。' },
      { guide: 'ADA 2026', recommendation: '在 1 型糖尿病合并肥胖的 GLP-1 相关治疗/代谢手术推荐中，使用 BMI ≥30 kg/m²；亚裔美国人使用 ≥27.5 kg/m²。', scope: '推荐 8.29｜GLP-1 相关治疗 B、代谢手术 C；这是特定治疗入口，不是中国肥胖诊断线。' }
    ],
    takeaway: '先分清“诊断”“并发症分期”“药物适应证”“手术入口”。不同目的的 BMI 不能直接横向判定谁更严格。',
    sources: ['《中国成人超重和肥胖症预防控制指南》及体重管理相关指南', 'ADA 2026 推荐 8.29']
  },
  {
    id: 'obesity-care-setting',
    category: '肥胖',
    status: '范围不同',
    title: '肥胖管理：专科全流程与基层转诊路径不是重复版本',
    question: '为什么一份指南内容很全，另一份更强调 3 个月复评和转诊？',
    rows: [
      { guide: '中国成人体重管理指南', recommendation: '覆盖从消瘦到肥胖的多维评估、营养、运动、心理、药物和外科治疗。', scope: '适合完整的专科体重管理与长期随访。' },
      { guide: '国家基层肥胖指南 2025', recommendation: '强调 BMI/腰围筛查、基层可完成的评估、药物疗效复评和明确转诊条件。', scope: '适合基层首诊、随访和双向转诊。' },
      { guide: 'AACE 肥胖算法 2025', recommendation: '从单纯体重数字转向脂肪相关慢性病及并发症中心的评估和治疗。', scope: '使用美国临床、药物和可及性语境。' }
    ],
    takeaway: '三者关注层级不同。基层版“写得少”不等于否定专科治疗；专科版也不能替代基层转诊规则。',
    sources: ['中国成人体重管理相关指南', '《国家基层肥胖症诊疗指南（2025）》', 'AACE 肥胖/脂肪相关慢性病算法 2025']
  },
  {
    id: 'diabetic-foot-systems',
    category: '糖尿病足',
    status: '不可直接比较',
    title: 'Wagner、IWGDF/IDSA、WIfI：回答的是三个不同问题',
    question: '糖尿病足已经有 Wagner 分级，为什么还要评感染和缺血？',
    rows: [
      { guide: 'Wagner 0–5 级', recommendation: '主要按溃疡深度、脓肿/骨髓炎和局部或全足坏疽描述病变。', scope: '适合快速描述深度与坏疽，但不能独立完成感染或缺血决策。' },
      { guide: 'IWGDF/IDSA 感染分级', recommendation: '按无感染、轻度、中度、重度感染分层；重度以全身炎症/代谢紊乱等为关键。', scope: '用于感染严重度、住院和抗感染路径。' },
      { guide: 'WIfI', recommendation: '分别评伤口、缺血和足部感染，组合估计截肢风险与血运重建获益。', scope: '用于肢体威胁和血管评估，不是 Wagner 的简单升级版。' }
    ],
    takeaway: '三套系统不可互换。实际病例至少分别回答：伤口有多深、感染有多重、灌注是否不足；只写“Wagner 2 级”信息不够。',
    sources: ['Wagner 糖尿病足分级', 'IWGDF/IDSA 糖尿病足感染指南', 'SVS WIfI 分级', '中国糖尿病足防治实践指南']
  },
  {
    id: 'thyroid-nodule-systems',
    category: '甲状腺',
    status: '不可直接比较',
    title: 'C-TIRADS 4A/4B/4C 与 Bethesda I–VI：影像和细胞学不能互换',
    question: '超声分类较高，是否等同于穿刺细胞学已经确诊恶性？',
    rows: [
      { guide: 'C-TIRADS', recommendation: '基于超声征象进行恶性风险分层，并结合结节大小、位置和临床背景决定随访或 FNA。', scope: '检查阶段是影像风险，不是病理诊断。' },
      { guide: 'Bethesda', recommendation: '用于甲状腺 FNA 细胞学报告，从不能诊断到恶性分为 I–VI 类，并对应复穿、分子检测、手术或随访策略。', scope: '建立在已经取得细胞学标本之后。' },
      { guide: '低危甲状腺癌主动监测指南', recommendation: '只适用于严格筛选的低危人群，并要求可重复高质量超声和可靠随访。', scope: '是确诊后的管理策略，不能由 C-TIRADS 字母直接推出。' }
    ],
    takeaway: '按“超声风险→是否 FNA→细胞学→必要时分子/手术评估→确诊后分期管理”顺序读，避免把三个阶段压成一个字母。',
    sources: ['C-TIRADS 甲状腺结节超声风险分层指南', 'Bethesda 甲状腺细胞病理报告系统', '低危甲状腺癌主动监测相关指南']
  },
  {
    id: 'adult-diabetes-classification',
    category: '糖尿病分型',
    status: '基本一致',
    title: '成人起病不等于 2 型：ADA 与 AACE 的方向一致',
    question: '成年、超重就能直接按 2 型糖尿病长期治疗吗？',
    rows: [
      { guide: 'ADA 2026', recommendation: '成人疑 1 型时按顺序评估胰岛自身抗体；分型仍不确定时结合治疗状态和病程解释 C 肽，并考虑单基因或胰源性糖尿病。', scope: '抗体阴性不能单独排除 1 型；酮症/分解代谢时不得延误胰岛素。' },
      { guide: 'AACE 2026', recommendation: '算法把糖尿病分型放在治疗之前，并提醒同一患者可存在不止一种病因；少见或混合类型应考虑专科评估。', scope: '共病算法不能替代病因分类。' }
    ],
    takeaway: '两份指南方向一致：先处理胰岛素缺乏危险，再逐步分型。年龄、BMI 或一次 C 肽结果都不能单独定型。',
    sources: ['ADA 2026《Diagnosis and Classification of Diabetes》成人疑 1 型流程', 'AACE 2026 成人 T2D 管理算法']
  },
  {
    id: 'pa-arr-thresholds',
    category: '肾上腺与高血压',
    status: '范围不同',
    title: '原醛症 ARR 切点：单位决定数字，不能跨单位照搬',
    question: 'ARR 切点是 30 还是 3.7？为什么不能直接比较？',
    rows: [
      { guide: 'PRA 单位(醛固酮 ng/dL)', recommendation: '醛固酮/肾素活性比(PRA用ng·mL⁻¹·h⁻¹)最常用切点30；醛固酮需>15 ng/dL才能判阳性。', scope: '国内实验室常用PRA口径。' },
      { guide: 'DRC 单位(醛固酮 ng/dL)', recommendation: '直接肾素浓度(DRC用mU/L)时常用切点3.7；立位醛固酮/DRC切点4.3灵敏度特异度>90%。', scope: '不同检测方法对应不同数字，必须使用本实验室口径。' },
      { guide: '欧洲高血压学会', recommendation: '推荐ARR切点约2(采用特定单位组合时)，比常用切点更低。', scope: '切点越高特异度越高，切点选择还需结合醛固酮绝对水平。' }
    ],
    takeaway: 'ARR 的数字由醛固酮与肾素的单位组合决定，30 和 3.7 并不冲突。解读时必须同时看醛固酮绝对值(>15 ng/dL)与是否已纠正低钾、停药或记录体位。',
    sources: ['原发性醛固酮增多症诊断治疗的专家共识(2024版)', '原发性醛固酮增多症分型诊断专家共识（2026）']
  },
  {
    id: 'cn-elderly-a1c',
    category: '老年糖尿病',
    status: '存在差异',
    title: '中国老年指南与 ADA 对老年糖尿病血糖目标的分层语言',
    question: '中国老年糖尿病患者 A1C 目标到底是多少？与 ADA 有何差异？',
    rows: [
      { guide: '中国老年糖尿病诊疗指南（2024）', recommendation: '良好控制 HbA1c ≤7.0%；中间过渡 >7.0%~8.0%；可接受 >8.0%~8.5%，并分别给出空腹与餐后血糖目标。', scope: '按健康/功能分层，兼顾低血糖风险与预期寿命；强调个体化。' },
      { guide: 'ADA 2026', recommendation: '健康老年人 A1C <7.0%~7.5%；复杂/中等健康 <8.0%；极复杂/健康差避免依赖 A1C。', scope: '按健康与功能状态分类，聚焦低血糖负担与治疗负担。' },
      { guide: '中国老年2型糖尿病防治临床指南（2026年版）', recommendation: '在2024版基础上细化了合并症与胰岛素抵抗场景的血糖管理，强调避免低血糖并简化方案。', scope: '与ADA方向一致：都不是单一固定数字。' }
    ],
    takeaway: '两套指南都用“健康状态分层”而非单一数字；差异主要在具体切点表述(≤7.0% vs <7.0%~7.5%)。临床按所采用指南与患者预期寿命、自理能力和照护条件选择，不机械抄一个阈值。',
    sources: ['中国老年糖尿病诊疗指南（2024版）', '中国老年2型糖尿病防治临床指南（2026年版）', 'ADA《Standards of Care in Diabetes—2026》老年人']
  }
];
