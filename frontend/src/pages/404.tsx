import Layout from '@/layouts/error-page';

const Error404Page: React.FC = () => (
  <Layout
    pageTitle="Page Not Found"
    error={404}
    title="Page not found"
    description="It looks like the link is broken or the page has been removed."
  />
);

export default Error404Page;
