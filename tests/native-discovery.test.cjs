const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Seedance } = require('../dist/nodes/Seedance/Seedance.node.js');

test('the installed node retains its workflow identifier and exposes brand search/help metadata', () => {
	const description = new Seedance().description;
	assert.equal(description.name, 'seedance');
	assert.deepEqual(description.inputs, ['main']);
	assert.equal(description.usableAsTool, true);
	assert.ok(description.codex.alias.includes('seedance'));
	assert.ok(description.codex.resources.credentialDocumentation[0].url.endsWith('#credentials'));
	assert.ok(description.codex.resources.primaryDocumentation[0].url.endsWith('#use-the-node'));
});
