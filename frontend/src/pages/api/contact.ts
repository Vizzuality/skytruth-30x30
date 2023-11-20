import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { ContactUsInput } from '@/containers/contact/form';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { body: values }: { body: ContactUsInput } = req;

    try {
      const hubSpotResponse = await axios.post(
        'https://api.hsforms.com/submissions/v3/integration/secure/submit/44434484/85194fe7-a207-425f-81b3-2311bace0b04',
        {
          fields: Object.keys(req.body).map((key) => ({
            objectTypeId: '0-1',
            name: key,
            value: values[key],
          })),
          context: {
            hutk: req.cookies['hubspotutk'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          },
        }
      );

      if (hubSpotResponse.status === 200) {
        res.status(hubSpotResponse.status).json({ ok: true });
      } else {
        res.status(500).json({ error: 'Something went wrong' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  res.status(405);
}
