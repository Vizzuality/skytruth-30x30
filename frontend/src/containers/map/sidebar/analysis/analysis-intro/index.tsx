import Icon from '@/components/ui/icon';
import VideoPlayer from '@/components/video-player';
import Graph from '@/styles/icons/graph.svg?sprite';

const AnalysisIntro: React.FC = () => (
  <div className="flex flex-col gap-3 py-4 px-4 md:px-8">
    <span className="flex items-center font-bold">
      <Icon icon={Graph} className="mr-2.5 inline h-4 w-5 fill-black" />
      Start analysing yor own <span className="ml-1.5 text-blue">custom area</span>.
    </span>
    <VideoPlayer
      source="/videos/modelling-instructions.mp4"
      stillImage="/images/video-stills/modelling-instructions.png"
      type="video/mp4"
    />
    <p>Draw in the map the area you want to analyse through on-the-fly calculations.</p>
    <span>
      <span className="font-bold">Use the drawing tools in the map</span> to draw an area.
    </span>
  </div>
);

export default AnalysisIntro;
