import axios from 'axios';

const slack_crm_email_schedule = 'https://hooks.slack.com/services/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';
const slack_crm_email_notification = 'https://hooks.slack.com/services/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';

export const sendSlackNotification = async (message: string, option?: { isSubscription: boolean }) => {
  if (process.env.NODE_ENV !== 'development') {
    try {
      let slackWebhookUrl = slack_crm_email_schedule;
      if (option?.isSubscription) {
        slackWebhookUrl = slack_crm_email_notification;
      }
      await axios.post(slackWebhookUrl, { text: message });
    } catch (error) {
    }
  }
};

import { v4 as uuidv4 } from 'uuid';

export function slugify(name: string): string {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const uniqueId = uuidv4().split('-')[0]; // Lấy phần đầu tiên của UUID để tạo tính duy nhất
  return `${baseSlug}-${uniqueId}`;
}
