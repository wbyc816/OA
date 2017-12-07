import {validatePhone} from './validate.js'
// console.log(validatePhone)
export const postInfo = [{
  head: '职务信息',
  prop: [{ name: 'companyName', label: '公司', width: '170px' }, { name: 'jobTitle', label: '职务', width: '' }, { name: 'deptFatherName', label: '部门', width: '' }, { name: 'joinCompany', label: '首次进入成员公司名称', width: '200' }, { name: 'joinTime', label: '入职时间', width: '', type: 'date' }],
  url: '/resume/getEmpPostInfo'
}]
export const contractInfo = [{
  head: '合同信息',
  prop: [{ name: 'type', label: '合同类型', width: '' }, { name: 'subject', label: '合同主体', width: '' }, { name: 'startDate', label: '合同开始日期', width: '', type: 'date' }, { name: 'endDate', label: '合同预计结束日期', width: '', type: 'date' }],
  url: '/resume/getContractInfo'
}, {
  head: '试用期信息',
  prop: [{ name: 'probationType', label: '试用期类型', width: '' }, { name: 'probationDays', label: '试用时限', width: '' }, { name: 'probationTime', label: '试用期开始日期', width: '', type: 'date' }, { name: 'beregularTime', label: '试用期结束日期', width: '', type: 'date' }],
  url: '/resume/getProbation'
}]

export const eduInfo = [{
  head: '教育经历',
  enName: 'EduInfo',
  postName:'expEdu',
  prop: [{ name: 'graduationSchool', label: '毕业院校', width: '' }, { name: 'major', label: '专业', width: '' }, { name: 'eduBackground', label: '学历', width: '' }, { name: 'learningForms', label: '学习形式', width: '' }, { name: 'isHighest', label: '最高学历', width: '', type: 'boolean' }, { name: 'graduationDate', label: '毕业日期', width: '', type: 'date' }],
  url: '/resume/getEduInfo',
  postUrl: '/resume/updateEduInfo'
}, {
  head: '外语水平',
  enName: 'LproficiencyInfo',
  postName:'proficiency',
  prop: [{ name: 'language', label: '语种', width: '' }, { name: 'certificateType', label: '证书类型', width: '' }, { name: 'score', label: '分数', width: '' }, { name: 'acquireDate', label: '获得日期', width: '', type: 'date' }],
  url: '/resume/getLproficiencyInfo',
  postUrl: '/resume/updateLproficiencyInfo'
}, {
  head: '培训记录',
  enName: 'TrainInfo',
  postName:'train',
  prop: [{ name: 'period', label: '培训时间', width: '' }, { name: 'project', label: '培训项目', width: '' }, { name: 'place', label: '培训地点', width: '' }],
  url: '/resume/getTrainInfo',
  postUrl: '/resume/updateTrainInfo'
}, {
  head: '职业资格',
  enName: 'QualificationInfo',
  postName:'fication',
  prop: [{ name: 'qualificationType', label: '资格类型', width: '' }, { name: 'qualificationClass', label: '资格级别', width: '' }, { name: 'acquireDate', label: '获得日期', width: '', type: 'date' }, { name: 'organization', label: '签发机构', width: '' }],
  url: '/resume/getQualificationInfo',
  postUrl: '/resume/updateQualificationInfo'
}, {
  head: '职称信息',
  enName: 'JobTitleInfo',
  postName:'jobTitle',
  prop: [{ name: 'title', label: '职称', width: '' }, { name: 'acquireDate', label: '获得日期', width: '', type: 'date' }, { name: 'organization', label: '签发机构', width: '' }],
  url: '/resume/getJobTitleInfo',
  postUrl: '/resume/updateJobTitleInfo'
}, {
  head: '科研成果',
  enName: 'ScientificInfo',
  postName:'payoffs',
  prop: [{ name: 'acquireDate', label: '获得/发表日期', width: '', type: 'date' }, { name: 'name', label: '成果名称', width: '' }, { name: 'numeration', label: '编号(刊物)', width: '' }],
  url: '/resume/getScientificInfo',
  postUrl: '/resume/updateScientificInfo'
}]
export const assessreCordInfo = [{
  head: '考核记录',
  enName: 'AssessreCordInfo',
  postName:'assessreCode',
  prop: [{ name: 'period', label: '考核周期', width: '' }, { name: 'assessment', label: '业绩考核者', width: '' }, { name: 'result', label: '考核结果', width: '' }],
  url: '/resume/getAssessreCordInfo',
  postUrl: '/resume/updateAssessreCordInfo',
}, {
  head: '考核报告',
  enName: 'AssessrePortInfo',
  postName:'report',
  prop: [{ name: 'annual', label: '年度', width: '' }, { name: 'content', label: '考核内容', width: '' }, { name: 'report', label: '考核报告', width: '' }],
  url: '/resume/getAssessrePortInfo',
  postUrl: '/resume/updateAssessrePortInfo',
}, {
  head: '奖励记录',
  enName: 'AwardInfo',
  postName:'rewardMent',
  prop: [{ name: 'acquireDate', label: '奖励日期', width: '', type: 'date' }, { name: 'name', label: '奖励名称', width: '' }, { name: 'reason', label: '奖励原因', width: '' }, { name: 'officeNum', label: '发文号', width: '' }],
  url: '/resume/getAwardpunishInfo?isAward=1',
  postUrl: '/resume/updateAwardpunishInfo',
  extraParams: { isAward: 1 }
}, {
  head: '处分记录',
  enName: 'PunishInfo',
  postName:'ment',
  prop: [{ name: 'acquireDate', label: '处分日期', width: '', type: 'date' }, { name: 'name', label: '处分名称', width: '' }, { name: 'reason', label: '处分原因', width: '' }, { name: 'officeNum', label: '发文号', width: '' }],
  url: '/resume/getAwardpunishInfo?isAward=0',
  postUrl: '/resume/updateAwardpunishInfo',
  extraParams: { isAward: 0 }
}]
export const postExperienceInfo = [{
  head: '任职经历',
  enName: 'PostInfo',
  postName:'post',
  prop: [{ name: 'period', label: '任职时间', width: '' }, { name: 'post', label: '职位', width: '' }, { name: 'postCompany', label: '任职(定岗)单位', width: '150' }, { name: 'isFulltime', label: '是否全职', width: '',type:'boolean' }, { name: 'isOnjob', label: '在职情况', width: '',type:'boolean',yes:'在职',no:'不在职' }, { name: 'officeNum', label: '公文号', width: '' }, { name: 'supervisoryLevel', label: '管理级别', width: '' }],
  url: '/resume/getPostInfo',
  postUrl: '/resume/updatePostInfo',
}, {
  head: '集团外工作经历',
  enName: 'OutjobInfo',
  postName:'outJob',
  prop: [{ name: 'beginDate', label: '开始日期', width: '', type: 'date',limit:{name:'endDate',rule:'less'} }, { name: 'endDate', label: '结束日期', width: '', type: 'date', limit:{name:'beginDate',rule:'more'} }, { name: 'company', label: '工作单位', width: '' }, { name: 'post', label: '所任职务', width: '' }],
  url: '/resume/getOutjobInfo',
  postUrl: '/resume/updateOutjobInfo',
}, {
  head: '董监事工作经历',
  enName: 'SupervisorInfo',
  postName:'supervisor',
  prop: [{ name: 'period', label: '任职期间', width: '' }, { name: 'company', label: '任职单位', width: '' }, { name: 'post', label: '职务', width: '' }, { name: 'officeNum', label: '公文号', width: '' }, { name: 'isOnjob', label: '在职情况', width: '',type:'boolean',yes:'在职',no:'不在职' }],
  url: '/resume/getSupervisorInfo',
  postUrl: '/resume/updateSupervisorInfo',
}, {
  head: '党群工作经历',
  enName: 'PartyInfo',
  postName:'party',
  prop: [{ name: 'period', label: '任职时间', width: '' }, { name: 'partyName', label: '党群组织名称', width: '' }, { name: 'post', label: '党群职务', width: '' }, { name: 'status', label: '状态', width: '',type:'boolean',yes:"在职",no:"不在职" }, { name: 'isExpdh', label: '是否东海经历', width: '',type:'boolean' }],
  url: '/resume/getPartyInfo',
  postUrl: '/resume/updatePartyInfo',
}]
export const contactInfo = [{
  head: '紧急联系人信息',
  enName: 'EmergencyContactInfo',
  postName:'contact',
  prop: [{ name: 'name', label: '联系人姓名', width: '' }, { name: 'relationship', label: '与员工关系', width: '' }, { name: 'primarycontacts', label: '主要联系人', width: '' }, { name: 'phoneNum', label: '电话', width: '',rule: {validator:validatePhone,trigger: 'blur,change'},maxlength:11 }, { name: 'address', label: '地址', width: '' }],
  url: '/resume/getEmergencyContactInfo',
  postUrl: '/resume/updateEmergencyContactInfo',
}, {
  head: '家庭成员信息',
  enName: 'FamilyInfo',
  postName:'family',
  prop: [{ name: 'name', label: '姓名', width: '' }, { name: 'relationship', label: '关系', width: '' }, { name: 'company', label: '工作单位', width: '' }, { name: 'post', label: '职务', width: '' }, { name: 'address', label: '住址', width: '' }, { name: 'phoneNum', label: '电话', width: '', rule: {validator:validatePhone,trigger: 'blur,change'},maxlength:11 }],
  url: '/resume/getFamilyInfo',
  postUrl: '/resume/updateFamilyInfo',
}]
