import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
    onDropFile: (files: File[]) => void;
    multiple?: boolean;
    initialImage?: string;
    initialImages?: string[];
    label?: string
    onUpload?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onDropFile,
    multiple = false,
    initialImage,
    initialImages,
    label,
    onUpload,
}) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Clean up old object URLs
            previewUrls.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });

            const newUrls = acceptedFiles.map((file) =>
                URL.createObjectURL(file)
            );

            // Append for multi-upload, replace for single
            setPreviewUrls((prev) =>
                multiple ? [...prev, ...newUrls] : newUrls
            );

            onDropFile(acceptedFiles);
            if (onUpload) onUpload(acceptedFiles);
        },
        [multiple, onDropFile, onUpload, previewUrls]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
        },
    });

    useEffect(() => {
        let initialDisplayUrls: string[] = [];

        if (multiple && initialImages?.length) {
            initialDisplayUrls = initialImages;
        } else if (!multiple && initialImage) {
            initialDisplayUrls = [initialImage];
        }

        setPreviewUrls(initialDisplayUrls);

        return () => {
            previewUrls.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [initialImage, initialImages, multiple]);

    return (
        <div className="space-y-4 font-[Inter]">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${isDragActive
                    ? "border-indigo-500 bg-indigo-50 shadow-inner"
                    : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-gray-100"
                    }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 text-indigo-500 mb-2" />
                <p className="text-gray-700 text-sm font-semibold text-center">
                    {isDragActive
                        ? "Drop the file(s) here..."
                        : "Drag & drop file(s) here, or click to select"}
                </p>
                <p className="text-gray-400 text-xs mt-1 text-center">
                    Max file size: 10MB ({multiple ? "Multiple allowed" : "Single only"})
                </p>
            </div>

            {/* Image previews */}
            {previewUrls.length > 0 && (
                <div
                    className={`${previewUrls.length > 1 ? "grid" : "block"
                        } grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2`}
                >
                    {previewUrls.map((url, index) => (
                        <div key={url + index} className="relative">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="object-cover w-full h-40 rounded-md border"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://placehold.co/100x75/fecaca/991b1b?text=Broken";
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrls((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    );
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
