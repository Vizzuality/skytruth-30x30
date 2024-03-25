import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';
import Layout from '@/layouts/map';

export default function Page() {
  return (
    <Layout title="Conservation Builder">
      <div className="hidden md:block">
        <Sidebar type="conservation-builder" />
      </div>
      <Content />
      <div className="h-1/2 flex-shrink-0 overflow-hidden bg-white md:hidden">
        <Sidebar type="conservation-builder" />
      </div>
    </Layout>
  );
}
