export const salaryLeft = [
	{name: 'monthlyPay', label: '应发金额'},
	{name: 'basic', label: '基本工资'},
	{name: 'assess', label: '考核工资'},
	{name: 'subside', label: '补贴(交通/\餐食/\通讯)'},
	{name: 'parttime', label: '兼职津贴'},
	{name: 'businessTravel', label: '差旅补贴'},
	{name: 'founder', label: '开航贡献奖'},
	{name: 'nightMeal', label: '上月夜班夜餐补贴'},
	{name: 'outField', label: '上月外场补贴'},
	{name: 'followFlight', label: '上月跟机补贴'},
	{name: 'vacationExtrawork', label: '上月节假日加班费'},
	{name: 'highTemperature', label: '高温补贴'},
	{name: 'stationedAbroad', label: '驻外补贴'},
	{name: 'correspondent', label: '通讯员补贴'},
	{name: 'addLess', label: '工资扣补'},
	{name: 'lesson', label: '课时费'},
	{name: 'award', label: '个人奖励'},
	{name: 'longDistance', label: '长途补贴'},
	{name: 'royalty', label: '稿费'},
	{name: 'festival', label: '过节费'},
	{name: 'thirteen', label: '十三薪'},
	{name: 'subMeals', label: '餐费扣款',isDeduction:true},
	{name: 'backups', label: '备份补贴'},//飞行/乘务/安全员
	{name: 'overnight', label: '过夜补贴'},

	{name:'othercompanyFlyings',label:'外航乘机补贴'},//飞行
	{name: 'risingLanding', label: '起降补贴'},

	{name: 'flightModel', label: '飞模津贴'},//乘务员/安全员
	{name: 'actualFlightHours', label: '实发飞行小时费'},
	{name: 'flightSafe', label: '飞行安全奖'},
	{name: 'campaingHour', label: '本场小时津贴'},
	{name: 'trialFlight', label: '试飞小时津贴'},
	{name: 'overtime', label: '超时津贴'},
	{name: 'othercompanyFlying', label: '调组乘机津贴'},
	{name: 'broadcast', label: '机上广播津贴'},
	
	// {name: 'standardHour', label: '小时费标准'},
]
export const salaryRight = [
	{name: 'yearEnd', label: '年终奖'},
	{name: 'salaryPayable', label: '实发金额'},
	{name: 'subEndowmentInsurance', label: '养老保险个人扣款',isDeduction:true},
	{name: 'subMedicalInsurance', label: '医疗保险个人扣款',isDeduction:true},
	{name: 'subUnemploymentInsurance', label: '失业保险个人扣款',isDeduction:true},
	{name: 'subAccumulationFund', label: '公积金个人扣款',isDeduction:true},
	{name: 'subSickLeave', label: '病假扣款',isDeduction:true},
	{name: 'subCasualLeave', label: '事假扣款',isDeduction:true},
	{name: 'subIndividualIncomeTax', label: '个人所得税',isDeduction:true},
	{name: 'subYearEndTax', label: '年终奖扣税',isDeduction:true},
	{name: 'subMealsTax', label: '餐费扣款',isDeduction:true},
	
	{name: 'subPayonBehalf', label: '五险一金代缴扣款',isDeduction:true},
	{name: 'subOtherDeductions', label: '其他扣款',isDeduction:true},
	{name: 'otherDeductionsRemark', label: '其他扣款备注',isDeduction:true},
	{name: 'totalMonth', label: '本月总额',isDeduction:false},
	{name: 'boc', label: '中行发放金额',isDeduction:false},
	{name: 'cmbc', label: '招行发放金额',isDeduction:false},
	{name: 'cbc', label: '建行发放金额',isDeduction:false},
	{name: 'others1', label: '预留一',isDeduction:false},
	{name: 'others2', label: '预留二',isDeduction:false},
	{name: 'others3', label: '预留三',isDeduction:false},
	{name: 'remarkAll', label: '总备注',isDeduction:false},

	

	{name: 'night', label: '过夜补贴'},//飞行/乘务/安全员
	{name: 'internationalFlight', label: '国际航线补助'},

	
	
	{name: 'safeYear', label: '年度安全奖'},//飞行
	{name: 'subPilotRepayment', label: '飞行员还款',isDeduction:true},
	{name: 'addFlight', label: '因公加机组补贴'},
	
	{name: 'inlandFlightHours', label: '国内航线飞行小时费',isDeduction:false},
	{name: 'foreignFlightHours', label: '国外航线飞行小时费',isDeduction:false},
	

	{name: 'doubleLicense', label: '双照人员担任双职津贴'},//乘务员/安全员
	{name: 'serviceSafe', label: '安全服务奖'},
	{name: 'upgrade', label: '升舱提成'},
	


	
	// {name: 'technicalGrade', label: '技术等级',isDeduction:false},

	// {name: 'broadcastTime', label: '机上广播时间',isDeduction:false},
	// {name: 'crewLesson', label: '飞行乘务课时',isDeduction:false},
	// {name: 'doubleLicenseTime', label: '双照人员担任双职时间',isDeduction:false},
	// {name: 'overtimeTime', label: '超时时间',isDeduction:false},
	// {name: 'backupsDays', label: '备份天数',isDeduction:false},
	// {name: 'inlandTotalContract', label: '国内总承包时间',isDeduction:false},
	// {name: 'overnightDays', label: '空勤人员过夜天数',isDeduction:false},
	// {name: 'nightMealDays', label: '上月夜班夜餐天数',isDeduction:false},
	// {name: 'followFlightHours', label: '上月跟机小时数',isDeduction:false},
	// {name: 'overtimeDays', label: '上月节假日加班天数',isDeduction:false},
	// {name: 'trainNumber', label: '上月培训课时',isDeduction:false},
	// {name: 'stationedAbroadDays', label: '驻外天数',isDeduction:false},
	// {name: 'othercompanyFlyingTime', label: '乘务员安全员调组乘机时间',isDeduction:false},
	
]