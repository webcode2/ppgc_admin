export interface RejectedPayload {
    message: string;
    details?: any; // To hold raw error data (like error response body)
}

interface FileUploadProps {
    onDropFile: (files: File[]) => void;
    multiple?: boolean;
    initialImage?: string;
    initialImages?: string[];
}