import { Collection } from '@discordjs/collection';
import arp from 'app-root-path';
import { exec } from 'child_process';
import consola from 'consola';
import express, { Application } from 'express';
import { readFileSync } from 'fs';
import glob from 'glob';
import TOML from 'toml';
import { promisify } from 'util';

import { action } from '../interface/action';
import { errorPage } from '../page/errorPage';

const globPromise = promisify(glob);
const execPromise = promisify(exec);

class Webserver {
	public app: Application;

	private actions: Collection<string, action> = new Collection();

	public constructor() {
		this.app = express();
	}

	public async start(): Promise<void> {
		this.loadActions();

		this.app.listen(3000, async () => {
			consola.success('Started listening on port 3000');
		});

		this.app.get('*', async (req, res) => {
			if (req.url === '/') return res.send(readFileSync(`${arp}/static/index.html`, { encoding: 'utf8' }));

			const doAction = this.actions.find((a) => a.metadata.method === 'GET' && `/${a.metadata.name}` === req.url);
			if (!doAction) return res.status(404).send(await errorPage(404));

			return res.json({ ...doAction.metadata, output: await this.executeCommands(doAction.action.commands) });
		});

		this.app.post('*', async (req, res) => {
			const doAction = this.actions.find((a) => a.metadata.method === 'POST' && `/${a.metadata.name}` === req.url);
			if (!doAction) return res.status(404).send(await errorPage(404));

			return res.json({ ...doAction.metadata, output: await this.executeCommands(doAction.action.commands) });
		});

		this.app.put('*', async (req, res) => {
			const doAction = this.actions.find((a) => a.metadata.method === 'PUT' && `/${a.metadata.name}` === req.url);
			if (!doAction) return res.status(404).send(await errorPage(404));

			return res.json({ ...doAction.metadata, output: await this.executeCommands(doAction.action.commands) });
		});

		this.app.delete('*', async (req, res) => {
			const doAction = this.actions.find((a) => a.metadata.method === 'DELETE' && `/${a.metadata.name}` === req.url);
			if (!doAction) return res.status(404).send(await errorPage(404));

			return res.json({ ...doAction.metadata, output: await this.executeCommands(doAction.action.commands) });
		});
	}

	private async loadActions(): Promise<void> {
		const actionFiles = await globPromise(`${arp}/actions/**/*.toml`);

		actionFiles.map(async (value: string) => {
			const file: action = TOML.parse(readFileSync(value, { encoding: 'utf8' }));
			this.actions.set(file.metadata.name, { ...file });
		});
	}

	private async executeCommands(commands: Array<string>): Promise<Array<string>> {
		const output = [];

		for (let i = 0; i < commands.length; i++) {
			try {
				const cOutput = await execPromise(commands[i]);

				if (cOutput.stderr) {
					output.push(`${commands[i]} --- ERROR`);
					output.push(cOutput.stderr.trim());
				}

				output.push(commands[i]);
				output.push(cOutput.stdout.trim());
			} catch (err) {
				output.push(`${commands[i]} --- ERROR`);
				output.push((err as any).toString());
			}
		}

		return await this.fancifyOutput(output);
	}

	private async fancifyOutput(input: Array<string>): Promise<Array<string>> {
		let lineLength = 0;

		for (let i = 0; i < input.length; i++) {
			if (i % 2 !== 0) continue;

			input[i] = `COMMAND --- ${input[i]} `;
			if (input[i].length > lineLength) lineLength = input[i].length;
		}

		lineLength += 3;

		for (let i = 0; i < input.length; i++) {
			if (i % 2 !== 0) continue;

			while (input[i].length < lineLength) {
				input[i] += '-';
			}
		}

		return input;
	}
}

export { Webserver };
