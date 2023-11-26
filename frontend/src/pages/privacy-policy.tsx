import Section, { SectionDescription, SectionTitle } from '@/components/static-pages/section';
import DefaultLayout, { Content } from '@/layouts/static-page';

const PrivacyPolicy: React.FC = () => (
  <DefaultLayout title="Privacy Policy">
    <Content>
      <Section>
        <SectionTitle>Privacy policy</SectionTitle>
        <SectionDescription>
          On this page you will find our Privacy Policy and Cookie Policy.
        </SectionDescription>
      </Section>
    </Content>
  </DefaultLayout>
);

export default PrivacyPolicy;
