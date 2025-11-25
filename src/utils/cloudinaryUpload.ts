import React, { useCallback } from 'react';
// --- CONFIGURATION ---
// These constants assume they are defined and imported from a secure config file.
const CLOUD_NAME = 'deer1ozz5';
const API_KEY = '253119275171331';
// ⚠️ WARNING: Define your UNSIGNED preset here. This is NOT secure.
const UNSIGNED_PRESET = 'ppgc_files';
// --- ENDPOINT DEFINITIONS ---
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

// --- INTERFACE DEFINITIONS ---

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    version: number;
    signature: string;
    // ... other properties
}

interface SignaturePayload {
    signature: string;
    timestamp: string | number;
}

// Define the signature for the required upload function
type UploadFunction = (
    file: File,
    onProgress: (percent: number) => void,
    publicIdToOverwrite: string | null
) => Promise<CloudinaryUploadResponse>;


interface CloudinaryErrorResponse {
    error: {
        message: string;
    };
}

// 💡 NEW TYPE: Progress Callback function
type ProgressCallback = (percent: number) => void;





// -------------------------------------------------------------------------
// ## 1. Secure (Signed) Upload with Progress Tracking
// -------------------------------------------------------------------------

/**
 * Executes a Cloudinary upload operation using XHR to track progress.
 * @param {File} file - The image file to upload.
 * @param {string} folder - The destination folder.
 * @param {SignaturePayload} payload - The signature and timestamp from the backend.
 * @param {ProgressCallback} onProgress - Callback function to receive progress (0-100).
 * @param {string} [publicIdToOverwrite] - Optional Public ID to overwrite for updates.
 * @returns {Promise<CloudinaryUploadResponse>} The Cloudinary response object.
 */
export async function uploadSignedImage(
    file: File,
    folder: string,
    payload: SignaturePayload,
    onProgress: ProgressCallback, // 💡 Mandatory progress callback
    publicIdToOverwrite?: string | null
): Promise<CloudinaryUploadResponse> {

    const { signature, timestamp } = payload;

    if (!file || !signature || !timestamp) {
        throw new Error("Missing required parameters for signed upload.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    if (publicIdToOverwrite) {
        formData.append('public_id', publicIdToOverwrite);
        formData.append('overwrite', 'true');
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 1. Attach the progress listener to the upload object
        xhr.upload.onprogress = (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const percentCompleted = (event.loaded / event.total) * 100;
                // Execute the callback passed by the caller
                onProgress(percentCompleted);
            }
        };

        // 2. Handle completion and response
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success: Resolve the promise with the parsed response
                resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResponse);
            } else {
                // Failure: Reject the promise with error details
                try {
                    const errorData: CloudinaryErrorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(`Cloudinary Upload Error: ${errorData.error.message || xhr.statusText}`));
                } catch (e) {
                    reject(new Error(`Upload failed with status: ${xhr.status} ${xhr.statusText}`));
                }
            }
        };

        // 3. Handle network errors
        xhr.onerror = () => {
            reject(new Error("Network Error or Request Failed."));
        };

        // 4. Send the request
        xhr.open('POST', UPLOAD_URL);
        xhr.send(formData);
    });
}

// -------------------------------------------------------------------------
// ## 2. Insecure (Unsigned) Upload with Progress Tracking ⚠️
// -------------------------------------------------------------------------

/**
 * Executes a Cloudinary upload operation using an UNSECURED UPLOAD PRESET via XHR.
 * ⚠️ WARNING: Only for testing.
 * @param {File} file - The image file to upload.
 * @param {ProgressCallback} onProgress - Callback function to receive progress (0-100).
 * @param {string} [publicIdToOverwrite] - Optional Public ID to overwrite for updates.
 * @returns {Promise<CloudinaryUploadResponse>} The Cloudinary response object.
 */
export async function uploadUnsignedImage(
    file: File,
    onProgress: ProgressCallback, // 💡 Mandatory progress callback
    publicIdToOverwrite?: string | null
): Promise<CloudinaryUploadResponse> {

    if (!file || !UNSIGNED_PRESET) {
        throw new Error("Missing file or UNSIGNED_PRESET for upload.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UNSIGNED_PRESET);

    if (publicIdToOverwrite) {
        formData.append('public_id', publicIdToOverwrite);
        formData.append('overwrite', 'true');
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 1. Attach the progress listener
        xhr.upload.onprogress = (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const percentCompleted = (event.loaded / event.total) * 100;
                onProgress(percentCompleted);
            }
        };

        // 2. Handle completion and response
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResponse);
            } else {
                try {
                    const errorData: CloudinaryErrorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(`Cloudinary Unsigned Upload Error: ${errorData.error.message || xhr.statusText}`));
                } catch (e) {
                    reject(new Error(`Upload failed with status: ${xhr.status} ${xhr.statusText}`));
                }
            }
        };

        // 3. Handle network errors
        xhr.onerror = () => {
            reject(new Error("Network Error or Request Failed."));
        };

        // 4. Send the request
        xhr.open('POST', UPLOAD_URL);
        xhr.send(formData);
    });
}

// -------------------------------------------------------------------------
// ## 3. Secure (Signed) Delete (No changes needed, fetch is fine)
// -------------------------------------------------------------------------



/**
 * Executes a Cloudinary delete operation (Deletion must ALWAYS be signed).
 * Expects signature and timestamp to be fetched securely from the backend.
 * @param {string} publicId - The public ID of the image to delete.
 * @param {SignaturePayload} payload - The signature and timestamp from the backend.
 * @returns {Promise<object>} The Cloudinary response object (status, result).
 */
export async function deleteSignedImage(
    publicId: string,
    payload: SignaturePayload
): Promise<object> {

    const { signature, timestamp } = payload;

    if (!publicId || !signature || !timestamp) {
        throw new Error("Missing required parameters for signed deletion.");
    }

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    try {
        const response = await fetch(DELETE_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData: CloudinaryErrorResponse = await response.json();
            throw new Error(`Cloudinary Delete Error: ${errorData.error.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to delete image:', error);
        throw error;
    }
}


// Assuming these types/functions are available globally or imported from utilities:
// type CloudinaryUploadResponse = { public_id: string; secure_url: string; /* ... */ };
// type ProgressCallback = (percent: number) => void;
// type HotelState = { other_images: Array<{ public_id: string; secure_url: string; }> };



/**
 * Custom hook to handle multi-file uploads with progress tracking and state updating.
 * @param {UploadFunction} uploadService - The specific Cloudinary upload function to use (e.g., uploadUnsignedImage).
 * @param {string} destinationFolder - The Cloudinary folder name (e.g., "ppgc_properties").
 * @param {function} updateProgress - Callback to update the parent component's progress state map.
 * @param {function} setHotel - The state setter for the main hotel/property object.
 * @param {string} [uploadType='other_images'] - Specifies which property array in the hotel state to update.
 * @param {boolean} [isUpdate=false]
 * @returns {function} The optimized onDropFile handler function.
 */
export const useCloudinaryUploadHandler = (
    uploadService: UploadFunction,
    destinationFolder: string,
    updateProgress: (fileId: string, percent: number) => void,
    setHotel: React.Dispatch<React.SetStateAction<any>>,
    uploadType: 'other_images' | 'cover_image' = 'other_images',
    isUpdate: boolean = false
) => {

    const handleDrop = useCallback(async (files: File[]) => {

        console.log(`Received ${files.length} files for ${uploadType} upload.`);

        // --- PRE-UPLOAD CHECKS & SETUP ---

        if (files.length === 0) return; // Ignore empty drops

        // If it's a single picker (cover image), ensure only the first file is processed
        const filesToUpload = uploadType === 'cover_image' ? [files[0]] : files;

        // --- 1. Get Public ID to Overwrite (Only for cover_image type) ---
        let existingPublicId: string | null = null;
        if (uploadType === 'cover_image') {
            setHotel(prevHotel => {
                // If a cover image already exists, capture its public_id for overwrite
                if (prevHotel.cover_image && prevHotel.cover_image.public_id) {
                    existingPublicId = prevHotel.cover_image.public_id;
                }
                return prevHotel; // Return original state, no update yet
            });
        }

        // --- 2. Start Upload Promises ---
        const uploadPromises = filesToUpload.map(async (file) => {
            const fileId = `${file.name}-${file.size}-${Date.now()}`; // Unique ID for progress

            const onProgressCallback = (percent: number) => {
                updateProgress(fileId, percent);
            };

            // Set publicIdToOverwrite for the upload service call
            const currentPublicIdToOverwrite = uploadType === 'cover_image' ? existingPublicId : null;

            try {
                const response = await uploadService(
                    file,
                    onProgressCallback,
                    currentPublicIdToOverwrite // Will be null for gallery or existingPublicId for cover
                );

                updateProgress(fileId, 100);

                return {
                    public_id: response.public_id,
                    secure_url: response.secure_url,
                };
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
                updateProgress(fileId, -1);
                throw error;
            }
        });

        // --- 3. Await Results and Update Main State ---
        try {
            const newUploadedImages = await Promise.all(uploadPromises);
            console.log("All uploads completed successfully.");

            setHotel((prevHotel) => {
                // Determine the correct state update based on 'uploadType'
                if (uploadType === 'cover_image') {
                    // Overwrite the single cover_image object
                    return {
                        ...prevHotel,
                        cover_image: newUploadedImages[0],
                    };
                } else {
                    // Append for gallery/other_images
                    if (isUpdate) {
                        return {
                            ...prevHotel,
                            other_images: [...newUploadedImages],
                        }
                    } else {
                        return {
                            ...prevHotel,
                            other_images: [...(prevHotel.other_images || []), ...newUploadedImages],
                        };
                    }
                }
            });

            // Clear the progress map after successful state update
            // NOTE: We clear the entire map even if only one file was uploaded, 
            // as its task is complete.
            updateProgress('', 0); 

        } catch (error) {
            console.error("One or more uploads failed, stopping process.");
            // Global toast notification can be added here
        }

    }, [uploadService, destinationFolder, updateProgress, setHotel, uploadType]);

    return handleDrop;
};