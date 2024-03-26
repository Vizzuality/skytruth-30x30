import Content from '@/containers/map/content';
import Sidebar from '@/containers/map/sidebar';
import MapLayout from '@/layouts/map';

export default function ConservationBuilderPage() {
  return (
    <>
      <div className="hidden md:block">
        <Sidebar type="conservation-builder" />
      </div>
      <Content />
      <div className="h-1/2 flex-shrink-0 overflow-hidden bg-white md:hidden">
        <Sidebar type="conservation-builder" />
      </div>
    </>
  );
}

ConservationBuilderPage.layout = {
  Component: MapLayout,
  props: {
    title: 'Conservation builder',
  },
};
