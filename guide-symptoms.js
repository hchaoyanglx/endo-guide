/* 主诉入口：从患者主诉进入鉴别诊断与指南路径，全部依据指南原文。 */
window.SYMPTOM_DIRECTORY=[
{
id:'palpitation-weightloss',group:'心血管与代谢',priority:1,title:'心悸伴消瘦，最可能是什么？',
trigger:'心悸、怕热、多汗、体重下降、手抖，或伴大便次数增多。',
summary:'先排除甲状腺毒症(尤其Graves病)，同时考虑低血糖、嗜铬细胞瘤等。',
differential:[
['甲状腺功能亢进症','心悸+消瘦+怕热多汗+手抖为典型甲亢表现。','查TSH、FT4、FT3；TSH降低+FT4/FT3升高支持甲亢，TRAb阳性支持Graves病。','中国甲状腺功能亢进症诊治指南'],
['低血糖(交感兴奋)','心悸+出汗+震颤，多在餐前或运动后，伴血糖低。','查发作时血糖；<3.9 mmol/L伴交感症状支持低血糖。','ADA低血糖章节'],
['嗜铬细胞瘤/副神经节瘤','阵发性心悸+头痛+大汗+血压骤升。','血浆游离或24h尿甲氧基肾上腺素。','PPGL诊疗共识'],
['心律失常(房颤等)','心悸+脉搏不规则，老年甲亢可伴房颤。','心电图/动态心电图；同时评估甲功。','甲亢指南、心血管主题']
],
guides:['hyperthyroidism','ppgl','hypoglycemia'],
source:'甲状腺功能亢进症诊治指南；ADA；PPGL共识',evidence:'甲亢诊治指南TSH/FT4/TRAb；PPGL甲氧基肾上腺素；ADA低血糖',interpretation:{"TSH/FT4/FT3": ["TSH参考0.27-4.2 mU/L；FT4正常12-22 pmol/L", "甲亢：TSH↓+FT4/FT3↑；亚临床甲亢仅TSH↓", "TSH<0.1为重度抑制，老年/房颤者需治疗"], "TRAb": ["正常<1.75 IU/L；>3.5 IU/L支持Graves病", "TRAb阳性+甲亢+弥漫甲状腺肿=Graves", "TRAb持续高提示131I/停药后复发风险"], "血β-羟丁酸": ["正常<0.6 mmol/L；酮症≥3.0", "低血糖发作血糖<3.9伴交感症状", "低血糖分级：1级<3.9、2级<3.0、3级需他人帮助"]}
},
{
id:'polyuria-polydipsia',group:'糖代谢',priority:2,title:'多饮多尿：先查血糖和尿比重',
trigger:'口渴多饮、夜尿增多、体重下降，或伴乏力。',
summary:'首先区分糖尿病、尿崩症、原发性烦渴；查血糖和尿比重是关键。',
differential:[
['糖尿病(1型/2型/LADA)','多饮多尿+体重下降+血糖升高。','查空腹血糖/HbA1c/随机血糖；酮症提示1型可能。','ADA诊断标准'],
['尿崩症(中枢性/肾性)','多尿+低比重尿(<1.005)+烦渴，禁水试验尿量不减少。','尿比重、血/尿渗透压、禁水试验；中枢性者MRI查垂体。','尿崩症相关指南'],
['原发性烦渴/精神性多饮','多尿但禁水试验正常，血钠可低。','排除后诊断；心理评估。','尿崩症鉴别'],
['高钙血症','多尿+烦渴+便秘+乏力。','查血钙、PTH；高钙可致肾性尿崩。','高钙处理指南']
],
guides:['diabetes','diabetes-insipidus','primary-hyperpara'],
source:'ADA诊断标准；尿崩症鉴别；高钙处理',evidence:'ADA诊断标准；尿崩症禁水试验；高钙处理',interpretation:{"空腹血糖": ["正常<5.6 mmol/L；糖尿病前期5.6-6.9；糖尿病≥7.0", "诊断需两个异常或典型症状+随机≥11.1", "血糖≥16.7伴意识改变警惕高渗"], "HbA1c": ["正常<5.7%；糖尿病前期5.7-6.4%；糖尿病≥6.5%", "反映近2-3月平均血糖", ">9%提示控制差需强化"], "尿比重": ["正常1.003-1.030；尿崩症<1.005", "低比重+多尿提示尿崩", "禁水试验鉴别中枢/肾性/精神性多饮"]}
},
{
id:'bone-pain-fracture',group:'骨与矿物质',priority:3,title:'骨痛或轻微外伤即骨折',
trigger:'腰背痛、身高变矮、轻微外伤即骨折，或骨密度下降。',
summary:'骨质疏松为最常见原因，但需排查继发因素(甲旁亢、库欣、多发性骨髓瘤等)。',
differential:[
['骨质疏松症','绝经后/老年、脆性骨折、DXA T值≤-2.5。','DXA、椎体影像；评估继发原因和维生素D。','骨质疏松诊疗指南'],
['原发性甲状旁腺功能亢进症','高钙+高PTH+骨量低，可有肾结石。','血钙、PTH、尿钙；定位(超声/MIBI)。','甲旁亢诊疗'],
['库欣综合征','骨量低+向心性肥胖+紫纹+易瘀斑。','1mg过夜DST、24h UFC、午夜唾液皮质醇。','库欣指南'],
['多发性骨髓瘤','骨痛+贫血+肾功能异常+球蛋白升高。','血/尿蛋白电泳、免疫固定电泳。','相关血液病指南']
],
guides:['osteoporosis','primary-hyperpara','cushing'],
source:'骨质疏松诊疗指南；甲旁亢；库欣；骨髓瘤',evidence:'骨质疏松DXA T值；甲旁亢PTH；库欣DST；骨髓瘤电泳',interpretation:{"DXA T值": ["T值≥-1.0正常；-1.0~-2.5低骨量；≤-2.5骨质疏松", "脆性骨折时T值未达-2.5也需治疗", "FRAX评估10年骨折风险"], "25OHD": ["<20缺乏、20-30不足、>30充足", "VD缺乏加重骨松", "补充后复查"]}
},
{
id:'hypertension-hypokalemia',group:'肾上腺与高血压',priority:4,title:'高血压合并低钾：先排查原醛',
trigger:'高血压伴自发性低钾，或难治性高血压、早发高血压。',
summary:'原醛症(醛固酮瘤/特醛症)是核心考虑，同时排查库欣、Liddle综合征等。',
differential:[
['原发性醛固酮增多症','高血压+低钾+醛固酮高/肾素低(ARR高)。','纠正低钾后测醛固酮+肾素(DRC)算ARR；确诊试验；CT/AVS分型。','原醛共识'],
['库欣综合征','高血压+低钾+向心性肥胖+紫纹。','过夜DST、UFC、午夜唾液皮质醇。','库欣指南'],
['Liddle综合征','高血压+低钾+低醛固酮+低肾素(与醛固酮瘤相反)。','醛固酮/肾素低支持；家族史。','继发性高血压鉴别'],
['嗜铬细胞瘤','阵发性高血压+低钾+心悸大汗。','甲氧基肾上腺素类。','PPGL共识']
],
guides:['primary-aldosteronism','cushing','ppgl'],
source:'原醛共识；库欣指南；PPGL共识；继发性高血压筛查',evidence:'原醛ARR切点与确诊试验；库欣DST；PPGL甲氧基肾上腺素',interpretation:{"血钾": ["正常3.5-5.5 mmol/L；<3.5低钾", "低钾+高血压提示原醛/库欣/Liddle", "<2.5或伴心律失常为危象"], "ARR": ["PRA口径切点30；DRC(mU/L)口径切点3.7", "醛固酮>15 ng/dL才判阳性", "筛查前纠正低钾、记录体位药物"], "醛固酮": ["卧位5-30 ng/dL；原醛常>20", "醛固酮↑+肾素↓=原醛特征", "确诊需盐水/卡托普利试验"]}
},
{
id:'fatigue-weightgain',group:'代谢与甲状腺',priority:5,title:'乏力伴体重增加：查甲功',
trigger:'乏力、畏寒、体重增加、便秘、皮肤干燥、反应迟钝。',
summary:'甲状腺功能减退症为最常见内分泌病因，需与肥胖、抑郁等鉴别。',
differential:[
['甲状腺功能减退症','乏力+畏寒+体重增+便秘+皮肤干+TSH升高。','查TSH、FT4；TPOAb评估自身免疫病因。','甲减基层指南'],
['肥胖/代谢综合征','体重增加+腹型肥胖，甲功正常。','BMI、腰围、血糖血脂。','成人体重管理指南'],
['库欣综合征','体重增+向心性肥胖+紫纹。','过夜DST等。','库欣指南'],
['抑郁/慢性疲劳','乏力+情绪低落，内分泌检查正常。','甲功正常后心理评估。','鉴别诊断']
],
guides:['hypothyroidism','obesity','cushing'],
source:'甲减基层指南；肥胖指南；库欣指南',evidence:'甲减TSH/FT4/TPOAb；肥胖BMI；库欣DST',interpretation:{"TSH": ["正常0.27-4.2 mU/L；甲减TSH↑", "TSH↑+FT4↓=临床甲减；TSH↑+FT4正常=亚临床", "TSH>10伴TPOAb阳性应治疗"], "TPOAb": ["正常<34 IU/mL；升高提示桥本", "TPOAb阳性支持自身免疫甲减", "抗体阳性提示进展风险，妊娠更需积极"]}
},
{
id:'hypercalcemia',group:'骨与矿物质',priority:6,title:'体检发现血钙升高：怎么办？',
trigger:'无症状体检发现，或伴便秘、多尿、肾结石、骨痛、乏力。',
summary:'原发性甲旁亢最常见，但需排查恶性肿瘤、维生素D中毒等。',
differential:[
['原发性甲状旁腺功能亢进症','高钙+高PTH+高尿钙，最常见。','血钙、PTH、25OHD、尿钙；超声/MIBI定位。','甲旁亢诊疗'],
['恶性肿瘤相关高钙','高钙+PTH低，伴肿瘤病史或体重下降。','查PTHrP、肿瘤筛查。','高钙危象处理'],
['维生素D中毒','高钙+高25OHD，大量补D史。','查25OHD。','维生素D共识'],
['家族性低尿钙性高钙血症(FHH)','高钙+高PTH但尿钙低。','尿钙/肌酐比；CASR基因检测。','甲旁亢鉴别']
],
guides:['primary-hyperpara','osteoporosis'],
source:'甲旁亢诊疗；高钙处理；维生素D共识',evidence:'甲旁亢PTH/尿钙；高钙危象处理；维生素D',interpretation:{"血钙": ["总钙2.11-2.52 mmol/L；>2.75高钙", "校正钙=总钙+0.02×(40-白蛋白)", ">3.5为高钙危象需紧急"], "PTH": ["正常15-65 pg/mL", "高钙+PTH高=原发甲旁亢；PTH低=恶性肿瘤/VD中毒", "FHH：高钙+高PTH但尿钙低"], "25OHD": ["正常>30 ng/mL；缺乏<20", "VD缺乏可致继发甲旁亢", "补充后复查血钙"]}
},
{
id:'hirsutism-menstrual',group:'性腺与生殖',priority:7,title:'多毛伴月经紊乱：排查高雄激素',
trigger:'多毛、痤疮、月经稀发、肥胖，育龄女性。',
summary:'多囊卵巢综合征最常见，需排查库欣、先天性肾上腺增生、泌乳素瘤等。',
differential:[
['多囊卵巢综合征(PCOS)','月经稀发+高雄激素+卵巢多囊样改变，常伴肥胖。','性激素、AMH、超声；排除其他高雄激素原因。','PCOS共识'],
['库欣综合征','多毛+向心性肥胖+紫纹。','过夜DST等。','库欣指南'],
['先天性肾上腺增生(CAH)','青春期前发病，高雄激素+可伴高血压。','17-OHP、ACTH、肾上腺CT。','21-OHD指南'],
['高泌乳素血症','月经紊乱+溢乳+PRL升高。','查PRL、垂体MRI。','泌乳素瘤共识']
],
guides:['pcos-androgen','cushing','pituitary-tumor'],
source:'PCOS共识；库欣；21-OHD；泌乳素瘤',evidence:'PCOS诊断标准；库欣DST；21-OHD 17-OHP；泌乳素瘤PRL',interpretation:{"总睾酮": ["女性0.2-0.7 ng/mL", "升高提示高雄激素", ">2 ng/mL排除PCOS查肾上腺/卵巢"], "17-OHP": ["正常<8 nmol/L；>15提示21-OHD", "排查先天性肾上腺增生", "ACTH兴奋试验确诊"], "AMH": ["PCOS常升高", "PCOS辅助诊断", "联合超声性激素"]}
},
{
id:'pituitary-headache-vision',group:'垂体',priority:8,title:'头痛伴视力视野障碍：警惕垂体病变',
trigger:'头痛、视力下降、视野缺损，或伴内分泌症状。',
summary:'垂体瘤(尤其大腺瘤)压迫视交叉可致双颞侧偏盲，需急诊评估。',
differential:[
['垂体大腺瘤压迫','头痛+双颞侧偏盲+可伴内分泌异常。','垂体MRI；快速视力恶化需急诊。','垂体瘤指南'],
['泌乳素瘤(大)','头痛+视力障碍+PRL显著升高+性腺功能减退。','PRL、垂体MRI；多巴胺激动剂一线。','泌乳素瘤共识'],
['颅咽管瘤/其他鞍区病变','头痛+视力障碍+可伴尿崩。','垂体MRI+内分泌全轴评估。','鞍区病变鉴别'],
['垂体卒中','突发头痛+视力下降+恶心，垂体瘤基础上。','急诊MRI；需激素替代评估。','垂体卒中处理']
],
guides:['pituitary-tumor'],
source:'垂体瘤指南；泌乳素瘤共识；垂体卒中',evidence:'垂体瘤MRI；泌乳素瘤PRL；垂体卒中',interpretation:{"垂体MRI": ["微/大腺瘤", "压迫视交叉致双颞侧偏盲", "卒中时急诊"], "PRL": [">200提示泌乳素瘤", "大腺瘤需稀释查", "钩状效应"]}
},
{
id:'hypoglycemia-episodes',group:'糖代谢',priority:9,title:'反复低血糖发作：Whipple三联征',
trigger:'发作性出汗、心悸、饥饿、意识模糊，血糖低，进食后缓解(Whipple三联征)。',
summary:'糖尿病用药(胰岛素/促泌剂)最常见，但需排查胰岛素瘤等内源性高胰岛素血症。',
differential:[
['药物相关低血糖','用胰岛素/磺脲类/格列奈类，发作与用药相关。','调整用药、查血糖；记录诱因。','ADA低血糖'],
['胰岛素瘤','空腹低血糖+内源性高胰岛素(高C肽+高胰岛素)。','72h饥饿试验、胰岛素/C肽/血糖。','低血糖鉴别'],
['肝肾功能不全','清除胰岛素能力下降，用药后低血糖。','查肝肾功能。','低血糖管理'],
['肾上腺皮质功能不全','低血糖+乏力+低血压+皮肤色素沉着。','晨皮质醇、ACTH。','肾上腺功能不全指南']
],
guides:['hypoglycemia','adrenal-other'],
source:'ADA低血糖；胰岛素瘤鉴别；肾上腺功能不全',evidence:'ADA低血糖Whipple三联征；胰岛素瘤72h饥饿试验；肾上腺功能不全',interpretation:{"发作血糖": ["<3.9 mmol/L伴症状", "供糖后缓解=Whipple三联征", "胰岛素瘤需72h饥饿试验"], "C肽/胰岛素": ["胰岛素瘤C肽↑+胰岛素↑", "与血糖同测", "药物性低血糖鉴别"]}
},
{
id:'edema-osteoporosis',group:'骨与矿物质',priority:10,title:'身高变矮或驼背：警惕椎体骨折',
trigger:'中老年人身高缩短>3-4cm、驼背、腰背痛，提示椎体压缩骨折。',
summary:'骨质疏松性椎体骨折是主要考虑，需评估骨密度和骨折风险。',
differential:[
['骨质疏松性椎体骨折','身高变矮+驼背+腰背痛，DXA低骨量。','脊柱影像(压缩骨折)、DXA、FRAX。','骨质疏松指南'],
['多发性骨髓瘤','骨痛+贫血+高钙+肾功能异常。','蛋白电泳、免疫固定电泳。','骨髓瘤'],
['转移性骨肿瘤','骨痛+既往肿瘤史，可伴高钙。','骨扫描/影像、肿瘤标志物。','肿瘤相关'],
['Paget骨病','骨痛+碱性磷酸酶升高+影像异常。','ALP、骨影像。','Paget病']
],
guides:['osteoporosis'],
source:'骨质疏松诊疗指南；椎体骨折管理',evidence:'骨质疏松椎体骨折；骨髓瘤电泳',interpretation:{"脊柱影像": ["椎体压缩骨折", "身高缩短>3-4cm提示", "MRI评估陈旧/新鲜"], "DXA": ["评估骨密度", "FRAX", "治疗后复查"]}
}
,
{
id:'joint-swelling-pain',group:'骨与矿物质',priority:11,title:'急性关节红肿痛：痛风还是感染？',
trigger:'第一跖趾关节或大关节突发红肿热痛，24h内达峰，或反复发作。',
summary:'痛风急性发作是最典型场景，但需与化脓性关节炎、假性痛风鉴别。',
differential:[
['痛风急性发作','足第一跖趾关节最常受累、剧痛红肿、血尿酸可正常。','关节液偏振光镜检见MSU结晶为金标准；血尿酸、超声双轨征/双能CT。','痛风诊疗规范'],
['化脓性关节炎','单关节红肿热痛+发热+白细胞升高，关节液混浊。','关节液培养、革兰染色、细胞计数；需急诊排感染。','感染性关节炎'],
['焦磷酸钙沉积病(假性痛风)','膝/腕关节急性发作，关节液见CPPD结晶。','关节液偏振光镜检(弱正性双折光)、X线软骨钙化。','晶体性关节炎鉴别'],
['反应性关节炎/银屑病关节炎','非对称下肢关节肿痛，可有尿道炎/皮疹。','病史、关节外表现、影像。','炎性关节病']
],
guides:['gout'],
source:'痛风诊疗规范；晶体性关节炎鉴别',evidence:'痛风MSU结晶金标准；化脓性关节炎培养',interpretation:{"血尿酸": ["男<420、女<360 μmol/L", "高尿酸血症≠痛风；发作期可正常", "发作期正常不能排除，需关节液"], "关节液MSU": ["偏振光见负性双折光结晶=确诊", "金标准", "化脓性：白细胞>50,000伴培养阳性"], "ESR/CRP": ["急性痛风可升高", "感染性显著升高", "鉴别化脓性需紧急"]}
},
{
id:'neck-mass-thyroid',group:'甲状腺',priority:12,title:'颈部肿块或甲状腺肿：先分良恶性',
trigger:'颈部前方肿块、吞咽异物感、颈围增大，或体检发现甲状腺结节。',
summary:'先分甲状腺结节良恶性风险(C-TIRADS)，同时评估甲功和压迫症状。',
differential:[
['甲状腺结节','颈部肿块随吞咽上下移动，超声评估。','TSH、甲状腺超声C-TIRADS分层、必要时FNA。','甲状腺结节癌指南'],
['甲状腺肿(单纯性/结节性)','弥漫或结节性肿大，甲功可正常。','TSH/FT4、超声、必要时摄碘率。','甲状腺疾病'],
['甲状腺癌(可疑)','结节硬、固定、声嘶、淋巴结肿大，超声恶性征象。','FNA/Bethesda、颈部淋巴结超声。','甲状腺结节癌指南'],
['甲状腺炎','颈前区疼痛+甲功异常(甲亢期/甲减期)。','甲功、ESR、TPOAb/TgAb、甲状腺摄碘率。','甲状腺炎']
],
guides:['thyroid-nodule','hyperthyroidism','hypothyroidism'],
source:'甲状腺结节癌指南；甲状腺炎鉴别',evidence:'甲状腺结节癌指南C-TIRADS与FNA；甲功',interpretation:{"甲状腺超声": ["C-TIRADS分层", "恶性征象：低回声/边界不清/微钙化", "淋巴结评估"], "TSH": ["低者核素显像", "热结节", "功能评估"]}
},
{
id:'vision-blurred',group:'代谢与甲状腺',priority:13,title:'视物模糊或视力下降：排查糖网和TAO',
trigger:'视物模糊、眼前黑影、视力下降，糖尿病患者或甲亢患者出现。',
summary:'糖尿病视网膜病变和甲状腺相关眼病(DON)是内分泌两大致盲原因，需与白内障等鉴别。',
differential:[
['糖尿病视网膜病变','糖尿病病程长，视物模糊、飞蚊症，眼底出血渗出。','散瞳眼底检查、OCT、荧光造影；按严重度分级。','糖尿病视网膜病变指南'],
['糖尿病黄斑水肿(DME)','中心视力下降、视物变形。','OCT评估黄斑中心受累。','DME管理'],
['甲状腺相关眼病视神经病变(DON)','甲亢/甲减患者，视力下降+色觉异常+RAPD。','CAS评分、眼眶MRI、视野、视觉诱发电位；需紧急处理。','甲亢眼病指南'],
['白内障/青光眼','渐进性视力下降，糖尿病患者更早发生。','裂隙灯、眼压、眼底。','眼科常规']
],
guides:['diabetes','hyperthyroidism'],
source:'糖尿病视网膜病变指南；甲亢眼病指南',evidence:'糖网分期筛查；甲亢眼病DON评估',interpretation:{"眼底": ["散瞳眼底", "NPDR/PDR分期", "黄斑水肿OCT"], "眼压": ["正常10-21 mmHg", "青光眼排查", "TAO需眼科"]}
},
{
id:'foot-ulcer',group:'代谢与甲状腺',priority:14,title:'糖尿病足溃疡或足痛：三查',
trigger:'糖尿病患者足部破溃、经久不愈、足趾发黑、行走痛，或足部红热肿。',
summary:'糖尿病足需同时评估神经、缺血、感染三方面；警惕Charcot神经骨关节病。',
differential:[
['糖尿病足溃疡/感染','糖尿病患者足部溃疡，可伴红肿热痛或探针触骨。','Wagner/IWGDF分级、神经(10g单丝)、ABI/TBI、感染评估。','糖尿病足指南'],
['糖尿病周围动脉病变(PAD)','间歇性跛行、足凉、趾压降低、ABI<0.9。','ABI、TBI、CTA/MRA血管评估。','糖尿病足缺血'],
['Charcot神经骨关节病','足部红热肿但不痛，神经病变明显，X线骨破坏。','X线/MRI、立即减负固定，避免负重。','Charcot病'],
['蜂窝织炎/骨髓炎','红肿热痛+发热，探针触骨/ESR升高提示骨髓炎。','深部培养、骨X线/MRI、ESR/CRP。','糖尿病足感染']
],
guides:['diabetes'],
source:'糖尿病足诊治指南；糖尿病足感染共识',evidence:'IWGDF足感染分级；ABI/TBI；Charcot影像',interpretation:{"ABI": ["正常0.9-1.3；<0.9提示PAD", "动脉钙化时ABI假性升高", "TBI更准确"], "10g单丝": ["5点触诊", "保护性感觉丧失=高危足", "Wagner/IWGDF分级"], "ESR/CRP": ["升高提示骨髓炎/感染", "探针触骨阳性", "需骨培养"]}
},
{
id:'galactorrhea-amenorrhea',group:'性腺与生殖',priority:15,title:'溢乳伴闭经：查泌乳素',
trigger:'非哺乳期溢乳、月经稀发或闭经、不孕、性欲减退。',
summary:'高泌乳素血症(泌乳素瘤最常见)为核心，需排除药物、甲状腺功能减退等。',
differential:[
['高泌乳素血症/泌乳素瘤','溢乳+闭经+PRL升高；大腺瘤可压迫视交叉。','PRL(需稀释防钩状效应)、垂体MRI；多巴胺激动剂。','泌乳素瘤共识'],
['甲状腺功能减退','溢乳+乏力+畏寒+TSH升高(TRH升高刺激PRL)。','TSH/FT4、PRL。','甲减指南'],
['药物性高泌乳素','服用抗精神病药/胃动力药/雌激素等。','停药/换药评估、PRL。','高泌乳素药物'],
['多囊卵巢综合征','闭经/稀发+高雄激素，PRL正常。','性激素、超声。','PCOS共识']
],
guides:['pituitary-tumor','hypothyroidism'],
source:'泌乳素瘤共识；甲减指南；PCOS共识',evidence:'泌乳素瘤PRL与MRI；甲减TSH；PCOS',interpretation:{"PRL": ["正常女4.8-23.3 ng/mL；>30高泌乳素", ">200强烈提示泌乳素瘤", "大腺瘤需稀释复查防钩状效应"], "垂体MRI": ["微腺瘤<1cm、大腺瘤≥1cm", "定位泌乳素瘤", "压迫视交叉需手术评估"]}
},
{
id:'hypokalemia',group:'电解质',priority:16,title:'低钾血症：找病因还是急症？',trigger:'血钾<3.5 mmol/L，或伴乏力、心律失常、肌无力、多尿。',summary:'低钾需评估摄入/丢失/分布，排查利尿剂、原醛、库欣、甲亢周期性麻痹等内分泌病因。',differential:[['利尿剂/胃肠道丢失','噻嗪/袢利尿剂、腹泻、呕吐、泻药。','停药/补钾、查尿钾、血镁。','电解质管理'],['原发性醛固酮增多症','高血压+低钾+醛固酮高/肾素低。','纠正低钾后测ARR，确诊试验。','原醛共识'],['库欣综合征','高血压+低钾+向心性肥胖。','过夜DST、UFC。','库欣指南'],['甲亢周期性麻痹','低钾+肌无力，亚洲男性甲亢患者。','甲功、血钾。','甲亢指南']],guides:['primary-aldosteronism','cushing','hyperthyroidism'],source:'原醛共识；库欣指南；甲亢指南',evidence:'低钾鉴别',interpretation:{"血钾": ["正常3.5-5.5；<3.5低钾", "轻度3.0-3.5、中度2.5-3.0、重度<2.5", "<2.5或伴心律失常为危象"], "尿钾": ["随机尿钾>20 mmol/L提示肾性丢失", "区分肾性/胃肠", "排查利尿剂/原醛/库欣"], "血镁": ["正常0.75-1.0 mmol/L", "低镁常伴低钾", "低镁不纠则低钾难纠正"]}},
{
id:'gynecomastia',group:'性腺与生殖',priority:17,title:'男性乳房发育：生理还是病理？',trigger:'男性单侧/双侧乳房增大、胀痛，或乳晕下盘状肿块。',summary:'男性乳房发育需鉴别生理性、药物性、性腺功能减退、肝硬化、肿瘤等。',differential:[['生理性/老年性','青春期或老年，睾酮/雌二醇比例变化。','观察、查性激素。','乳房发育指南'],['药物性','螺内酯、抗雄激素、阿片、部分抗抑郁药等。','停用/换药评估。','乳房发育指南'],['性腺功能减退','乳房发育+性欲减退+睾酮低+FSH/LH升高。','睾酮、FSH/LH、泌乳素。','性腺功能减退'],['其他病因','肝硬化、甲亢、泌乳素瘤、睾丸肿瘤。','肝功、甲功、PRL、睾酮、HCG。','乳房发育指南']],guides:['gynecomastia-hypogonadism','pituitary-tumor'],source:'SIAMS男性乳房发育指南',evidence:'乳房发育病因鉴别',interpretation:{"睾酮": ["男性8.6-29 nmol/L", "低睾酮+FSH/LH高=性腺功能减退", "排查肿瘤/药物/肝硬化"], "雌二醇": ["男性<40 pg/mL", "E2/T比值升高可致乳房发育", "药物(螺内酯)常见"]}},
{
id:'edema',group:'代谢与甲状腺',priority:18,title:'下肢或面部浮肿：先查甲功和肾',trigger:'下肢/眼睑水肿、体重增加、乏力、怕冷。',summary:'水肿需排查甲减(黏液性水肿)、肾病、心衰、低蛋白等内分泌与非内分泌病因。',differential:[['甲状腺功能减退症','水肿+怕冷+乏力+便秘+TSH升高。','甲功、TPOAb。','甲减指南'],['肾病综合征/糖尿病肾病','水肿+蛋白尿+低蛋白。','UACR、24h尿蛋白、肾功能。','DKD共识'],['心衰','水肿+呼吸困难+颈静脉怒张。','BNP/NT-proBNP、超声。','心衰'],['低蛋白/肝病','水肿+腹水+肝功异常。','白蛋白、肝功。','肝病']],guides:['hypothyroidism','diabetes'],source:'甲减指南；DKD共识',evidence:'水肿鉴别',interpretation:{"TSH": ["甲减TSH↑", "黏液性水肿致浮肿", "浮肿+怕冷+乏力提示甲减"], "UACR": ["正常<30 mg/g", "肾病综合征大量蛋白尿", "24h尿蛋白>3.5g为肾病综合征"]}},
{
id:'hypernatremia',group:'电解质',priority:19,title:'高钠伴烦渴多尿：排查尿崩症',trigger:'血钠>145 mmol/L，或烦渴、多尿、意识改变。',summary:'高钠多由水丢失/摄入不足引起，需排查尿崩症(中枢性/肾性)、原发性烦渴。',differential:[['尿崩症(中枢性)','多尿+低比重尿+高钠，禁水试验尿量不减少，去氨加压素有效。','禁水试验、尿比重、垂体MRI。','尿崩症'],['肾性尿崩症','多尿+对去氨加压素无反应。','病因(锂剂、高钙、低钾)。','尿崩症'],['水摄入不足/丢失','老年、卧床、发热、腹泻，饮水不足。','补液、评估容量。','电解质'],['原发性烦渴','多饮多尿，禁水试验正常。','精神评估。','尿崩症鉴别']],guides:['diabetes-insipidus'],source:'尿崩症诊治；电解质管理',evidence:'高钠与尿崩',interpretation:{"血钠": ["正常135-145 mmol/L；>145高钠", "高钠提示水丢失或摄入不足", "尿崩可致高钠"], "尿比重": ["尿崩<1.005", "禁水试验鉴别", "中枢性对去氨加压素有效"]}},
{
id:'lipid-abnormal',group:'代谢与甲状腺',priority:20,title:'体检血脂异常：评估继发原因',trigger:'体检LDL-C升高、TG升高，或伴黄色瘤、早发冠心病家族史。',summary:'血脂异常需评估原发性/继发性(甲减、肾病、库欣、糖尿病)，按心血管风险分层。',differential:[['原发性高脂血症','家族史、早发ASCVD、黄色瘤。','血脂全套、Lp(a)、家族筛查。','血脂指南'],['甲状腺功能减退','血脂升高+甲减表现+TSH升高。','甲功；甲减致继发高脂。','甲减指南'],['糖尿病/代谢综合征','血脂异常+高血糖+腹型肥胖。','血糖、HbA1c。','糖尿病血脂共识'],['肾病/库欣','肾病综合征、库欣综合征可致血脂升高。','尿蛋白、皮质醇。','血脂鉴别']],guides:['dyslipidemia','hypothyroidism','diabetes'],source:'糖尿病患者血脂管理共识2024；SIE血脂声明',evidence:'血脂继发因素',interpretation:{"LDL-C": ["极高危<1.4、高危<1.8 mmol/L", "LDL是降脂主要目标", "未达标加依折麦布/PCSK9"], "TG": ["正常<1.7；>5.6防胰腺炎", "TG升高找继发(甲减/肾病/酒精)", ">11.3重度需尽快处理"]}},
{
id:'abnormal-tft',group:'甲状腺',priority:21,title:'体检甲功异常无症状：亚临床怎么办？',trigger:'体检TSH/FT4异常但无症状，或亚临床甲亢/甲减。',summary:'无症状甲功异常需判断是亚临床甲亢/甲减，结合年龄、妊娠、抗体决定处理。',differential:[['亚临床甲减','TSH升高+FT4正常，TPOAb阳性提示自身免疫。','复查甲功、TPOAb；妊娠/高TSH者考虑治疗。','甲减指南'],['亚临床甲亢','TSH降低+FT4正常。','复查、TRAb、超声；老年/房颤评估治疗。','甲亢指南'],['检验干扰/一过性','药物(胺碘酮、锂)、近期甲炎恢复期。','复查、停药评估。','甲功检验共识'],['妊娠特异','妊娠期TSH参考区间不同。','妊娠特异区间、产科协同。','甲减妊娠']],guides:['hypothyroidism','hyperthyroidism'],source:'甲减指南；甲亢指南；甲功检验共识',evidence:'亚临床甲功处理',interpretation:{"TSH": ["亚临床甲减TSH 4.2-10；亚临床甲亢TSH<0.1", "结合TPOAb和妊娠", "TSH>10或妊娠TPOAb阳性考虑治疗"], "TPOAb": ["升高提示桥本", "阳性亚临床甲减进展风险高", "妊娠期需积极"]}},
{
id:'incidental-adrenal',group:'肾上腺',priority:22,title:'肾上腺意外瘤：先做功能评估',trigger:'CT/MRI偶然发现肾上腺结节，无相关症状。',summary:'肾上腺意外瘤需激素功能评估(皮质醇/儿茶酚胺/醛固酮)和影像恶性风险评估。',differential:[['无功能腺瘤','HU≤10，激素评估正常，<4cm。','影像+激素评估；随访。','肾上腺意外瘤共识'],['自主皮质醇分泌','过夜DST抑制异常，库欣样表现。','过夜DST、UFC、ACTH。','肾上腺意外瘤共识'],['嗜铬细胞瘤','甲氧基肾上腺素升高，可阵发高血压。','血/尿甲氧基肾上腺素。','PPGL共识'],['醛固酮瘤','高血压+低钾+ARR高。','ARR、确诊试验。','原醛共识']],guides:['adrenal-incidentaloma','primary-aldosteronism','ppgl','cushing'],source:'老年人肾上腺意外瘤专家意见2025',evidence:'意外瘤激素评估',interpretation:{"过夜DST": ["服地塞米松1mg后晨皮质醇<50 nmol/L正常", ">50提示自主皮质醇分泌", ">138为库欣"], "甲氧基肾上腺素": ["血浆<0.5 nmol/L正常", "升高提示嗜铬细胞瘤", ">3倍正常显著升高"], "HU值": ["HU≤10良性", ">20需评估恶性", "≥4cm考虑手术"]}},
{
id:'incidental-thyroid',group:'甲状腺',priority:23,title:'甲状腺结节：按C-TIRADS分层',trigger:'体检/超声偶然发现甲状腺结节，无症状。',summary:'甲状腺结节评估分两步：甲功+超声风险分层(C-TIRADS)，按大小决定FNA。',differential:[['良性结节','C-TIRADS 2-3类，低恶性风险。','随访6-12月超声。','甲状腺结节癌指南'],['可疑结节','C-TIRADS 4A-5类，按大小FNA。','4A≥1.5cm、4B-5≥1cm FNA。','甲状腺结节癌指南'],['甲状腺癌','超声恶性征象、淋巴结转移。','FNA/Bethesda、颈淋巴结超声。','甲状腺结节癌指南'],['高功能结节','TSH降低+热结节。','核素显像；热结节恶性风险低。','甲状腺结节癌指南']],guides:['thyroid-nodule'],source:'甲状腺结节和分化型甲状腺癌诊治指南(第二版)',evidence:'C-TIRADS与FNA',interpretation:{"C-TIRADS": ["3类<2%、4A 2-10%、4B 10-50%、4C 50-90%、5类>90%", "按类+大小定FNA", "4B-5类≥1cm行FNA"], "TSH": ["低者核素显像", "热结节恶性风险低", "功能评估必须"]}},
{
id:'hypercalcemia-symptom',group:'骨与矿物质',priority:24,title:'高钙相关症状：便秘多尿乏力',trigger:'便秘、多尿、口渴、乏力、肾结石，或血钙升高。',summary:'高钙血症最常见原因为甲旁亢和恶性肿瘤，需按PTH水平鉴别并紧急处理重度高钙。',differential:[['原发性甲旁亢','高钙+高PTH+高尿钙。','血钙、PTH、25OHD、尿钙；定位。','甲旁亢'],['恶性肿瘤高钙','高钙+低PTH，伴肿瘤。','PTHrP、肿瘤筛查。','高钙危象'],['维生素D中毒/结节病','高钙+高25OHD或肉芽肿。','25OHD、ACE、胸片。','高钙鉴别'],['家族性低尿钙高钙(FHH)','高钙+高PTH+低尿钙。','尿钙/肌酐比、CASR基因。','甲旁亢鉴别']],guides:['primary-hyperpara'],source:'甲旁亢诊疗；高钙危象处理',evidence:'高钙鉴别',interpretation:{"血钙": [">2.75高钙", "症状随血钙升高加重", ">3.5危象需紧急"], "PTH": ["高PTH=甲旁亢", "低PTH=恶性肿瘤等", "鉴别FHH"]}}

];

/* 研究生30天学习路径：按系统组织，每天主题+病例+指南，完全依据指南原文。 */
window.LEARNING_PATH=[
{day:1,group:'糖代谢',title:'糖尿病诊断与分型',focus:'从血糖/HbA1c/OGTT确诊，区分1型/2型/LADA，不凭年龄体型定型',key:'诊断',caseRef:'1型还是2型',guide:'ADA诊断与分型',disease:'diabetes'},
{day:2,group:'糖代谢',title:'糖尿病前期与预防',focus:'切点、高危人群、强化生活方式减重5-7%、二甲双胍指征',key:'预防',caseRef:'糖尿病前期干预',guide:'ADA预防主题',disease:'prediabetes'},
{day:3,group:'糖代谢',title:'2型糖尿病选药总原则',focus:'先排主导共病(心衰/ASCVD/CKD/肥胖)，再按降糖效力/低血糖/体重/费用选药',key:'选药',caseRef:'T2D合并心衰',guide:'ADA药物治疗',disease:'diabetes'},
{day:4,group:'糖代谢',title:'二甲双胍与其他口服药',focus:'二甲双胍一线地位、eGFR<30禁用、联合策略(DPP-4/SGLT2/磺脲)',key:'口服药',caseRef:'二甲双胍禁忌',guide:'基层糖尿病指南',disease:'diabetes'},
{day:5,group:'糖代谢',title:'SGLT2i与GLP-1RA心肾获益',focus:'合并ASCVD/心衰/CKD时优先结局获益药物，不受A1C限制',key:'心肾保护',caseRef:'SGLT2i心衰',guide:'ADA心血管主题',disease:'diabetes'},
{day:6,group:'糖代谢',title:'胰岛素起始与调整',focus:'1型持续基础；2型起始0.1-0.2U/kg，防过度基础化',key:'胰岛素',caseRef:'基础胰岛素起始',guide:'ADA胰岛素主题',disease:'diabetes'},
{day:7,group:'糖代谢',title:'糖尿病急症：DKA/HHS/低血糖',focus:'DKA三要素、补钾优先、HHS诊断、低血糖分级与处理',key:'急症',caseRef:'DKA补钾原则',guide:'高血糖危象共识',disease:'hypoglycemia'},
{day:8,group:'甲状腺',title:'甲亢：诊断与ATD治疗',focus:'TSH/FT4/TRAb，MMI起始10-30mg，妊娠早期PTU',key:'甲亢',caseRef:'甲亢ATD选择',guide:'甲亢诊治指南',disease:'hyperthyroidism'},
{day:9,group:'甲状腺',title:'甲状腺危象',focus:'BWPS≥45危象、PTU+β阻滞剂+碘+激素综合治疗',key:'危象',caseRef:'甲状腺危象识别',guide:'甲亢诊治指南',disease:'hyperthyroidism'},
{day:10,group:'甲状腺',title:'Graves眼病(TAO)',focus:'CAS活动性≥3、EUGOGO严重度、戒烟、糖皮质激素',key:'眼病',caseRef:'TAO活动性评估',guide:'甲亢眼病指南',disease:'hyperthyroidism'},
{day:11,group:'甲状腺',title:'甲减与左甲状腺素',focus:'TSH+FT4诊断、老年人12.5μg起始、妊娠目标',key:'甲减',caseRef:'甲减起始剂量',guide:'甲减基层指南',disease:'hypothyroidism'},
{day:12,group:'甲状腺',title:'甲状腺结节与FNA',focus:'C-TIRADS分层、FNA指征、Bethesda细胞学',key:'结节',caseRef:'甲状腺结节FNA',guide:'甲状腺结节癌指南',disease:'thyroid-nodule'},
{day:13,group:'甲状腺',title:'分化型甲状腺癌管理',focus:'复发风险分层、TSH抑制目标、131I清甲',key:'甲状腺癌',caseRef:'甲状腺癌TSH抑制',guide:'甲状腺结节癌指南',disease:'thyroid-nodule'},
{day:14,group:'甲状腺',title:'甲状腺功能检验解读',focus:'TSH/FT4组合、亚临床甲亢甲减、检验干扰',key:'检验',caseRef:'亚临床甲亢处理',guide:'甲状腺检验共识',disease:'hyperthyroidism'},
{day:15,group:'垂体肾上腺',title:'垂体瘤与泌乳素瘤',focus:'PRL升高鉴别、多巴胺激动剂一线、大腺瘤压迫',key:'垂体',caseRef:'泌乳素瘤药物',guide:'泌乳素瘤共识',disease:'pituitary-tumor'},
{day:16,group:'垂体肾上腺',title:'肢端肥大症与GH',focus:'IGF-1筛查、OGTT抑制试验',key:'GH',caseRef:'肢端肥大症筛查',guide:'垂体瘤指南',disease:'pituitary-tumor'},
{day:17,group:'垂体肾上腺',title:'库欣综合征',focus:'过夜DST/UFC/唾液皮质醇筛查、ACTH分型',key:'库欣',caseRef:'库欣筛查',guide:'库欣指南',disease:'cushing'},
{day:18,group:'垂体肾上腺',title:'原发性醛固酮增多症',focus:'筛查人群、ARR切点、确诊试验、AVS分型',key:'原醛',caseRef:'原醛症筛查',guide:'原醛共识',disease:'primary-aldosteronism'},
{day:19,group:'垂体肾上腺',title:'嗜铬细胞瘤与副神经节瘤',focus:'甲氧基肾上腺素筛查、α阻滞术前准备',key:'PPGL',caseRef:'嗜铬细胞瘤诊断',guide:'PPGL共识',disease:'ppgl'},
{day:20,group:'垂体肾上腺',title:'肾上腺意外瘤',focus:'HU分流、激素功能评估、手术指征',key:'意外瘤',caseRef:'肾上腺意外瘤评估',guide:'肾上腺意外瘤专家意见',disease:'adrenal-incidentaloma'},
{day:21,group:'垂体肾上腺',title:'肾上腺皮质功能不全与危象',focus:'晨皮质醇/ACTH、危象立即糖皮质激素',key:'肾上腺',caseRef:'肾上腺危象',guide:'肾上腺功能不全',disease:'adrenal-other'},
{day:22,group:'骨与代谢',title:'骨质疏松诊断与分层',focus:'DXA T值、FRAX、脆性骨折高危路径',key:'骨质疏松',caseRef:'骨质疏松诊断',guide:'骨质疏松指南',disease:'osteoporosis'},
{day:23,group:'骨与代谢',title:'骨质疏松治疗',focus:'双膦酸盐/地舒/促骨形成、序贯与复评',key:'骨松治疗',caseRef:'骨质疏松治疗',guide:'骨质疏松指南',disease:'osteoporosis'},
{day:24,group:'骨与代谢',title:'钙磷代谢与甲状旁腺',focus:'高钙/低钙、甲旁亢/甲旁减、维生素D',key:'钙磷',caseRef:'低钙血症',guide:'甲旁亢/低钙处置',disease:'primary-hyperpara'},
{day:25,group:'骨与代谢',title:'维生素D',focus:'25OHD切点、补充剂量、与骨健康',key:'VitD',caseRef:'维生素D缺乏',guide:'维生素D共识',disease:'osteoporosis'},
{day:26,group:'骨与代谢',title:'痛风与高尿酸',focus:'诊断金标准、急性分层、降尿酸达标<360',key:'痛风',caseRef:'痛风急性期选药',guide:'痛风诊疗规范',disease:'gout'},
{day:27,group:'骨与代谢',title:'电解质紊乱：低钠',focus:'分级、容量分型、纠钠速度防ODS',key:'低钠',caseRef:'低钠血症处理',guide:'低钠共识',disease:'hyponatremia'},
{day:28,group:'骨与代谢',title:'电解质紊乱：钾',focus:'高钾急症、低钾处理与诱因',key:'钾',caseRef:'高钾处理',guide:'电解质管理',disease:'hypoglycemia'},
{day:29,group:'综合',title:'内分泌综合征与遗传',focus:'MEN-1/MEN-2识别、多腺体受累筛查',key:'综合征',caseRef:'MEN-1 筛查',guide:'AACE MEN-1共识',disease:'men1'},
{day:30,group:'综合',title:'综合复习与病例推演',focus:'随机病例推演、查漏补缺、回原文核对',key:'复习',caseRef:'病例推演',guide:'全站指南',disease:'diabetes'}
];
