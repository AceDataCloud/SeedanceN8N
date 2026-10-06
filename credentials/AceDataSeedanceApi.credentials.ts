import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AceDataSeedanceApi implements ICredentialType {
	name = 'aceDataSeedanceApi';
	displayName = 'Seedance by AceDataCloud API';
	documentationUrl = 'https://github.com/AceDataCloud/SeedanceN8N#credentials';
	icon = 'file:../nodes/Seedance/acedatacloud.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API token for your Seedance service on AceDataCloud',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: { headers: { Authorization: '=Bearer {{$credentials.apiToken}}' } },
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.acedata.cloud',
			url: '/seedance/tasks',
			method: 'POST',
			body: { action: 'retrieve_batch', ids: [] },
		},
	};
}
