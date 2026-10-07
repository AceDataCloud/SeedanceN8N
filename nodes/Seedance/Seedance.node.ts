import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	failure,
	object,
	output,
	request,
	requiredText,
	submissionResult,
	taskResult,
} from './helpers';
import { properties } from './properties';

export class Seedance implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Seedance by AceDataCloud',
		name: 'seedance',
		icon: { light: 'file:icon.png', dark: 'file:icon.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create videos and retrieve generation tasks through AceDataCloud',
		defaults: { name: 'Seedance by AceDataCloud' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'aceDataSeedanceApi', required: true }],
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const result: INodeExecutionData[] = [];
		for (let index = 0; index < items.length; index++) {
			try {
				const resource = this.getNodeParameter('resource', index) as string;
				const operation = this.getNodeParameter('operation', index) as string;
				const simplify = this.getNodeParameter('simplify', index, true) as boolean;
				if (resource === 'task') {
					let body: IDataObject;
					if (operation === 'get') {
						body = {
							action: 'retrieve',
							id: requiredText(this.getNodeParameter('taskId', index), 'Task ID'),
						};
					} else if (operation === 'getMany') {
						const ids = requiredText(this.getNodeParameter('taskIds', index), 'Task IDs')
							.split(',')
							.map((id) => id.trim())
							.filter(Boolean);
						if (!ids.length || ids.length > 50)
							throw new NodeOperationError(this.getNode(), 'Provide between 1 and 50 task IDs');
						body = { action: 'retrieve_batch', ids };
					} else {
						throw new NodeOperationError(this.getNode(), 'Select a supported task operation');
					}
					const response = await request(this, 'aceDataSeedanceApi', '/seedance/tasks', body);
					const records = operation === 'getMany' ? response.items : [response];
					if (!Array.isArray(records))
						throw new NodeOperationError(
							this.getNode(),
							'The service returned an unexpected task list',
						);
					const valid = records.map((record) => object(record));
					if (valid.some((record) => !record.id && !record.task_id))
						throw new NodeOperationError(
							this.getNode(),
							'The task was not found. Check the task ID and service credential',
						);
					result.push(
						...output(
							this,
							valid.map((record) => (simplify ? taskResult(record) : record)),
							index,
						),
					);
				} else {
					if (resource !== 'video' || operation !== 'create')
						throw new NodeOperationError(this.getNode(), 'Select a supported operation');
					const prompt = requiredText(this.getNodeParameter('prompt', index), 'Prompt');
					const options = object(this.getNodeParameter('options', index, {}));
					const mode = this.getNodeParameter('inputMode', index, 'text') as string;
					const content: IDataObject[] = [{ type: 'text', text: prompt }];
					if (mode === 'image') {
						const imageUrl = requiredText(
							this.getNodeParameter('imageUrl', index),
							'First Frame URL',
						);
						if (!/^https?:\/\//i.test(imageUrl))
							throw new NodeOperationError(
								this.getNode(),
								'First Frame URL must use HTTP or HTTPS',
							);
						content.push({ type: 'image_url', role: 'first_frame', image_url: { url: imageUrl } });
						if (typeof options.lastFrameUrl === 'string' && options.lastFrameUrl.trim()) {
							const url = options.lastFrameUrl.trim();
							if (!/^https?:\/\//i.test(url))
								throw new NodeOperationError(
									this.getNode(),
									'Last Frame URL must use HTTP or HTTPS',
								);
							content.push({ type: 'image_url', role: 'last_frame', image_url: { url } });
						}
					} else if (mode !== 'text') {
						throw new NodeOperationError(this.getNode(), 'Select a supported input mode');
					}
					const body: IDataObject = {
						model: this.getNodeParameter('model', index) as string,
						content,
						async: true,
						duration: this.getNodeParameter('duration', index, 5) as number,
						resolution: this.getNodeParameter('resolution', index, '720p') as string,
						ratio: this.getNodeParameter('ratio', index, '16:9') as string,
					};
					if (
						typeof body.duration !== 'number' ||
						!Number.isInteger(body.duration) ||
						body.duration < 4 ||
						body.duration > 15
					)
						throw new NodeOperationError(
							this.getNode(),
							'Duration must be a whole number between 4 and 15 seconds',
						);
					if (typeof options.generateAudio === 'boolean')
						body.generate_audio = options.generateAudio;
					if (typeof options.returnLastFrame === 'boolean')
						body.return_last_frame = options.returnLastFrame;
					const response = await request(this, 'aceDataSeedanceApi', '/seedance/videos', body);
					const normalized = submissionResult(response);
					result.push(...output(this, [simplify ? normalized : response], index));
				}
			} catch (error) {
				result.push(failure(this, error, index));
			}
		}
		return [result];
	}
}
