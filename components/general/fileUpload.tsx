'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleFileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  error?: string;
  currentFile?: File | null;
  previousImageUrl?: string; // New prop for existing image URL
}

export function SimpleFileUpload({
  onFileChange,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  error,
  currentFile,
  previousImageUrl
}: SimpleFileUploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    accept,
    maxSize,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      onFileChange(null);
    }
  });

  const removeFile = () => {
    onFileChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get error message
  const getErrorMessage = () => {
    if (error) return error;
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        return `File is too large. Max size is ${formatFileSize(maxSize)}`;
      }
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        return 'Invalid file type. Please select an image file.';
      }
      return rejection.errors[0]?.message || 'File upload failed';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  // Check what to display: new file takes priority, then previous image URL, then upload area
  const hasContent = currentFile || previousImageUrl;

  return (
    <div className={cn("w-full", className)}>
      {!hasContent ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            "hover:bg-gray-50 dark:hover:bg-gray-800/50",
            isDragActive && !isDragReject && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
            isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/20",
            errorMessage ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              isDragActive && !isDragReject
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            )}>
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {isDragActive
                  ? isDragReject
                    ? "Invalid file type"
                    : "Drop the image here"
                  : "Drop an image here, or click to select"
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                PNG, JPG, GIF up to {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current file preview (takes priority) */}
          {currentFile && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 ">
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {currentFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(currentFile)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {currentFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(currentFile.size)}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      New file selected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Previous image preview (shown when no new file is selected) */}
          {!currentFile && previousImageUrl && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={previousImageUrl}
                      alt="Current image"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        }
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Current image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Previously uploaded
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  {...getRootProps()}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <input {...getInputProps()} />
                  Replace
                </button>
              </div>
            </div>
          )}

          {/* Upload area when there's existing content */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50",
              isDragActive && !isDragReject && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
              isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/20",
              errorMessage ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center space-x-2">
              <Upload className="w-5 h-5 text-gray-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive && !isDragReject
                  ? "Drop to replace image"
                  : currentFile
                    ? "Drop here or click to replace selected file"
                    : "Drop here or click to replace current image"
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
    </div>
  );
}