/**
 * Uploads files directly to Cloudinary.
 * @param files - Array of File objects
 * @param cloudName - Your Cloudinary cloud name
 * @param uploadPreset - Your unsigned upload preset
 * @returns Array of uploaded file URLs
 */
export async function uploadToCloudinary(
    files: File[],
    cloudName: string,
    uploadPreset: string
): Promise<string[]> {
    const uploadUrls: string[] = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadUrls.push(data.secure_url);
    }

    return uploadUrls;
}
