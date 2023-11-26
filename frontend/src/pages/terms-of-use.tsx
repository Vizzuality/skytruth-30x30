import Section, { SectionContent, SectionTitle } from '@/components/static-pages/section';
import Layout, { Content } from '@/layouts/static-page';

const PrivacyPolicy: React.FC = () => (
  <Layout title="Terms of Use">
    <Content>
      <Section>
        <SectionTitle>Terms of Use</SectionTitle>
        <SectionContent>On this page you will find our Terms of Use.</SectionContent>
      </Section>
    </Content>
  </Layout>
);

export default PrivacyPolicy;
