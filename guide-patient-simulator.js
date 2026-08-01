(function () {
  'use strict';

  var root = document.getElementById('patientSimulator');
  if (!root) return;

  var STORAGE_KEY = 'endo-guide-patient-simulator-v1';
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
        { id: 'fna', name: '细针穿刺与 Bethesda 分类（达到指征时）', stage: '第二轮', workupId: 'thyroid-nodule-marker', result: '若达到穿刺指征，细胞学报告需明确 Bethesda 类别；本模拟先不预设结果。', interpretation: 'Bethesda 结果用于估计恶性风险和下一步决策，不同类别不能混为一谈。', why: '避免把超声风险直接等同于病理诊断。', essential: false }
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
        { id: 'confirm', name: '确证试验与分型（CT/必要时 AVS）', stage: '第三轮', workupId: 'arr-low-potassium', result: '本模拟不预设确证试验和 AVS 结果，需由专科按适应证安排。', interpretation: '不能凭 ARR 或 CT 单独决定手术；分型和可手术性评估要结合完整资料。', why: '避免把筛查结果直接当作治疗决定。', essential: false }
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
        { id: 'cause', name: '肾素/醛固酮、21-羟化酶抗体及垂体评估', stage: '稳定后', workupId: 'cortisol-low', result: '用于区分原发性、继发性和药物相关抑制；本模拟不预设全部结果。', interpretation: '明确病因后再制定长期替代和应激教育计划。', why: '治疗前先把病因和危象安全分开处理。', essential: false }
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
        { id: 'urine', name: '尿钙、25(OH)D 与骨密度/肾脏评估', stage: '第二轮', workupId: 'calcium-low', result: '用于区分家族性低尿钙性高钙并评估骨、肾并发症；本模拟不预设全部结果。', interpretation: '治疗决策需结合症状、钙水平、肾结石、骨密度和肾功能。', why: '病因与并发症评估决定后续处理。', essential: false }
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
  ].concat(window.SIM_EXTRA_CASES || []);

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function loadState() { try { var raw = sessionStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
  function saveState() { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
  function randInt(max) { return Math.floor(Math.random() * max); }
  function choose(arr) { return arr[randInt(arr.length)]; }
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
  function gateFor(type) {
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
    var text = [template.intro].concat(template.history.map(function (item) { return item.answer || ''; })).join(' ');
    var matches = text.match(/(?:近|约|持续|已有|过去|前)s*[0-9一二三四五六七八九十]+s*(?:天|日|周|星期|个月|月|年|小时)/g) || [];
    var unique = matches.filter(function (item, index) { return matches.indexOf(item) === index; });
    return unique.length ? '本例资料已提供：' + unique.join('、') : '本例资料未提供明确患病时间；练习时必须补问起病日期、起病方式、变化趋势、最近一次发作和就诊前处理。';
  }
  function caseDataText() {
    var history = template.history.map(function (item) { return '【' + item.question + '】患者回答：' + item.answer + '；意义：' + item.why; }).join('\n');
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
    var history = template.intro + '\n' + timeline + '\n' + data.history + '\n本例未出现的病史不能自行补写；请将“未询问/未提供”列为待补问。';
    var background = '既往/共病线索：' + (profile.comorbidities || []).join('、') + '。\n用药线索：' + (profile.meds || '未设定，需逐项核对') + '。\n个人/家族/婚育月经史：以本例问诊回答为准，未提供者标记待补问。';
    var exam = '就诊场景：' + scene.label + '；' + (profile.context || '') + '\n生命体征/体格变量：BP ' + (profile.vitals && profile.vitals.bp || '未提供') + ' mmHg，HR ' + (profile.vitals && profile.vitals.hr || '未提供') + '/min，T ' + (profile.vitals && profile.vitals.temp || '未提供') + '℃，BMI ' + (profile.vitals && profile.vitals.bmi || '未提供') + '。\n' + data.exams;
    var diagnosis = '病例特点：' + template.note + '\n首要判断：根据已完成的检查和下一步判断选项整理，不能把模拟结果外推到真实患者。\n鉴别诊断/排除理由：' + template.decisions.map(function (item) { return item.label + '；理由：' + item.why; }).join('\n');
    var plan = '首轮检查与监测：' + template.tests.filter(function (item) { return item.essential || item.redFlag; }).map(function (item) { return item.name + '（目的：' + item.why + '）'; }).join('；') + '。\n安全网：' + template.history.filter(function (item) { return item.redFlag; }).map(function (item) { return item.question + '；患者回答：' + item.answer; }).join('；') + '。\n下一步：完成临床判断后回到相应指南路径、药物卡和院内急救/会诊流程核对。';
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
        '风险与告知': '已识别的危险表现：' + (template.history.filter(function (item) { return item.redFlag; }).map(function (item) { return item.question; }).join('；') || '本例暂未标注特殊危险表现') + '。\n告知患者本页为虚构训练，真实患者需由上级医师审核。'
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
  function buildProfile(template, person, scene) {
    var id = template.id;
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
    var meds = /dka|new-t1d|new-t2d|gestational/.test(id) ? '尚未规律使用降糖药或正在建立方案' : /hypoglycemia/.test(id) ? '胰岛素/促泌剂等降糖药（需逐项核对）' : /primary-aldosteronism/.test(id) ? '降压药及可能影响 ARR 的药物（需核对）' : /thyroid/.test(id) ? '甲状腺药物/含碘或生物素产品（需核对）' : '处方药、保健品和近期停药情况需核对';
    var context = scene.id.indexOf('admission') >= 0 ? '本次因新发异常或危险信号收入院' : scene.id.indexOf('inpatient') >= 0 ? '住院第 ' + between(1, 6) + ' 天，需写病程并追踪趋势' : scene.id === 'discharge' ? '症状较入院稳定，正在做出院核对' : scene.id === 'post-discharge' ? '出院后首次/早期随访，重点看方案能否执行' : scene.id === 'outpatient-followup' ? '既往已确诊，今天重点是疗效、安全和目标调整' : '首次门诊评估，需明确是否需要急诊/住院';
    return { scene: scene.label, context: context, vitals: { bp: bp, hr: hr, temp: temp, bmi: bmi }, comorbidities: comorbidities, meds: meds, occupationContext: person.job + '，' + (Math.random() > .5 ? '工作日久坐' : '工作时间不规律') };
  }
  function makeCase() {
    var template = choose(CASES);
    var mood = choose(template.moods);
    var person = { age: choose(template.demographics.ages), sex: choose(template.demographics.sexes), job: choose(template.demographics.jobs), complaint: choose(template.complaints), moodId: mood.id };
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
      activeTab: 'start',
      completed: false,
      seed: newSeed()
    };
  }
  var state = loadState() || makeCase();
  if (!state || !state.templateId || !state.person || !state.asked || !state.opened || !state.scores) state = makeCase();
  var template = CASES.find(function (item) { return item.id === state.templateId; }) || CASES[0];
  if (!state.scene || !SCENES.some(function (x) { return x.id === state.scene; })) state.scene = SCENES[0].id;
  if (!state.profile) state.profile = buildProfile(template, state.person, SCENES.find(function (x) { return x.id === state.scene; }) || SCENES[0]);
  if (!state.notes) state.notes = {};
  if (!state.workflow) state.workflow = { documentType: workflowTemplateFor(state.scene), submitted: false, score: 0, feedback: '', draftInitialized: false, autoGenerated: false };
  if (typeof state.workflow.draftInitialized !== 'boolean') state.workflow.draftInitialized = false;
  if (typeof state.workflow.autoGenerated !== 'boolean') state.workflow.autoGenerated = false;
  if (!state.workflow.documentType || !DOCUMENT_TEMPLATES[state.workflow.documentType]) state.workflow.documentType = workflowTemplateFor(state.scene);
  var mood = template.moods.find(function (item) { return item.id === state.person.moodId; }) || template.moods[0];

  function progressCount() {
    return state.asked.history.length + state.asked.exams.length + state.asked.tests.length + state.asked.decisions.length + (state.asked.communication ? 1 : 0);
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
    return '<div class="sim-profile-grid"><div><b>就诊场景</b><span>' + esc(p.scene || '') + '</span><small>' + esc(p.context || '') + '</small></div><div><b>生命体征/体格变量</b><span>BP ' + esc(p.vitals && p.vitals.bp) + ' mmHg · HR ' + esc(p.vitals && p.vitals.hr) + '/min · T ' + esc(p.vitals && p.vitals.temp) + '℃ · BMI ' + esc(p.vitals && p.vitals.bmi) + '</span><small>这些是教学模拟变量，需与本例危险信号和检查结果一起解释。</small></div><div><b>基础病/风险线索</b><span>' + esc((p.comorbidities || []).join('、')) + '</span><small>通过病史核对，不把随机标签当作诊断。</small></div><div><b>用药/生活背景</b><span>' + esc(p.meds || '') + '</span><small>' + esc(p.occupationContext || '') + '</small></div></div>';
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
    var map = { history: ['问诊', template.history, '先问能改变分流和检查顺序的问题。'], exams: ['床旁查体', template.exams, '查体结果不是装饰，要说明它改变了什么。'], tests: ['选择检查', template.tests, '优先选能确认危象、诊断或改变下一步的检查。'], decisions: ['下一步判断', template.decisions, '选择最符合当前信息和指南顺序的路径。'] };
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
    var gateNote = gate !== 'open' && gate !== 'done' ? '<div class="sim-notice"><b>当前步骤已锁定：</b>' + esc(gateLabel(gate)) + '。完成前置步骤后再查看本组结果，避免只靠点击记答案。</div>' : '';
    return '<div class="sim-section-title"><div><span class="sim-kicker">' + esc(cfg[0]) + '</span><h3>' + esc(cfg[2]) + '</h3></div><button class="sim-secondary" type="button" data-sim-action="hint">给我提示</button></div>' + gateNote + '<div class="sim-choice-list">' + list + '</div><div class="sim-details">' + (details || '<p class="sim-muted">完成本步骤后逐项查看患者回答、检查意义或路径理由；每一项都要回答“它改变了什么”。</p>') + '</div>';
  }
  function renderTab(tab) { return tab === 'workflow' ? renderWorkflow() : renderDataTab(tab); }
  function reviewHtml() {
    var gate = gateFor('review');
    if (gate !== 'done' || !state.workflow.submitted) {
      var documentState = documentScore();
      return '<div class="sim-review"><div class="sim-review-head"><span class="sim-kicker">复盘暂未开放</span><h3>先完成一遍完整临床推理</h3><p>复盘不是“随便点完就给分”。请按沟通 → 必问病史 → 关键查体 → 必要检查 → 下一步判断 → 文书提交的顺序完成。</p></div><div class="sim-review-block sim-missed"><h4>当前还缺什么</h4><p>' + esc(gate === 'done' ? '还没有提交文书复盘。' : gateLabel(gate)) + '</p><p class="sim-muted">当前文书结构分：' + documentState.earnedPoints + '/' + documentState.totalPoints + '。进入“病历与流程”继续训练。</p></div><div class="sim-actions"><button class="primary" type="button" data-sim-tab="workflow">去写病历与流程</button><button class="sim-secondary" type="button" data-sim-action="hint">给我提示</button></div></div>';
    }
    var essentialHistory = template.history.filter(function (x) { return x.redFlag || x.id === 'symptoms' || x.id === 'insulin' || x.id === 'crisis'; }).map(function (x) { return x.id; });
    var essentialExams = template.exams.filter(function (x) { return x.redFlag; }).map(function (x) { return x.id; });
    var essentialTests = template.tests.filter(function (x) { return x.essential; }).map(function (x) { return x.id; });
    var missed = [];
    essentialHistory.forEach(function (id) { if (!state.asked.history.includes(id)) { var x = template.history.find(function (i) { return i.id === id; }); missed.push('问诊：' + x.question); } });
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
    var tabs = [{ id: 'start', label: '患者与沟通' }, { id: 'history', label: '问诊' }, { id: 'exams', label: '床旁查体' }, { id: 'tests', label: '选择检查' }, { id: 'decisions', label: '下一步判断' }, { id: 'review', label: '复盘' }];
    var tabHtml = tabs.map(function (tab) { return '<button type="button" class="sim-tab ' + (state.activeTab === tab.id ? 'active' : '') + '" data-sim-tab="' + tab.id + '">' + tab.label + '</button>'; }).join('');
    root.innerHTML = '<div class="sim-top"><div><span class="sim-kicker">随机患者模拟器</span><h3>把指南路径练成一次有温度的问诊</h3><p>每次进入本页会保留当前病例；点击“重新抽取患者”生成新的虚构患者。随机的是背景、表达和情绪，诊断事实、检查结果与安全边界来自已标注的指南路径。</p></div><div class="sim-progress"><b>' + progressCount() + '</b><span>个学习动作</span></div></div><div class="sim-notice"><b>学习边界：</b>这是虚构教学病例，不是真实医嘱。模拟器不替代急诊分诊、原指南、药品说明书或专科会诊；涉及 DKA/HHS、低钾、肾上腺危象、视力下降等危险信号时，现实中应立即升级处理。</div><div class="sim-tabs">' + tabHtml + '</div><div class="sim-body">' + (state.activeTab === 'review' ? reviewHtml() : renderTab(state.activeTab)) + '</div>';
  }
  function render() {
    renderBase();
    var tabs = root.querySelector('.sim-tabs');
    if (tabs && !tabs.querySelector('[data-sim-tab="workflow"]')) tabs.insertAdjacentHTML('beforeend', '<button type="button" class="sim-tab ' + (state.activeTab === 'workflow' ? 'active' : '') + '" data-sim-tab="workflow">病历与流程</button>');
    if (state.activeTab === 'workflow') decorateWorkflow();
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
  function handle(action, id) {
    if (action === 'new') { state = makeCase(); render(); return; }
    if (action === 'restart') { var fresh = makeCase(); fresh.templateId = state.templateId; fresh.person = state.person; fresh.seed = newSeed(); state = fresh; render(); return; }
    if (action === 'hint') { state.hints += 1; state.response = '提示：' + (state.activeTab === 'start' ? '先回应患者情绪，再询问会改变急诊分流的危险信号。' : state.activeTab === 'history' ? '优先问时间线、用药、妊娠/生育、心肾功能和危险信号。' : state.activeTab === 'exams' ? '查体要回答“患者是否稳定、是否需要升级、下一项检查是什么”。' : state.activeTab === 'tests' ? '优先选择能确认诊断、危象或改变下一步的检查，并说明为什么。' : '先说出当前主导矛盾，再解释为什么其他选项会延误或增加风险。'); render(); return; }
    if (action === 'empathy' || action === 'explain' || action === 'direct') { state.asked.communication = true; state.scores.communication = action === 'empathy' ? 2 : action === 'explain' ? 1 : 0; state.response = action === 'empathy' ? mood.after : action === 'explain' ? '好的，先告诉我流程，我会尽量配合。' : '好吧，你问什么我就回答什么。'; saveState(); render(); return; }
    if (action === 'locked') { state.response = '当前步骤不能跳过：' + gateLabel(gateFor(state.activeTab)); saveState(); render(); return; }
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
    var btn = event.target.closest('[data-sim-action]'); if (btn) { handle(btn.dataset.simAction, btn.dataset.simId); }
  });
  root.addEventListener('input', function (event) {
    var field = event.target.closest('[data-sim-note]');
    if (field) { state.notes[field.dataset.simNote] = field.value; saveState(); }
  });
  root.addEventListener('change', function (event) {
    var selector = event.target.closest('[data-sim-document]');
    if (selector) { state.workflow.documentType = selector.value; state.workflow.submitted = false; state.workflow.feedback = ''; state.workflow.draftInitialized = false; state.workflow.autoGenerated = false; state.notes = {}; saveState(); render(); }
  });
  window.PATIENT_SIMULATOR_CASES = CASES;
  window.PATIENT_SIMULATOR = { reset: function () { state = makeCase(); render(); }, cases: CASES };
  render();
})();
