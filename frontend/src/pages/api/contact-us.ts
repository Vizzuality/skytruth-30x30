import sendgridClient from '@sendgrid/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { ContactUsInput } from '@/containers/contact-us/form';

sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { email, name, message, country, privacyPolicy } = req.body as ContactUsInput;

    const data = {
      list_ids: [process.env.SENDGRID_CONTACT_LIST_ID],
      contacts: [
        {
          email,
          country,
          custom_fields: { e1_T: message, e2_T: name, e3_T: privacyPolicy ? 'Yes' : 'No' },
        },
      ],
    };

    const request = {
      url: `/v3/marketing/contacts`,
      method: 'PUT' as const,
      body: data,
    };

    try {
      await sendgridClient.request(request);
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json(err.response?.body?.errors?.map((e) => e));
    }
  }

  res.status(500).json({ error: 'Method not allowed' });
}
