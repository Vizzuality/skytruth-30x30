import { Button } from '@/components/ui/button';

const SidebarContent: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="flex-grow overflow-y-auto">
      <h1 className="text-4xl font-black uppercase">Worldwide</h1>
      <p className="text-xs text-gray-500">Status last updated: August 2023</p>
    </div>
    <div className="flex-shrink-0">
      <Button type="button" className="w-full text-xs">
        Analyze an area
      </Button>
    </div>
  </div>
);

export default SidebarContent;
