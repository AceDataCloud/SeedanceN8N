import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		default: 'video',
		noDataExpression: true,
		options: [
			{
				name: 'Task',
				value: 'task',
			},
			{
				name: 'Video',
				value: 'video',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'get',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve the status and result of a task',
				action: 'Get a task',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve up to 50 tasks by ID',
				action: 'Get many tasks',
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'create',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create video through AceDataCloud',
				action: 'Create video',
			},
		],
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		description: 'The task ID returned by the Create operation',
	},
	{
		displayName: 'Task IDs',
		name: 'taskIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getMany'],
			},
		},
		description: 'Comma-separated task IDs, up to 50',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		description: 'Describe the video to generate',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		default: 'doubao-seedance-2-0-260128',
		options: [
			{
				name: 'doubao-seedance-1-0-lite-i2v-250428',
				value: 'doubao-seedance-1-0-lite-i2v-250428',
			},
			{
				name: 'doubao-seedance-1-0-lite-t2v-250428',
				value: 'doubao-seedance-1-0-lite-t2v-250428',
			},
			{
				name: 'doubao-seedance-1-0-pro-250528',
				value: 'doubao-seedance-1-0-pro-250528',
			},
			{
				name: 'doubao-seedance-1-0-pro-fast-251015',
				value: 'doubao-seedance-1-0-pro-fast-251015',
			},
			{
				name: 'doubao-seedance-1-5-pro-251215',
				value: 'doubao-seedance-1-5-pro-251215',
			},
			{
				name: 'doubao-seedance-2-0-260128',
				value: 'doubao-seedance-2-0-260128',
			},
			{
				name: 'doubao-seedance-2-0-fast-260128',
				value: 'doubao-seedance-2-0-fast-260128',
			},
			{
				name: 'doubao-seedance-2-0-mini-260615',
				value: 'doubao-seedance-2-0-mini-260615',
			},
			{
				name: 'doubao-seedance-2-5-260628',
				value: 'doubao-seedance-2-5-260628',
			},
		],
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		description: 'The model to use. Availability and pricing depend on the selected model.',
	},
	{
		displayName: 'Input Mode',
		name: 'inputMode',
		type: 'options',
		default: 'text',
		options: [
			{
				name: 'Image to Video',
				value: 'image',
			},
			{
				name: 'Text to Video',
				value: 'text',
			},
		],
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
	},
	{
		displayName: 'First Frame URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['video'],
				inputMode: ['image'],
			},
		},
		description: 'Public HTTP or HTTPS URL of the first frame',
	},
	{
		displayName: 'Duration',
		name: 'duration',
		type: 'number',
		default: 5,
		typeOptions: {
			minValue: 4,
			maxValue: 15,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		description: 'Video length in seconds. Supported lengths depend on the model.',
	},
	{
		displayName: 'Resolution',
		name: 'resolution',
		type: 'options',
		default: '720p',
		options: [
			{
				name: '480p',
				value: '480p',
			},
			{
				name: '720p',
				value: '720p',
			},
			{
				name: '1080p',
				value: '1080p',
			},
		],
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
	},
	{
		displayName: 'Aspect Ratio',
		name: 'ratio',
		type: 'options',
		default: '16:9',
		options: [
			{ name: '1:1', value: '1:1' },
			{ name: '16:9', value: '16:9' },
			{ name: '21:9', value: '21:9' },
			{ name: '3:4', value: '3:4' },
			{ name: '4:3', value: '4:3' },
			{ name: '9:16', value: '9:16' },
			{ name: 'Adaptive', value: 'adaptive' },
		],
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		default: {},
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		options: [
			{
				displayName: 'Generate Audio',
				name: 'generateAudio',
				type: 'boolean',
				default: false,
				description: 'Whether to generate audio when supported by the selected model',
			},
			{
				displayName: 'Last Frame URL',
				name: 'lastFrameUrl',
				type: 'string',
				default: '',
				description: 'Optional public HTTP or HTTPS last frame for image-to-video mode',
			},
			{
				displayName: 'Return Last Frame',
				name: 'returnLastFrame',
				type: 'boolean',
				default: false,
				description: 'Whether to return the generated last frame',
			},
		],
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];
