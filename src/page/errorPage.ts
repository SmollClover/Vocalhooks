import arp from 'app-root-path';
import { readFileSync } from 'fs';

const template = readFileSync(`${arp}/static/template.html`, { encoding: 'utf8' });
const client = JSON.parse(readFileSync(`${arp}/static/error/client.json`, { encoding: 'utf8' }));
const server = JSON.parse(readFileSync(`${arp}/static/error/server.json`, { encoding: 'utf8' }));
const custom = JSON.parse(readFileSync(`${arp}/static/error/custom.json`, { encoding: 'utf8' }));

async function replaceVars(vars: Array<string>, template: string): Promise<string> {
	return template.replace(/{\d}/g, (value) => {
		const index = parseInt(value.split('{')[1].split('}')[0]);
		return vars[index] ? vars[index] : value;
	});
}

export async function errorPage(input: number): Promise<string> {
	const code = input.toString();

	if (Object.keys(client).includes(code)) return await replaceVars([code, client[code][0], client[code][1]], template);
	if (Object.keys(server).includes(code)) return await replaceVars([code, server[code][0], server[code][1]], template);
	if (Object.keys(custom).includes(code)) return await replaceVars([code, custom[code][0], custom[code][1]], template);

	return await replaceVars(['900', custom['900']], template);
}
