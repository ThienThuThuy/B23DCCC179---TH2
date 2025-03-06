export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'FullscreenExitOutlined',
	},
	{
		path: '/todo-list',
		name: 'Todolist',
		component: './TodoList',
		icon: 'FullscreenExitOutlined',
	},
	{
		path: '/rps',
		name: 'RockPaperScissors',
		component: './RockPaperScissors',
		icon: 'FullscreenExitOutlined',
	},
	{
		name: 'QuestionBank',
		icon: 'FullscreenExitOutlined',
		routes: [
			{
				name: 'Subjects',
				path: '/question-bank/subjects',
				component: './QuestionBank/Subjects',
			},
			{
				name: 'KnowledgeArea',
				path: '/question-bank/knowledgearea',
				component: './QuestionBank/KnowledgeArea',
			},
			{
				name: 'Questions',
				path: '/question-bank/questions',
				component: './QuestionBank/Questions',
			},
			{
				name: 'Exams',
				path: '/question-bank/exams',
				component: './QuestionBank/Exams',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
