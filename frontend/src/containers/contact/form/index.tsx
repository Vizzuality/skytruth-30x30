import { useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import * as z from 'zod';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EXTERNAL_LINKS } from '@/constants/external-links';
import { FCWithMessages } from '@/types';

const ContactUsForm: FCWithMessages = () => {
  const t = useTranslations('containers.contact-form');

  const categoryOptions = useMemo(
    () => [
      {
        label: t('inputs.feedback'),
        value: t('inputs.feedback'),
      },
      {
        label: t('inputs.data-update-request'),
        value: t('inputs.data-update-request'),
      },
      {
        label: t('inputs.bug-reporting'),
        value: t('inputs.bug-reporting'),
      },
    ],
    [t]
  );

  const ContactUsSchema = useMemo(
    () =>
      z.object({
        full_name: z
          .string({
            required_error: t('inputs.error-mandatory-field'),
          })
          .min(1),
        email: z
          .string({
            required_error: t('inputs.error-mandatory-field'),
          })
          .email({ message: t('inputs.error-invalid-email-format') })
          .min(1),
        organization: z.string().optional(),
        country: z.string().optional(),
        contact_reason: z
          .string({
            required_error: t('inputs.error-mandatory-field'),
          })
          .min(1),
        message: z
          .string({
            required_error: t('inputs.error-empty-message'),
          })
          .min(1),
        privacy_policy_consent: z
          .boolean()
          .refine((v) => v, {
            message: t('inputs.error-accept-privacy-policy'),
          })
          .default(false),
      }),
    [t]
  );

  type ContactUsInput = z.infer<typeof ContactUsSchema>;

  const form = useForm<ContactUsInput>({
    resolver: zodResolver(ContactUsSchema),
  });
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const onSubmit = useCallback(async (values: ContactUsInput) => {
    const { status } = await axios.post('/api/contact', values);
    setResponseStatus(status);
  }, []);

  if (responseStatus === 200) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-8">
        <p>{t('thanks-for-message')}</p>
        <Link
          href="/"
          className="flex border border-black bg-black p-4 font-mono text-xs uppercase text-white"
        >
          {t('go-to-homepage')}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inputs.name-label')}*</FormLabel>
              <FormControl>
                <Input placeholder={t('inputs.name-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inputs.email-label')}*</FormLabel>
              <FormControl>
                <Input placeholder={t('inputs.email-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inputs.organization-label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('inputs.organization-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inputs.country-label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('inputs.country-placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_reason"
          render={({ field }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ref, ...restField } = field;

            return (
              <FormItem>
                <FormLabel>{t('inputs.reason-label')}*</FormLabel>
                <FormControl>
                  <Select
                    {...restField}
                    onValueChange={(v) => {
                      field.onChange(v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('inputs.reason-placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('inputs.message-label')}*</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  cols={10}
                  rows={8}
                  placeholder={t('inputs.message-placeholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="privacy_policy_consent"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="space-x-2">
                  <Checkbox
                    {...field}
                    onCheckedChange={field.onChange}
                    defaultChecked={field.value}
                    value="privacy_policy_consent"
                  />
                  <FormLabel>
                    {t.rich('inputs.privacy-consent', {
                      a: (chunks) => (
                        <Link
                          href={EXTERNAL_LINKS.privacyPolicy}
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                    *
                  </FormLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!form.formState.isSubmitSuccessful && (
          <button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="border border-black p-4 font-mono text-xs uppercase disabled:pointer-events-none disabled:opacity-50"
          >
            {t('submit')}
          </button>
        )}
      </form>
    </Form>
  );
};

ContactUsForm.messages = ['containers.contact-form'];

export default ContactUsForm;
