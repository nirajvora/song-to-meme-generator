import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface AudioUploaderProps {
  onAudioUpload: (file: File) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && (file.type.includes('audio') || file.name.match(/\.(mp3|m4a|wav)$/))) {
      onAudioUpload(file);
    }
  }, [onAudioUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.m4a', '.wav']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-lg text-gray-600">
        {isDragActive
          ? "Drop the audio file here..."
          : "Drag & drop an audio file, or click to select"}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Supported formats: MP3, M4A, WAV
      </p>
    </div>
  );
};