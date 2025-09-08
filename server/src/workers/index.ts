import { registerNewsletterWorkers } from './newsletter.js';

type Registrar = () => Promise<void> | void;

const registrars: Registrar[] = [registerNewsletterWorkers];

export async function registerWorkers(): Promise<void> {
  await Promise.all(registrars.map(r => r()));
}
