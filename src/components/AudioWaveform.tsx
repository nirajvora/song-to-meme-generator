import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioWaveformProps {
  audioUrl: string;
  onTimeRangeSelect: (start: number, end: number) => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ audioUrl, onTimeRangeSelect }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 30 });

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#4F46E5',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 100,
        barGap: 3,
      });

      wavesurfer.current.load(audioUrl);
      
      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current!.getDuration());
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current!.getCurrentTime());
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRangeChange = (type: 'start' | 'end', value: number) => {
    const newSelection = {
      ...selection,
      [type]: Number(value)
    };
    
    if (newSelection.end - newSelection.start <= 30) {
      setSelection(newSelection);
      onTimeRangeSelect(newSelection.start, newSelection.end);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div ref={waveformRef} className="mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="range"
            min="0"
            max={Math.max(0, duration - 30)}
            value={selection.start}
            onChange={(e) => handleRangeChange('start', Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{formatTime(selection.start)}</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="range"
            min={selection.start}
            max={Math.min(duration, selection.start + 30)}
            value={selection.end}
            onChange={(e) => handleRangeChange('end', Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{formatTime(selection.end)}</span>
        </div>
      </div>
    </div>
  );
};