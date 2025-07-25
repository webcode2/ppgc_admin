// FileUpload.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileImageIcon, UploadCloud } from 'lucide-react';

export default function FileUpload({ onDropFile }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log(acceptedFiles);
            if (onDropFile) onDropFile(acceptedFiles);
        },
        [onDropFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}
      `}
        >
            <input {...getInputProps()} />
            <FileImageIcon className="w-12 h-12 text-gray-400 mb-5" />
            <p className="text-gray-600 text-sm font-bold  flex-col">
                {isDragActive ? 'Drop the file here...' : 'Upload Drag & drop yor file here'}
                <br />
                <span className="text-gray-400">

                    Max. file size: 10MB (Jpeg, Png)
                </span>
            </p>
        </div>
    );
}
