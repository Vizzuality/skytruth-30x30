import { useCallback } from 'react';

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
import { Textarea } from '@/components/ui/textarea';

const ContactUsSchema = z.object({
  name: z
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
  country: z.string().optional(),
  message: z
    .string({
      required_error: 'The message cannot be empty.',
    })
    .min(1),
  privacyPolicy: z
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

  const onSubmit = useCallback(async (values: ContactUsInput) => {
    await axios.put('/api/contact-us', values);
  }, []);

  if (form.formState.isSubmitSuccessful) {
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
          name="name"
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="space-x-2">
                  <Checkbox
                    {...field}
                    onCheckedChange={field.onChange}
                    defaultChecked={field.value}
                    value="privacyPolicy"
                  />
                  <FormLabel>
                    By submitting this form you agree with processing your personal data in
                    accordance with the{' '}
                    <Link
                      href="/privacy-policy"
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
