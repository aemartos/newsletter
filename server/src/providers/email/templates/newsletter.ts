import { config } from '../../../config/index.js';
import { EmailTemplate } from '../index.js';

export interface GenerateNewsletterHTMLProps {
  title: string;
  excerpt: string;
  post_url: string;
  email: string;
}
// Generate HTML for newsletter email
export const generateNewsletterHTML = (
  data: GenerateNewsletterHTMLProps
): EmailTemplate => {
  const encodedEmail = encodeURIComponent(data.email);
  return {
    subject: 'Bla bla newsletter - Fresh content 🥳!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
          }
          .container {
            text-align: center;
          }
          .header {
            margin-bottom: 40px;
          }
          .main-title {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #7d7fff;
            line-height: 1.2;
          }
          .subtitle {
            font-size: 18px;
            color: #a3b7ff;
            margin: 0 0 30px 0;
          }
          .intro {
            font-size: 16px;
            color: #333;
            margin: 0 0 30px 0;
            line-height: 1.5;
          }
          .content-box {
            background-color: #f8f9ff;
            border-radius: 10px;
            padding: 30px;
            margin: 0 0 30px 0;
            text-align: left;
          }
          .post-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin: 0 0 15px 0;
            line-height: 1.3;
          }
          .post-excerpt {
            font-size: 16px;
            color: #333;
            margin: 0;
            line-height: 1.4;
          }
          .cta-text {
            font-size: 16px;
            color: #333;
            margin: 0 0 20px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #a3b7ff 0%, #7d7fff 100%);
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 0;
            transition: transform 0.2s ease;
            color: #ffffff !important;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .closing {
            font-size: 16px;
            color: #333;
            margin: 30px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
          }
          .unsubscribe {
            font-size: 14px;
            color: #a3b7ff;
            text-decoration: none;
          }
          .unsubscribe:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="main-title">Bla bla newsletter!</h1>
            <p class="subtitle">Hey there!</p>
          </div>
          
          <p class="intro">We've just dropped some fresh content - there's a brand-new post for you to check out!</p>
          
          <div class="content-box">
            <h2 class="post-title">${data.title}</h2>
            <p class="post-excerpt">${data.excerpt}</p>
          </div>
          
          <p class="cta-text">Just hit the button below to dive in and see what's new.</p>
          <a href="${data.post_url}" class="cta-button">go!</a>
          
          <p class="closing">Happy reading! 🚀</p>
          
          <div class="footer">
            <a href="${config.clientUrl}/unsubscribe?email=${encodedEmail}" class="unsubscribe">Unsubscribe</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
