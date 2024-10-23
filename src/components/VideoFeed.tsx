import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { Download } from 'lucide-react';

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  platform: string;
  engagement: number;
}

interface VideoFeedProps {
  hashtags: string[];
  audioClip: { start: number; end: number; url: string };
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ hashtags, audioClip }) => {
  const fetchVideos = async ({ pageParam = 0 }) => {
    const response = await fetch(`/api/videos?page=${pageParam}&hashtags=${hashtags.join(',')}`);
    return response.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ['videos', hashtags, audioClip],
    fetchVideos,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.videos.map((video: Video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {video.platform}
                  </span>
                  <span className="text-sm text-gray-500">
                    {video.engagement.toLocaleString()} engagements
                  </span>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="col-span-full py-4 text-indigo-600 hover:text-indigo-800"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  );
};