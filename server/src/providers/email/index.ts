import { Resend } from 'resend';
import { config } from '../../config/index.js';
import {
  generateNewsletterHTML,
  GenerateNewsletterHTMLProps,
} from './templates/newsletter.js';

export interface EmailTemplate {
  subject: string;
  html: string;
}

export type Template = 'newsletter';

export interface TemplateDataMap {
  newsletter: GenerateNewsletterHTMLProps;
}

export type DataTemplateProps<T extends Template = Template> =
  TemplateDataMap[T];

export interface SendEmailProps<T extends Template = Template> {
  data: DataTemplateProps<T>;
  template: T;
  email: string;
  idempotencyKey: string;
}

const resend = new Resend(config.email.apiKey);

export const sendEmail = async <T extends Template>({
  email,
  template,
  data,
  idempotencyKey,
}: SendEmailProps<T>) => {
  try {
    const { html, subject } = generateHTML(template, data);

    const result = await resend.emails.send(
      {
        from: config.email.fromEmail,
        to: [email],
        subject,
        html,
      },
      {
        // Using a hash of the content to ensure same email content = same key
        idempotencyKey:
          idempotencyKey ||
          `newsletter-${email}-${Buffer.from(data.post_url).toString('base64').slice(0, 16)}`,
      }
    );

    console.log('Email sent successfully', result);
    return result;
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};

const generateHTML = <T extends Template>(
  template: T,
  data: DataTemplateProps<T>
) => {
  switch (template) {
    case 'newsletter':
      return generateNewsletterHTML(data as GenerateNewsletterHTMLProps);
    default:
      throw new Error(`Template ${template} not found`);
  }
};
