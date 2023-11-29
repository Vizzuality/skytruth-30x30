import Layout from '@/layouts/error-page';

const Error500Page: React.FC = () => (
  <Layout
    pageTitle="Internal Server Error"
    error={500}
    title="Internal server error"
    description="Something went wrong. we are working on to fix the problem."
  />
);

export default Error500Page;
