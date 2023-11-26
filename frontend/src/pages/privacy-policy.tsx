import Section from '@/components/static-pages/section';
import Layout, { Content } from '@/layouts/static-page';

const PrivacyPolicy: React.FC = () => (
  <Layout title="Privacy Policy">
    <Content>
      <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">Privacy Policy</h1>
      <Section borderTop={false}>
        <p className="text-xl">On this page you will find our Privacy Policy and Cookie Policy.</p>
      </Section>
    </Content>
  </Layout>
);

export default PrivacyPolicy;
