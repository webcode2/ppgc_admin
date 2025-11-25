import * as sha1 from 'sha1';
// // ⚠️ WARNING: THIS CODE EXPOSES YOUR SECRET KEY. DO NOT USE IN PRODUCTION.
const CLOUDINARY_CLOUD_NAME = 'deer1ozz5';
const CLOUDINARY_API_KEY = '253119275171331';
const CLOUDINARY_API_SECRET = 'uZ-6757575757jjj6LTxO4o';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


// 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


// --- TYPE DEFINITIONS ---

interface SignatureParameters {
    timestamp: number;
    folder: string; // Required for upload signing
    api_key: string;
    public_id?: string | null;
    overwrite?: 'true' | 'false' | string;
}

interface DeleteSignatureParameters {
    timestamp: number;
    public_id: string; // Required for deletion signing
}

// 💡 FIX: Define the union of possible parameter inputs for the signature function (excluding api_key)
type SignatureInputParams = Omit<SignatureParameters, 'api_key'> | DeleteSignatureParameters;

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    version: number;
    signature: string;
    // ... other fields provided by Cloudinary
}


/**
 * Generates a Cloudinary signature entirely on the frontend (INSECURE TEST METHOD).
 * @param {SignatureInputParams} params - The parameters to be signed (EXCLUDING 'api_key').
 * @returns {string} The SHA-1 signature hash.
 */
const generateSignature = (params: SignatureInputParams): string => {

    // 💡 FIX 1: Allow null/undefined in the intermediate map and use type assertion on spread.
    const paramsWithKey: { [key: string]: string | number | null | undefined } = {
        // Cast to 'any' allows us to spread the union type safely into a new object
        ...(params as any),
        api_key: CLOUDINARY_API_KEY
    };

    // 2. Filter out null/undefined values and sort keys alphabetically
    const keys = Object.keys(paramsWithKey)
        .filter(key => paramsWithKey[key] !== null && paramsWithKey[key] !== undefined)
        .sort();

    // 3. Format parameters into query string format (key=value&...)
    const paramString = keys
        // The type assertion here is now safe because null/undefined values were filtered out.
        .map(key => `${key}=${paramsWithKey[key] as string | number}`)
        .join('&');

    // 4. Append the API Secret Key to the parameter string
    const stringToSign = `${paramString}${CLOUDINARY_API_SECRET}`;

    // 5. Generate and return the SHA-1 hash
    // (Using sha1(string) assumes the environment handles the HMAC requirement for testing)
    return sha1(stringToSign);
};


// ---------------------------------------------------------------------------------


/**
 * 1. Upload Utility using a locally generated signature (TEST ONLY).
 * Creates or updates an image in Cloudinary.
 * @param {File} file - The image file.
 * @param {string} folder - The destination folder.
 * @param {string | null} publicId - (Optional) Public ID to overwrite (for update).
 * @returns {Promise<CloudinaryResponse>} Cloudinary response object.
 */
export async function uploadSignedImageTest(
    file: File,
    folder: string,
    publicId: string | null = null
): Promise<CloudinaryResponse> {
    if (!file || !folder) {
        throw new Error("File and folder are required.");
    }

    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Parameters used to generate the signature (MUST conform to SignatureInputParams)
    const signatureParams: Omit<SignatureParameters, 'api_key'> = {
        timestamp: timestamp,
        folder: folder,
        public_id: publicId,
        overwrite: publicId ? 'true' : 'false'
    };

    // The type passed here is Omit<SignatureParameters, 'api_key'>, which is part of SignatureInputParams
    const signature = generateSignature(signatureParams);

    // --- EXECUTE UPLOAD ---
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);
    console.log(formData)

    if (publicId) {
        formData.append('public_id', publicId);
        formData.append('overwrite', 'true');
    }

    try {
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(`Cloudinary Upload Error: ${errorData.error.message || response.statusText}`);
        }
        console.log(response.json())
        return await response.json() as CloudinaryResponse;
    } catch (error) {
        console.error('Failed to upload image (TEST MODE):', error);
        throw error;
    }
}


/**
 * 2. Signed Delete Utility using a locally generated signature (TEST ONLY).
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<object>} Cloudinary response object.
 */
export async function deleteSignedImageTest(publicId: string): Promise<object> {
    if (!publicId) {
        throw new Error("Public ID is required for deletion.");
    }

    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Parameters used to generate the signature (MUST conform to DeleteSignatureParameters)
    const params: DeleteSignatureParameters = {
        timestamp: timestamp,
        public_id: publicId,
    };

    // The type passed here is DeleteSignatureParameters, which is part of SignatureInputParams
    const signature = generateSignature(params);

    // --- EXECUTE DELETE ---
    const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    try {
        const response = await fetch(DELETE_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Cloudinary Delete Error: ${errorData.error.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to delete image (TEST MODE):', error);
        throw error;
    }
}