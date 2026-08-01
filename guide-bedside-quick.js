/* 床旁速查：仅摘录已核对指南中的临床顺序、阈值和剂量。 */
window.BEDSIDE_QUICK_ITEMS = [

  {
    id:"prediabetes",
    category:"糖代谢",
    title:"糖尿病前期：确认、分层、干预",
    steps:[
      "切点：A1C 5.7%–6.4%；FPG 100–125 mg/dL；75 g OGTT 2 h 140–199 mg/dL。",
      "先排已达糖尿病、妊娠、疑1型、胰腺病和药物相关高血糖；A1C与血糖不一致时查干扰因素。",
      "结构化预防项目：至少减重5%–7%，每周至少150 min中等强度活动。",
      "年龄25–59岁、BMI≥35、FPG≥110、A1C≥6.0%或既往GDM者可讨论二甲双胍；至少每年复查。"
    ],
    evidence:"ADA 2026表2.2；3.1 E；3.3 A；3.7 A；3.10 B",
    target:{route:"disease",key:"prediabetes",label:"打开糖尿病前期完整路径"}
  },
  {
    id:"diabetes-diagnosis",
    category:"糖代谢",
    title:"新发现高血糖：先确认诊断",
    steps:[
      "糖尿病切点：A1C≥6.5%、FPG≥126 mg/dL、75 g OGTT 2 h≥200 mg/dL。",
      "典型症状或高血糖危象 + 随机血糖≥200 mg/dL可诊断。",
      "无明确症状/危象需第二个异常结果；两项不一致时复查超过切点的项目。",
      "诊断后立即分型并补A1C/CGM、eGFR、UACR、血脂、血压、体重、眼、神经和足基线。"
    ],
    evidence:"ADA 2026表2.1；2.1a–2.4b",
    target:{route:"workup",key:"glucose-high",label:"打开高血糖辅助检查"}
  },
  {
    id:"type1-triage",
    category:"糖代谢",
    title:"成人也可能是1型：不能漏掉",
    danger:true,
    steps:[
      "酮症、短期消瘦、起病快、其他自身免疫病或口服药很快失效：提高1型概率。",
      "先查GAD；阴性仍怀疑时IA-2和/或ZnT8。IAA只在未使用胰岛素时解释。",
      "已用胰岛素且仍不清：随机C肽与同时血糖结合，抽血前5 h内进食；危象后2周内不做分型性C肽。",
      "高度疑1型时不能等待抗体/C肽再给或撤掉维持生命的胰岛素。"
    ],
    evidence:"ADA 2026成人疑似1型流程；2.8a–2.10",
    target:{route:"workup",key:"type1-classification",label:"打开1型分型检查路径"}
  },
  {
    id:"t2-med-path",
    category:"门诊治疗",
    title:"2型选药：先看主导共病",
    steps:[
      "ASCVD/高危：有心血管获益的GLP-1 RA和/或SGLT2抑制剂。",
      "心衰：有心衰结局获益的SGLT2抑制剂；肥胖+症状性HFpEF再看有证据的GLP-1相关治疗。",
      "CKD eGFR 20–60和/或白蛋白尿：有证据的SGLT2抑制剂或GLP-1 RA；肾功能边界按具体制剂。",
      "肥胖、MASH、老年衰弱、妊娠、住院和特殊类型分别进入独立分支；不按固定“二甲双胍后逐级加药”覆盖所有人。"
    ],
    evidence:"ADA 2026推荐9.5–9.13、13.13–13.14d",
    target:{route:"module",key:"meds",label:"打开降糖药物专题"}
  },
  {
    id:"insulin-start",
    category:"门诊治疗",
    title:"胰岛素：先分1型、2型和危象",
    steps:[
      "成人1型代谢稳定：总日剂量常0.4–1.0 U/kg/d，典型约0.5 U/kg/d；约30%–50%为基础量。",
      "新诊成人1型常0.2–0.6 U/kg/d；蜜月期、老年、低体重、CKD需更低。",
      "2型基础胰岛素常从0.1–0.2 U/kg/d或10 U/d起始；按空腹血糖和低血糖逐步调整。",
      "有症状/分解代谢、A1C>10%或血糖≥300 mg/dL先排危象并考虑胰岛素；DKA/HHS不能套门诊剂量。"
    ],
    evidence:"ADA 2026胰岛素治疗正文；9.20–9.22",
    target:{route:"med",key:"1型糖尿病：总日剂量与基础-餐时框架",label:"打开胰岛素剂量卡"}
  },
  {
    id:"dka-hhs",
    category:"急症",
    title:"疑DKA/HHS：三个组成部分一起查",
    danger:true,
    steps:[
      "立即查静脉血糖、β-羟丁酸、静脉pH/碳酸氢根、Na/K/Cl/尿素/肌酐；HHS加有效血浆渗透压和意识。",
      "DKA需同时有糖尿病/高血糖、酮症和代谢性酸中毒；SGLT2抑制剂、妊娠或进食不足可为正常/轻度高血糖DKA。",
      "HHS常为血糖≥600 mg/dL、有效渗透压>300 mOsm/kg或总渗透压>320，且无显著酮症/酸中毒。",
      "边补液边监测；混合DKA/HHS很常见，按危象路径而非只按单个血糖值处理。"
    ],
    evidence:"2024成人高血糖危象国际共识；ADA 2026图16.1",
    target:{route:"complication",key:"dka-hhs-treatment",label:"打开DKA/HHS分级处置"}
  },
  {
    id:"dka-potassium",
    category:"急症",
    title:"DKA/HHS合并低钾：先补钾，暂缓胰岛素",
    danger:true,
    steps:[
      "K+<3.5 mmol/L：以10 mmol/h开始补钾，暂缓胰岛素，防致命性心律失常和呼吸肌无力。",
      "K+≥3.5 mmol/L后才启动胰岛素；目标维持K+ 4–5 mmol/L，多数患者静脉液每升加入20–30 mmol钾。",
      "胰岛素后2 h复查K+，此后每4 h；无尿/严重肾衰时补钾需更谨慎。",
      "不是一开始就常规加葡萄糖液：血糖降至危象方案阈值后再加含糖液，以便继续胰岛素清除酮体。"
    ],
    evidence:"2024成人高血糖危象国际共识；ADA 2026",
    target:{route:"complication",key:"dka-hhs-treatment",label:"查看补液、胰岛素、补钾完整顺序"}
  },
  {
    id:"hypoglycemia",
    category:"急症",
    title:"低血糖：分级与立即处理",
    danger:true,
    steps:[
      "1级：<70且≥54 mg/dL；2级：<54 mg/dL；3级：需要他人帮助，与血糖数值无关。",
      "清醒可吞咽：快速吸收葡萄糖，15 min复测，仍低则重复。",
      "不能吞咽/意识障碍：侧卧防误吸，使用即用型胰高糖素或院内静脉葡萄糖，启动急救。",
      "任何3级或反复2级都要下调高风险药物、重新设目标、考虑CGM并配备胰高糖素。"
    ],
    evidence:"ADA 2026表6.4；6.15–6.19",
    target:{route:"complication",key:"hypoglycemia-treatment",label:"打开低血糖分级处置和制剂剂量"}
  },
  {
    id:"sick-day",
    category:"急症",
    title:"病日与不能进食：哪些药要停评",
    danger:true,
    steps:[
      "1型或胰岛素缺乏者不能停基础胰岛素；增加血糖和血酮监测，保证液体和可吸收碳水。",
      "呕吐、腹痛、呼吸深快、持续高血糖/酮体或泵故障：按DKA风险升级。",
      "SGLT2抑制剂在急病、长时间禁食、脱水、酮症或手术时停评；血糖不高也要查酮体。",
      "二甲双胍在明显脱水、缺氧、AKI/严重感染等乳酸酸中毒高风险状态停评；其他药按进食和低血糖风险调整。"
    ],
    evidence:"ADA 2026病日管理与高血糖危象",
    target:{route:"module",key:"targets",label:"打开血糖目标与病日专题"}
  },
  {
    id:"kidney",
    category:"慢病",
    title:"糖尿病肾病：UACR与eGFR双轴",
    steps:[
      "T2D从诊断起、T1D病程≥5年后每年至少查UACR+eGFR；CKD者每年1–4次。",
      "UACR需排运动、感染、月经、心衰、明显高血糖等影响；通常3–6个月内2/3份异常才确认。",
      "高血压+UACR≥30 mg/g：ACEI/ARB；T2D+CKD且eGFR≥20：有证据的SGLT2抑制剂。",
      "活动性尿沉渣、快速下降、短期大量蛋白尿或病程不典型：不要自动归因糖尿病，转肾内科。"
    ],
    evidence:"ADA 2026推荐11.1–11.11",
    target:{route:"workup",key:"kidney-albuminuria",label:"打开UACR/eGFR辅助检查"}
  },
  {
    id:"bp-lipids",
    category:"慢病",
    title:"血压与LDL：不等A1C达标",
    steps:[
      "多数患者安全可达时血压<130/80；心血管/肾高危鼓励收缩压<120。≥150/90通常起始两药。",
      "ACEI/ARB/MRA启动或加量后复查肌酐/eGFR和K+；ACEI+ARB禁忌联用。",
      "40–75岁无ASCVD至少中强度他汀；高风险高强度、LDL<70 mg/dL；已有ASCVD目标<55 mg/dL。",
      "TG≥500 mg/dL先防胰腺炎并找继发原因；常规他汀+贝特/烟酸/n-3补充剂不用于额外ASCVD降风险。"
    ],
    evidence:"ADA 2026推荐10.1–10.11、10.18–10.32",
    target:{route:"module",key:"cv",label:"打开心血管专题"}
  },
  {
    id:"foot",
    category:"慢病",
    title:"糖尿病足：神经、感染、缺血同时判断",
    danger:true,
    steps:[
      "每年至少综合足评估；保护性感觉丧失或既往溃疡/截肢者每次就诊看足。",
      "IWGDF风险0每年、风险1每6–12个月、风险2每3–6个月、风险3每1–3个月。",
      "开放性溃疡记录面积/深度/渗液，做探骨试验和感染严重度；深部标本优于表面拭子。",
      "坏疽、深部感染、脓毒症或急性缺血立即多学科升级；红热肿+神经病变警惕Charcot并立即减负固定。"
    ],
    evidence:"ADA 2026足病；IWGDF/IDSA",
    target:{route:"complication",key:"diabetic-foot-infection-treatment",label:"打开糖尿病足分级处置"}
  },
  {
    id:"pregnancy",
    category:"特殊人群",
    title:"妊娠血糖与产后复查",
    steps:[
      "目标：空腹<95 mg/dL；餐后1 h<140或2 h<120。既往糖尿病/胰岛素治疗GDM通常下限为70、110和100 mg/dL。",
      "理想A1C<6%，为避免显著低血糖可放宽<7%；T1D妊娠推荐CGM。",
      "胰岛素是T1D必需，也是GDM/T2D妊娠首选；二甲双胍和格列本脲不作为GDM一线。",
      "GDM产后4–12周做空腹75 g OGTT，之后每1–3年终身筛查。"
    ],
    evidence:"ADA 2026推荐15.8–15.13、15.17–15.21、15.25–15.28",
    target:{route:"module",key:"pregnancy",label:"打开妊娠完整专题"}
  },
  {
    id:"hospital",
    category:"特殊人群",
    title:"住院与围手术期",
    steps:[
      "持续血糖≥180 mg/dL（24 h内2次）启动/强化；ICU多数目标140–180，非ICU目标100–180 mg/dL。",
      "有进食：基础+餐时+校正；摄入不足/禁食：基础+校正；避免长期单用滑动尺度。",
      "1型即使禁食也不能停基础胰岛素。择期手术前SGLT2抑制剂停3–4天。",
      "围手术目标100–180 mg/dL；出院前完成药物、耗材、病日/低血糖教育和随访交接。"
    ],
    evidence:"ADA 2026推荐16.4–16.15",
    target:{route:"module",key:"hospital",label:"打开住院完整专题"}
  },
  {
    id:"thyroid-labs",
    category:"其他内分泌",
    title:"甲功异常：先看TSH与FT4组合",
    steps:[
      "TSH高+FT4低：原发甲减方向；TSH高+FT4正常：亚临床甲减方向，结合TPOAb和持续性。",
      "TSH低+FT4/FT3高：甲亢/甲状腺毒症方向；TSH低+FT4正常时补FT3并复查。",
      "FT4低而TSH不高：先考虑中枢性甲减、非甲状腺疾病和检测干扰，不能按普通原发甲减解释。",
      "结果与临床矛盾时核对生物素、异嗜性抗体、结合蛋白和平台差异；先排干扰再追少见病。"
    ],
    evidence:"甲状腺疾病常用检验项目应用共识（2025）；ETA中枢性甲减/检测干扰指南",
    target:{route:"workup",key:"thyroid-function-discordance",label:"打开完整甲功鉴别路径"}
  },
  {
    id:"adrenal-crisis",
    category:"其他内分泌",
    title:"疑肾上腺危象：不能等化验",
    danger:true,
    steps:[
      "低血压/休克、呕吐腹痛、低钠高钾、低血糖及既往肾上腺/垂体病或长期激素史时高度怀疑。",
      "不延误治疗的前提下先留皮质醇、ACTH、电解质、血糖、肾功能、血气和感染标本。",
      "成人立即氢化可的松100 mg静脉/肌注；随后200 mg/24 h持续输注或50 mg每6 h。",
      "0.9%氯化钠1 L于首小时，之后按循环、尿量、Na和心肾功能调整；低血糖同时静脉葡萄糖。"
    ],
    evidence:"肾上腺危象指南路径；本站并发症卡保留原剂量",
    target:{route:"complication",key:"adrenal-crisis-treatment",label:"打开肾上腺危象分级处置"}
  },
  {
    id:"calcium-emergency",
    category:"其他内分泌",
    title:"急性低钙与高钙：先判断症状和心电图",
    danger:true,
    steps:[
      "低钙伴喉痉挛、癫痫、心律失常或QT延长：10%葡萄糖酸钙10–20 mL稀释于50–100 mL 5%葡萄糖，约10 min静脉给药并心电监护；必要时后续输注。",
      "低钙同时查离子钙、Mg、P、PTH、肾功能和维生素D；低镁不纠正时低钙可能难以纠正。",
      "重度/症状性高钙先0.9%氯化钠补液，指南常给3–6 L/24 h范围，但需按心肾功能和尿量调整。",
      "抗骨吸收治疗和降钙素按病因、肾功能与指南；出现意识改变、心律失常、AKI或容量无法纠正立即专科升级。"
    ],
    evidence:"成人急性低钙/高钙急诊指南；本站并发症卡",
    target:{route:"complication",key:"acute-hypocalcemia-treatment",label:"打开钙危象剂量与监测"}
  },
  {
    id:"pa-screen",
    category:"其他内分泌",
    title:"疑原醛症：先筛查，再确认，后分型",
    steps:[
      "筛查人群：所有高血压尤其新诊者至少一次；难治性、低钾、肾上腺结节、早发高血压优先。",
      "纠正低钾后测非卧位2 h醛固酮+肾素(或DRC)算ARR：PRA(ng/mL/h)切点30，DRC(mU/L)切点3.7；醛固酮需>15 ng/dL才判阳性。",
      "筛查阳性者做≥1种确诊试验：生理盐水试验后醛固酮>10 ng/dL确诊、<5排除；卡托普利50 mg后2 h醛固酮11 ng/dL为国内切点。",
      "确诊后分型：肾上腺CT+必要时AVS(优势侧LI≥4)；单侧→腹腔镜单侧切除，双侧→螺内酯20 mg/d起最大100 mg/d。"
    ],
    evidence:"原醛诊断治疗共识(2024)；分型共识(2026)；AVS共识",
    target:{route:"disease",key:"primary-aldosteronism",label:"打开原醛完整路径"}
  },
  {
    id:"gout-flare",
    category:"门诊治疗",
    title:"痛风急性发作：分层选药",
    steps:[
      "轻中度：秋水仙碱/NSAIDs/糖皮质激素三选一。秋水仙碱首剂1.0 mg、1 h后再0.5 mg、12 h后0.5 mg每日2~3次(36 h内尽早)。",
      "重度(VAS≥7、≥2大关节或多关节炎)：联用两类(秋水仙碱+NSAIDs或秋水仙碱+全身激素)。",
      "传统治疗受限→IL-1抑制剂：伏欣奇拜单抗200 mg单次皮下、卡那单抗150 mg、阿那白滞素100~200 mg。",
      "CKD G4~5用糖皮质激素、慎秋水仙碱、禁用NSAIDs；合并CVD及hsCRP≥2 mg/L优先秋水仙碱或IL-1抑制剂。"
    ],
    evidence:"痛风精准抗炎临床实践指南",
    target:{route:"disease",key:"gout",label:"打开高尿酸与痛风完整路径"}
  },
  {
    id:"pediatric-dka-quick",
    category:"急症",
    title:"儿童DKA：补液→补钾→胰岛素→脑水肿",
    danger:true,
    steps:[
      "诊断三要素：血糖>11 mmol/L + pH<7.3或HCO₃⁻<18 + 尿酮≥++或血β-羟丁酸≥3 mmol/L。",
      "快速补液10–20 mL/kg生理盐水(无休克30~60 min，有休克10~15 mL/kg，第1小时≤40 mL/kg)。",
      "补液≥1 h且血钾>3.3 mmol/L才启动胰岛素0.05~0.10 U/(kg·h)；血钾<3.3先补钾。",
      "血糖下降≤5 mmol/h；脑水肿高危(<5岁、新发、严重酸中毒)按Muir标准处理不等CT，甘露醇0.5~1.0 g/kg。"
    ],
    evidence:"儿童糖尿病酮症酸中毒诊疗指南（2024）",
    target:{route:"complication",key:"pediatric-dka-treatment",label:"打开儿童DKA分级处置"}
  },
  {
    id:"hyponatremia-quick",
    category:"急症",
    title:"低钠血症：先分渗透压、容量和症状，再控速纠钠",
    steps:[
      "血钠<135 mmol/L；先排除高血糖(校正血钠=测量值+2.4×血糖−5.5)等假性低钠。",
      "低渗性(<275 mOsm/kg)才按容量分型：低容量→0.9%氯化钠；等/高容量→治原发病+限液≤1 L/d。",
      "严重症状(呕吐、嗜睡、癫痫、昏迷)：20 min内3%氯化钠150 mL，可重复2次或直至血钠升5 mmol/L/症状改善。",
      "ODS高危(慢性、血钠<120、酒精/肝病/低钾)24 h升幅≤4~6 mmol/L；纠正过快→补水3 mL/kg/h±去氨加压素2~4 μg q8h。"
    ],
    evidence:"低钠血症的中国专家共识",
    target:{route:"complication",key:"hyponatremia-correction",label:"打开低钠纠正分层处置"}
  },
  {
    id:"tao-triage",
    category:"其他内分泌",
    title:"Graves眼病(TAO)：先评活动性，再分严重度",
    steps:[
      "活动性：CAS≥3分(7项：自发性球后痛、眼球运动痛、眼睑充血、眼睑水肿、结膜充血、结膜水肿、泪阜肿胀)；随访10项CAS≥4分。",
      "严重度(EUGOGO)：轻度(退缩<2mm、突出≤上限+3mm、一过性复视)→中重度(退缩≥2mm、持续复视)→极重度(DON或严重角膜病变)。",
      "DON：视力下降、色觉受损、RAPD、视盘水肿，需立即静脉糖皮质激素并评估眶减压。",
      "所有TAO患者戒烟；轻度活动期补硒200 μg/d共6个月；保持甲状腺功能正常。"
    ],
    evidence:"中国甲状腺相关眼病诊断和治疗指南（2022年）",
    target:{route:"severity",key:"tao-eugogo",label:"打开TAO严重度分级"}
  },
{id:"oncall-hyperglycemia",category:"夜班急症",title:"夜班血糖高：先判断需不需要紧急处理",danger:true,steps:["血糖>16.7 mmol/L(300 mg/dL)：先问症状(呕吐/腹痛/意识)和测血酮/血气，排除DKA/HHS。","单纯高血糖无酮症/无症状：评估漏药、感染、饮食，补足胰岛素基础量，勿随意大剂量追加。","HbA1c>10%或血糖≥16.7伴分解代谢：考虑启动胰岛素而不是逐级加口服药。","床旁查尿酮/血β-羟丁酸；SGLT2i使用者警惕正常血糖DKA。"],evidence:"ADA 2026危象章节；高血糖危象共识",target:{route:"complication",key:"dka-hhs-treatment",label:"打开DKA/HHS处置"}},
{id:"oncall-hypoglycemia",category:"夜班急症",title:"夜班低血糖：分级处理与复查",danger:true,steps:["意识清楚可吞咽：口服15-20g快糖(葡萄糖片/含糖饮料)，15分钟复测，仍低重复。","意识障碍/不能吞咽：胰高糖素肌注或静脉葡萄糖，禁口服。","3级低血糖(需他人帮助)：处理稳定后评估诱因(胰岛素过量/磺脲/肾衰/饮酒)。","反复夜间低血糖：减基础胰岛素或促泌剂，考虑CGM，排除低血糖感知受损。"],evidence:"ADA 6.15-6.19",target:{route:"complication",key:"hypoglycemia-treatment",label:"打开低血糖处置"}},
{id:"oncall-dka-suspect",category:"夜班急症",title:"夜班疑DKA：三个组成部分一起查",danger:true,steps:["必须同时有：高血糖/糖尿病 + 酮症 + 代谢性酸中毒。","查静脉血糖、血β-羟丁酸、血气/碳酸氢根、电解质。","SGLT2i/妊娠/饥饿可致正常血糖DKA，血糖不高不能排除。","血钾<3.3先补钾暂缓胰岛素；按轻中重度定监护。"],evidence:"2024高血糖危象共识",target:{route:"complication",key:"dka-hhs-treatment",label:"打开DKA/HHS处置"}},
{id:"oncall-hhs",category:"夜班急症",title:"夜班HHS：高渗状态识别",danger:true,steps:["血糖≥600 mg/dL(≥33.3 mmol/L)、有效渗透压>300 mOsm/kg、无明显酮症。","多见于老年2型、感染/卒中/心梗应激；脱水明显。","补液为主(0.9%氯化钠先)，胰岛素按血糖缓慢下降；监测渗透压和神经状态。","与DKA可混合存在，按危象路径处理。"],evidence:"2024高血糖危象共识",target:{route:"complication",key:"dka-hhs-treatment",label:"打开DKA/HHS处置"}},
{id:"oncall-adrenal",category:"夜班急症",title:"夜班疑肾上腺危象：不能等化验",danger:true,steps:["低血压/休克+低钠+高钾+低血糖+乏力，尤其长期激素或Addison患者。","立即静脉氢化可的松100mg+0.9%氯化钠补液，不等确诊结果。","纠正低钠高钾低血糖；寻找诱因(感染/手术/激素骤停)。","稳定后转口服替代并教育应激剂量。"],evidence:"肾上腺危象处置",target:{route:"complication",key:"adrenal-crisis-treatment",label:"打开肾上腺危象处置"}},
{id:"oncall-thyroid-storm",category:"夜班急症",title:"夜班甲状腺危象：识别与处理",danger:true,steps:["发热+心悸+谵妄+大汗，BWPS评分≥45分。","PTU 600mg/d或MMI 60mg/d + 普萘洛尔 + 无机碘 + 糖皮质激素综合治疗。","ICU监护；退热、补液、纠正电解质。","避免阿司匹林(释放游离激素)。"],evidence:"甲亢诊治指南",target:{route:"severity",key:"thyroid-storm-bwps",label:"打开甲状腺危象分级"}},
{id:"oncall-hypercalcemia",category:"夜班急症",title:"夜班高钙危象：补液与降钙",danger:true,steps:["血钙>3.5 mmol/L或意识改变/心律失常/急性肾损伤。","0.9%氯化钠积极补液3-6L/24h(按心肾功能)，监测心电。","降钙素快速降钙+唑来膦酸/帕米膦酸；明确病因(PTH/恶性肿瘤)。","心衰/肾衰者补液需谨慎。"],evidence:"急性高钙处置",target:{route:"complication",key:"acute-hypercalcemia-treatment",label:"打开高钙处置"}},
{id:"oncall-hypocalcemia",category:"夜班急症",title:"夜班低钙：症状与补钙",danger:true,steps:["手足搐搦/喉痉挛/癫痫/QT延长：10%葡萄糖酸钙10-20mL稀释后10min静注并监护。","同步查镁、磷、PTH、肾功能；低镁不纠则低钙难纠正。","无症状轻症可口服钙+活性维生素D。","甲状腺/甲状旁腺术后低钙需警惕骨饥饿综合征。"],evidence:"急性低钙处置",target:{route:"complication",key:"acute-hypocalcemia-treatment",label:"打开低钙处置"}},
{id:"oncall-hyponatremia",category:"夜班急症",title:"夜班低钠：分级纠钠防ODS",danger:true,steps:["严重症状(呕吐/嗜睡/癫痫/昏迷)：3%氯化钠150mL/20min，可重复至症状改善。","慢性低钠<120、ODS高危：24h升幅≤4-6 mmol/L，防渗透性脱髓鞘。","每4h复查血钠；纠正过快用去氨加压素。","先排除高血糖等假性低钠；按容量分型(低/等/高容量)。"],evidence:"低钠共识",target:{route:"complication",key:"hyponatremia-correction",label:"打开低钠纠正"}},
{id:"oncall-hyperkalemia",category:"夜班急症",title:"夜班高钾：心电图与急症处理",danger:true,steps:["血钾>6.5或心电图T波高尖/宽QRS：急症处理。","静脉钙剂稳定心肌(葡萄糖酸钙10% 10mL)，起效快维持短。","胰岛素+葡萄糖促钾入胞，β激动剂辅助；利尿/树脂/透析排钾。","排查假性高钾(溶血)、保钾药、肾功能。"],evidence:"电解质急症处理",target:{route:"complication",key:"finerenone-potassium",label:"查看高钾管理"}},
{id:"oncall-ppgl",category:"夜班急症",title:"夜班血压骤升疑嗜铬细胞瘤",danger:true,steps:["阵发性头痛+心悸+大汗+血压骤升，疑PPGL。","先α受体阻滞剂控制血压，切忌先单用β阻滞剂(可致血压更高)。","测血浆/尿甲氧基肾上腺素；胸腹盆影像定位。","儿茶酚胺心肌病/危象需ICU。"],evidence:"PPGL围术期共识",target:{route:"disease",key:"ppgl",label:"打开PPGL路径"}},
{id:"oncall-pit-apoplexy",category:"夜班急症",title:"夜班突发头痛+视力下降：垂体卒中",danger:true,steps:["垂体瘤患者突发严重头痛+视力/视野缺损+眼肌麻痹。","急诊CT/MRI示垂体出血/梗死；立即激素评估(ACTH/皮质醇)。","大剂量糖皮质激素(氢化可的松)、神经监测、眼科。","占位压迫重者手术减压。"],evidence:"垂体瘤诊治",target:{route:"disease",key:"pituitary-tumor",label:"打开垂体瘤路径"}},
{id:"admit-diabetes",category:"新入院评估",title:"新入院糖尿病：基线评估清单",steps:["确认诊断与分型(1型/2型/LADA)，查C肽/抗体必要时。","基线：HbA1c、空腹血糖、eGFR、UACR、血脂、血压、体重。","查眼底、足部、神经；评估低血糖史、用药、依从性。","按住院血糖目标制定胰岛素/口服药方案。"],evidence:"ADA 2026住院主题；中国糖尿病指南",target:{route:"disease",key:"diabetes",label:"打开糖尿病路径"}},
{id:"admit-thyroid",category:"新入院评估",title:"新入院甲功异常：先看TSH/FT4组合",steps:["TSH低+FT4高：甲亢(查TRAb、超声)；TSH高+FT4低：甲减(查TPOAb)。","TSH低+FT4正常：亚临床甲亢；TSH高+FT4正常：亚临床甲减。","TSH与FT4不一致：排除中枢性甲减、检验干扰、药物(胺碘酮)。","老年/妊娠/心脏患者更积极处理。"],evidence:"甲亢诊治指南；甲减指南",target:{route:"disease",key:"hyperthyroidism",label:"打开甲亢路径"}},
{id:"admit-hyperglycemia",category:"新入院评估",title:"新入院高血糖：区分应激与糖尿病",steps:["住院应激可致高血糖，但>11.1 mmol/L需评估。","查HbA1c(近期血糖暴露)帮助区分新发糖尿病与应激。","有症状/危象按DKA/HHS处理；无危象按住院血糖目标管理。","糖皮质激素诱导高血糖较常见，注意血糖监测。"],evidence:"ADA 2026住院主题",target:{route:"workup",key:"glucose-high",label:"打开高血糖追查"}},
{id:"admit-hypertension-k",category:"新入院评估",title:"新入院高血压+低钾：排查继发",steps:["高血压伴低钾/难治性高血压/早发高血压：筛查原醛。","纠正低钾后测非卧位2h醛固酮+肾素(DRC)算ARR。","醛固酮>15ng/dL才判阳性；按单位选切点(PRA 30/DRC 3.7)。","同时排查库欣(向心肥胖/紫纹)、PPGL(阵发/心悸)。"],evidence:"原醛共识；继发高血压筛查",target:{route:"disease",key:"primary-aldosteronism",label:"打开原醛路径"}},
{id:"admit-calcium",category:"新入院评估",title:"新入院血钙异常：快速分型",steps:["高钙：PTH高→甲旁亢；PTH低→恶性肿瘤/维生素D/药物。","低钙：PTH低→甲旁减/低镁；PTH高→维生素D缺乏/肾衰/假性。","高钙按严重度补液+降钙；低钙按症状静脉/口服补。","同步查镁、磷、25OHD、肾功能。"],evidence:"甲旁亢诊疗；低钙处置",target:{route:"workup",key:"calcium-low",label:"打开血钙追查"}},
{id:"clinic-diabetes-followup",category:"慢病复诊",title:"门诊糖尿病复诊：三查三调",steps:["查血糖控制(A1C每3-6月、CGM/TIR、低血糖)、并发症(眼/肾/神经/足)、共病(血压/血脂/体重)。","调血糖药：未达标按共病优先(心衰/ASCVD/CKD用SGLT2i/GLP-1RA)。","调降压调脂：ACEI/ARB+SGLT2i；他汀按LDL-C目标。","每3-6月复评，稳定者每年2次；记录低血糖和依从性。"],evidence:"ADA 2026随访建议",target:{route:"disease",key:"diabetes",label:"打开糖尿病路径"}},
{id:"clinic-hypothyroid",category:"慢病复诊",title:"门诊甲减复诊：L-T4调整",steps:["TSH为目标：调整期4-6周复查，稳定后6-12月。","老年/心脏病小剂量12.5μg起始缓慢加量；妊娠增加剂量并快速达标。","晨起空腹服药，与铁/钙/抑酸药间隔4h。","妊娠期TSH按特异区间，每4-6周复查。"],evidence:"甲减基层指南",target:{route:"disease",key:"hypothyroidism",label:"打开甲减路径"}},
{id:"clinic-hyperthyroid",category:"慢病复诊",title:"门诊甲亢复诊：ATD随访",steps:["MMI起始10-30mg/PTU 100-300mg，达标后减量维持，疗程18-24月。","前3月监测血白细胞、前6月肝功能；发热咽痛立即停药查血常规。","TRAb转阴评估停药；停药首年每3月甲功。","吸烟者戒烟，评估GO风险。"],evidence:"甲亢诊治指南",target:{route:"disease",key:"hyperthyroidism",label:"打开甲亢路径"}},
{id:"clinic-gout",category:"慢病复诊",title:"门诊痛风复诊：血尿酸达标",steps:["目标<360 μmol/L，有痛风石<300；≥2次达标提示缓解。","降尿酸起始3-6月秋水仙碱0.5mg 1-2次/日预防发作。","别嘌醇起始50-100mg(查HLA-B*5801)、非布司他20-40mg、苯溴马隆25-50mg。","同步管理高血压/肾/肥胖；选促尿酸排泄降压药。"],evidence:"痛风诊疗规范",target:{route:"disease",key:"gout",label:"打开痛风路径"}},
{id:"clinic-osteoporosis",category:"慢病复诊",title:"门诊骨质疏松复诊：疗效与药物假期",steps:["治疗1-2年复查DXA：骨量稳定/上升提示有效。","口服双膦酸盐3-5年复评，低-中风险考虑药物假期。","维持钙(1000-1200mg/d)和维生素D(25OHD>20-30ng/mL)。","新发骨折/骨密度下降评估换药或促骨形成。"],evidence:"骨质疏松指南",target:{route:"disease",key:"osteoporosis",label:"打开骨质疏松路径"}},
{id:"preg-gdm",category:"特殊人群",title:"妊娠糖尿病：诊断与产后",steps:["孕24-28周75g OGTT筛查；确诊GDM后生活方式+血糖监测。","生活方式不足加胰岛素；二甲双胍/格列本脲非一线。","孕期血糖目标严格(空腹<5.3、餐后1h<7.8、2h<6.7 mmol/L)。","产后4-12周75g OGTT重新分型，远期每1-3年筛查T2D。"],evidence:"ADA 2026妊娠主题；GDM共识",target:{route:"disease",key:"diabetes",label:"打开糖尿病路径"}},
{id:"elderly-diabetes",category:"特殊人群",title:"老年糖尿病：功能导向管理",steps:["按健康/复杂/极复杂分层设A1C目标(健康<7.0-7.5%、复杂<8.0%、极复杂避免依赖A1C)。","简化方案、防低血糖；减量/停用磺脲和胰岛素。","评估认知、跌倒、肌少症、多重用药。","优先低低血糖风险、有获益的药物。"],evidence:"ADA 13章；中国老年指南",target:{route:"disease",key:"diabetes",label:"打开糖尿病路径"}},
{id:"endocrine-cross",category:"内分泌交叉",title:"内分泌交叉：多病共管要点",steps:["三高共管(高血压+糖尿病+血脂)：综合达标，避免各自为政。","代谢综合征：腹型肥胖+血压+血糖+血脂+HDL，五项评估。","OSA+肥胖影响血糖血压，睡眠监测/CPAP。","多重用药筛查相互作用和低血糖/低血压风险。"],evidence:"三高共管共识2023；OSA共识",target:{route:"disease",key:"related",label:"打开交叉主题"}},
{id:"thyroid-nodule-bedside",category:"内分泌交叉",title:"甲状腺结节：超声→FNA快速决策",steps:["先查TSH；TSH低者核素显像(热结节恶性风险低)。","C-TIRADS分层：3类≥2cm、4A≥1.5cm、4B-5≥1cm行FNA。","Bethesda III类重复FNA/分子；IV-VI手术评估。","随访：低风险6-12月超声；增大>50%或径增>20%需再评估。"],evidence:"甲状腺结节癌指南",target:{route:"disease",key:"thyroid-nodule",label:"打开甲状腺结节路径"}},
{id:"cushing-bedside",category:"内分泌交叉",title:"疑库欣：筛查三步",steps:["先排除外源性糖皮质激素。","筛查选1mg过夜DST、24h UFC、午夜唾液皮质醇之一，异常复核。","证实内源性后测ACTH分型；ACTH依赖做垂体MRI。","先定性再定位，避免仅凭意外瘤归因。"],evidence:"库欣诊治共识",target:{route:"disease",key:"cushing",label:"打开库欣路径"}}

,
{id:"oncall-thyroid-storm-full",category:"夜班急症",title:"甲状腺危象：六步综合治疗",danger:true,steps:["BWPS≥45分甲状腺危象：高热+心悸+谵妄+大汗。","PTU 600mg/d(最大1600)或MMI 60mg/d(最大120)，分次。","普萘洛尔60-80mg每4-6h；ATD后1h加无机碘。","氢化可的松100mg每8h；退热用对乙酰氨基酚，避免阿司匹林。","ICU监护；找诱因(感染/停药/术前准备不足)。"],evidence:"甲亢诊治指南",target:{route:"complication",key:"thyroid-storm-treatment",label:"打开甲状腺危象处置"}},
{id:"oncall-myxedema",category:"夜班急症",title:"黏液性水肿昏迷：急诊替代",danger:true,steps:["意识改变+低体温+低通气+低钠+心动过缓。","静脉L-T4 200-400μg负荷(心血管病者25-50μg)，之后每日50-100μg。","氢化可的松100mg每8h防肾上腺功能不全。","被动复温(勿快)、纠正低钠、机械通气支持；找诱因。"],evidence:"甲减诊治",target:{route:"complication",key:"myxedema-coma-treatment",label:"打开黏液性水肿昏迷处置"}},
{id:"oncall-hyperkalemia-full",category:"夜班急症",title:"高钾危象：心电图+三步处理",danger:true,steps:["血钾>6.5或T波高尖/宽QRS：急症。","葡萄糖酸钙10% 10mL静脉缓推稳定心肌(5-10min起效)。","胰岛素10U+葡萄糖25-50g促钾内流；沙丁胺醇雾化辅助。","利尿/树脂/透析排钾；停保钾药、纠酸、找诱因。","监测低血糖(胰岛素+葡萄糖后)。"],evidence:"电解质急症处理",target:{route:"complication",key:"hyperkalemia-treatment",label:"打开高钾处置"}},
{id:"oncall-ppgl-crisis",category:"夜班急症",title:"嗜铬细胞瘤危象：先α后β",danger:true,steps:["血压骤升+头痛+心悸+大汗，疑PPGL危象。","先α受体阻滞剂(酚妥拉明1-5mg静推/酚苄明)，控制血压并扩容。","α阻滞充分后才可加β阻滞剂控心率；禁止先β。","监测儿茶酚胺心肌病、心律失常、高血糖低血糖；术前α阻滞2-4周。"],evidence:"PPGL围术期共识",target:{route:"complication",key:"ppgl-crisis-treatment",label:"打开嗜铬危象处置"}},
{id:"oncall-pit-apoplexy-full",category:"夜班急症",title:"垂体卒中：激素先于影像",danger:true,steps:["突发头痛+视力缺损+眼肌麻痹，疑垂体卒中。","立即氢化可的松100mg静推(不等影像)，防肾上腺危象。","急诊垂体MRI；眼科评估视力视野。","占位压迫重/视力恶化者手术减压；评估全垂体轴。"],evidence:"垂体瘤诊治",target:{route:"complication",key:"pituitary-apoplexy-treatment",label:"打开垂体卒处置"}},
{id:"oncall-lactate",category:"夜班急症",title:"二甲双胍乳酸酸中毒：停药+透析评估",danger:true,steps:["二甲双胍使用者酸中毒+意识改变+低血压。","立即停二甲双胍；查血乳酸、血气、eGFR。","补液纠正酸中毒和低血压；严重/肾衰者血液透析清除二甲双胍。","处理诱因(脱水/缺氧/脓毒症/AKI)；肾功能恢复前不重启。"],evidence:"二甲双胍共识",target:{route:"complication",key:"metformin-lactic-acidosis",label:"打开乳酸酸中毒处置"}},
{id:"oncall-preg-dka",category:"夜班急症",title:"妊娠DKA：血糖可不高也要查酮体",danger:true,steps:["妊娠糖尿病患者恶心呕吐+腹痛+脱水，血糖可<250mg/dL。","查血酮、血气；持续胎心监护。","0.9%氯化钠补液；先看血钾(K>3.3再胰岛素)。","胰岛素0.05-0.1U/kg/h静脉；产科+内分泌协同。"],evidence:"ADA妊娠与危象",target:{route:"complication",key:"pregnancy-dka-treatment",label:"打开妊娠DKA处置"}}

];
