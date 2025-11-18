import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MapPin, Home, DollarSign, Edit, Trash2, Loader2,
    CalendarCheck, User, Square, CheckCircle, X, Check
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPropertyById } from "../../store/slice/propertySlice";


const DashboardCard = ({ children, title, className = '' }: any) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h3>
        {children}
    </div>
);
// End Mock Definitions

// --- UTILITIES ---
const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
};

// --- STATUS MAPPING UTILITY ---
const getStatusMap = (property: any) => {
    if (property?.is_sold) return { text: 'text-red-600', bg: 'bg-red-100', icon: X, label: 'SOLD' };
    if (property?.is_in_negotiation) return { text: 'text-yellow-600', bg: 'bg-yellow-100', icon: CalendarCheck, label: 'IN NEGOTIATION' };
    return { text: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'AVAILABLE' };
};

// --- DATA DISPLAY HELPER ---
const DataDisplay = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <Icon size={16} className="mr-3 text-indigo-500 flex-shrink-0" />
        <div>
            <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
            <div className="text-sm font-semibold">{value}</div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export default function PropertyDetailPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { property_id } = useParams<{ property_id: string }>();

    // Selectors
    const { selectedProperty: property, isLoading, error } = useSelector((state: RootState) => state.property);

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (property_id) {
            // Note: In a real app, you would dispatch the fetch action here.
            dispatch(fetchPropertyById(property_id));
            console.log(`[Action] Dispatching fetchPropertyById for ID: ${property_id}`);
        }
    }, [property_id, dispatch]);

    const statusMap = useMemo(() => getStatusMap(property), [property]);

    const handleEdit = () => {
        navigate(`/properties/${property_id}/edit`);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${property?.title}"?`)) {
            // Note: In a real app, dispatch delete action here
            console.log(`[Action] Deleting property ID: ${property_id}`);
            navigate('/properties/list');
        }
    };

    // --- Loading and Error States ---
    if (isLoading || !property) {
        if (isLoading) {
            return (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center min-h-screen">
                    <Loader2 size={32} className="animate-spin text-blue-500 mb-3" />
                    Loading Property Details...
                </div>
            );
        }
        if (error) {
            // Ensure error display is clean
            const errorMessage = typeof error === 'string' ? error : (error as any)?.message || "Failed to load property details.";
            return <div className="p-10 text-center text-red-600 min-h-screen">Error: {errorMessage}</div>;
        }
        return <div className="p-10 text-center text-gray-500 min-h-screen">Property not found.</div>;
    }

    // --- RENDER CONTENT ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{property.title}</h1>
                    <p className="text-md text-gray-500 mt-1">Property ID: **{property.id}** | Type: **{property.type}**</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                        onClick={handleEdit}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        <Edit size={20} className="mr-2" /> Edit Details
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        <Trash2 size={20} className="mr-2" /> Delete
                    </button>
                </div>
            </header>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3 width) - Media, Description, Features */}
                <div className="lg:col-span-2 space-y-6">

                    {/* MEDIA & DESCRIPTION CARD */}
                    <div className="verflow-hidden">
                        <img
                            src={property.cover_image.secure_url}
                            alt={`${property.title} Cover`}
                            className="w-full h-96 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-3 text-gray-800 border-b pb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{property.description}</p>
                        </div>

                        {/* Gallery Preview */}
                        <div className="flex flex-wrap gap-3 p-6 pt-0 border-t border-gray-100">
                            <h4 className="text-lg font-semibold w-full text-gray-700 mb-2">Gallery</h4>
                            {property.other_images.map((img: any, index: number) => (
                                <img
                                    key={index}
                                    src={img.secure_url}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-24 h-20 object-cover rounded-md border border-gray-200 shadow-sm transition hover:scale-105"
                                />
                            ))}
                        </div>
                    </div>

                    {/* FEATURES GRID */}
                    <DashboardCard title="Key Features & Amenities" className="mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {property.features.length > 0 ? property.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center text-gray-700 p-3 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm">
                                    <Check size={16} className="mr-2 text-indigo-700 flex-shrink-0" />
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            )) : (
                                <p className="text-gray-500 lg:col-span-3">No specific features listed.</p>
                            )}
                        </div>
                    </DashboardCard>
                </div>

                {/* Right Column (1/3 width) - Status & Financials */}
                <div className="lg:col-span-1 space-y-6">

                    {/* STATUS QUICK VIEW CARD */}
                    <div className={`p-5 rounded-xl text-white shadow-xl`} style={{ backgroundColor: statusMap.text === 'text-green-600' ? '#10B981' : (statusMap.text === 'text-red-600' ? '#EF4444' : '#F59E0B') }}>
                        <div className="flex flex-col items-center">
                            <statusMap.icon size={36} className="text-white" />
                            <span className={`mt-2 text-2xl font-extrabold text-white`}>{statusMap.label}</span>
                        </div>
                    </div>

                    {/* FINANCIALS CARD */}
                    <DashboardCard title="Pricing & Financials">
                        <div className="space-y-4">
                            {/* Listing Price */}
                            <div className="border-b pb-2">
                                <span className="text-lg font-medium text-gray-600 flex items-center mb-1">Listing Price:</span>
                                <span className="text-3xl font-extrabold text-blue-600">{formatCurrency(property.price)}</span>
                            </div>

                            {/* Final Sold Price */}
                            {property.is_sold && property.sold_price !== undefined && (
                                <div className="border-b pb-2">
                                    <span className="text-lg font-medium text-gray-600 flex items-center mb-1">Final Sold Price:</span>
                                    <span className="text-3xl font-extrabold text-green-600">{formatCurrency(property.sold_price)}</span>
                                </div>
                            )}

                            {/* Status and Type */}
                            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                                <DataDisplay icon={Home} label="Type" value={property.type} />
                                <DataDisplay icon={CalendarCheck} label="Availability" value={property.availability} />
                            </div>
                        </div>
                    </DashboardCard>

                    {/* CLIENT DETAILS CARD (Visible only if Sold) */}
                    {property.is_sold && (
                        <DashboardCard title="Client & Sales Details" className="bg-green-50">
                            <div className="pt-2">
                                <h4 className="font-bold text-gray-700 mb-3 flex items-center"><User size={18} className='mr-2 text-green-700' /> Acquisition Details</h4>
                                <div className="text-sm space-y-2">
                                    <p className="text-gray-700">Client: <span className="font-semibold">{property.client_name}</span></p>
                                    <p className="text-gray-700">Contact Email: <span className="font-semibold">{property.client_contact}</span></p>
                                </div>
                                <p className="mt-3 text-xs text-gray-500">Records indicate the property sale is finalized.</p>
                            </div>
                        </DashboardCard>
                    )}

                    {/* LOCATION CARD */}
                    <DashboardCard title="Location Breakdown">
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center font-bold text-base text-gray-800 pb-2 border-b">
                                <MapPin size={16} className="mr-2 text-red-500" /> {property.area.city_or_town}, {property.area.country}
                            </div>
                            <p><span className='font-semibold'>Street:</span> {property.area.street}</p>
                            <p><span className='font-semibold'>Building/Suite:</span> {property.area.building_name_or_suite}</p>
                            <p><span className='font-medium'>State/Province:</span> {property.area.state_or_province}</p>
                            <p><span className='font-medium'>Zip Code:</span> {property.area.zip_or_postal_code}</p>
                        </div>
                    </DashboardCard>

                </div>
            </div>
        </div>
    );
}