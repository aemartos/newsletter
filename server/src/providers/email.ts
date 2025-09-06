import sgMail from '@sendgrid/mail';
import { config } from '../config/index.js';

export interface SendEmailProps {
  dynamic_template_data: Record<string, string>;
  email: string;
  templateId: string;
}

export const sendEmail = async ({
  email,
  templateId,
  dynamic_template_data,
}: SendEmailProps) => {
  sgMail.setApiKey(config.email.apiKey);
  const msg = {
    to: email,
    from: config.email.fromEmail,
    templateId,
    dynamic_template_data,
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch(error => {
      console.error('Error sending email', error);
    });
};
