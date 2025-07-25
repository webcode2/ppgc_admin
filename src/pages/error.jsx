import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 text-center px-4">
            <div className="mb-6">
                <AlertTriangle className="text-yellow-500 w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
