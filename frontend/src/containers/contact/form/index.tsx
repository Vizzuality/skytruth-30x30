import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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

const CATEGORY_OPTIONS = [
  {
    label: 'Feedback',
    value: 'Feedback',
  },
  {
    label: 'Data update request',
    value: 'Data update request',
  },
  {
    label: 'Bug reporting',
    value: 'Bug reporting',
  },
];

const ContactUsSchema = z.object({
  full_name: z
    .string({
      required_error: 'This field is mandatory.',
    })
    .min(1),
  email: z
    .string({
      required_error: 'This field is mandatory.',
    })
    .email({ message: 'Invalid email format' })
    .min(1),
  organization: z.string().optional(),
  country: z.string().optional(),
  contact_reason: z
    .string({
      required_error: 'This field is mandatory.',
    })
    .min(1),
  message: z
    .string({
      required_error: 'The message cannot be empty.',
    })
    .min(1),
  privacy_policy_consent: z
    .boolean()
    .refine((v) => v, {
      message: 'You must agree with the privacy policy.',
    })
    .default(false),
});

export type ContactUsInput = z.infer<typeof ContactUsSchema>;

const ContactUsForm = (): JSX.Element => {
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
        <p>Thanks for your message. We will get back to you as soon as possible.</p>
        <Link
          href="/"
          className="flex border border-black bg-black p-4 font-mono text-xs uppercase text-white"
        >
          Go to homepage
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
              <FormLabel>First and last names*</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
              <FormLabel>Email address*</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
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
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="Your organization" {...field} />
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
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Your country" {...field} />
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
                <FormLabel>Reason*</FormLabel>
                <FormControl>
                  <Select
                    {...restField}
                    onValueChange={(v) => {
                      field.onChange(v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Please, select a contact reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(({ label, value }) => (
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
              <FormLabel>Message*</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  cols={10}
                  rows={8}
                  placeholder="Your message"
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
                    By submitting this form you agree with processing your personal data in
                    accordance with the{' '}
                    <Link
                      href={EXTERNAL_LINKS.privacyPolicy}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                    . *
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
            Submit
          </button>
        )}
      </form>
    </Form>
  );
};
export default ContactUsForm;
