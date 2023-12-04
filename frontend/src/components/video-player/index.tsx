import Image from 'next/image';

import { cn } from '@/lib/classnames';
import VideoPlay from '@/styles/icons/video-play.svg?sprite';

import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import Icon from '../ui/icon';

type VideoProps = {
  source: string;
  type: string;
  controls?: boolean;
};

const Video: React.FC<VideoProps> = ({ source, type, controls = false }) => (
  <video className="h-auto w-auto" controls={controls} autoPlay loop={true}>
    <source src={source} type={type} />
  </video>
);

type VideoPlayerProps = VideoProps & {
  className?: string;
  stillImage: string;
  openInModal?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  className,
  source,
  type,
  stillImage,
  openInModal = false,
}) => {
  if (!openInModal) {
    return (
      <div className={cn(className)}>
        <Video source={source} type={type} controls={openInModal} />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <Dialog>
        <DialogTrigger asChild>
          <span className="relative cursor-pointer" aria-label="Play video">
            <Image
              className="h-auto w-full max-w-4xl"
              src={stillImage}
              alt="Statistics image"
              width="0"
              height="0"
              sizes="100vw"
              priority
            />
            <span className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
              <Icon
                icon={VideoPlay}
                className="mr-2.5 inline h-full w-full max-w-[50px] fill-black"
              />
            </span>
          </span>
        </DialogTrigger>
        <DialogContent className="h-auto max-h-[90vh] w-auto max-w-[90vw]">
          <Video source={source} type={type} controls={openInModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoPlayer;
