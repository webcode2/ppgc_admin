import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    MapPin, Home, DollarSign, Calendar, AreaChart, Zap, Bed, Bath,
    Loader2, CheckCircle, X, Maximize, User, BookOpen
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPropertyById } from "../../store/slice/propertySlice";
import { twMerge } from "tailwind-merge"
// --- Type Definition for image structure (Assuming from the Redux state) ---
type Image = {
    secure_url: string;
    // Add other relevant properties if available, e.g., alt text
};

// --- Custom Components/Utilities based on Design Tokens ---

// 1. Semantic Button (Primary CTA)
// --- CUSTOM COMPONENT DEFINITIONS (Adjusted for new colors) ---
// Note: These should be updated once in your file's definition section

// 1. Semantic Button (Primary CTA - Uses the darker color for default background)
const PrimaryButton = ({ children, onClick, className = '' }: any) => (
    <button
        onClick={onClick}
        // Base color: Dark Olive/Moss Green (#938E07)
        // Hover color: A slightly darker shade or a transition using the highlight
        className={twMerge(`w-full flex items-center justify-center px-6 py-3 bg-[#938E07] text-white font-bold rounded-lg shadow-lg hover:bg-[#7D7A06] transition-all duration-200 ease-in-out ${className}`)}
    >
        {children}
    </button>
);

// 2. Secondary Button (Keeps white text/border for the dark card background)
const SecondaryButton = ({ children, onClick, className = '' }: any) => (
    <button
        onClick={onClick}
        // Border and Text color remains white for high contrast on the dark card, 
        // with a dark hover state for contrast
        className={twMerge(`w-full flex items-center justify-center px-4 py-3 bg-transparent text-white border border-white font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-all duration-200 ease-in-out ${className}`)}
    >
        {children}
    </button>
);
// 3. Info Card (Matches the subtle background and rounded corners)
const InfoCard = ({ children, className = '' }: any) => (
    <div className={twMerge(`bg-white p-3 rounded-xl shadow-md border border-gray-100 ${className}`)}>
        {children}
    </div>
);

// --- UTILITIES ---
const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'Price on Request';
    return `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
};

// --- DATA MAPPING UTILITY (Enhanced for Features) ---
const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('bed')) return Bed;
    if (lowerFeature.includes('bath')) return Bath;
    if (lowerFeature.includes('sqft') || lowerFeature.includes('area')) return Maximize;
    if (lowerFeature.includes('garage') || lowerFeature.includes('parking')) return Home;
    if (lowerFeature.includes('pool') || lowerFeature.includes('spa')) return Zap;
    if (lowerFeature.includes('tour') || lowerFeature.includes('video')) return BookOpen;
    return CheckCircle; // Default
};

// --- MAIN COMPONENT ---

export default function PropertyViewPage() {
    const mainContentRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { property_id } = useParams<{ property_id: string }>();

    // Selectors
    const { selectedProperty: property, isLoading, error } = useSelector((state: RootState) => state.property);

    // --- STATE FOR IMAGE GALLERY ---
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    // Combine all images into a single array for the gallery
    const galleryImages = useMemo(() => {
        if (!property) return [];
        const cover: Image[] = property.cover_image ? [{ secure_url: property.cover_image.secure_url, alt: `${property.title} cover image` } as Image] : [];
        const others: Image[] = property.other_images ? property.other_images.map((img: any) => ({ secure_url: img.secure_url, alt: `${property.title} gallery image` })) : [];
        return [...cover, ...others];
    }, [property]);

    // Set initial image when property data loads
    useEffect(() => {
        if (property && galleryImages.length > 0 && !selectedImage) {
            setSelectedImage(galleryImages[0]);
        }
    }, [property, galleryImages, selectedImage]);

    // --- Data Fetching & Initial Focus Effect ---
    // useEffect(() => {
    //     if (property_id) {
    //         dispatch(fetchPropertyById(property_id));
    //     }
    // }, [property_id, dispatch]);

    useEffect(() => {
        // Implement initial scroll focus for UX/Accessibility (MDN technique)
        if (!isLoading && property && mainContentRef.current) {
            mainContentRef.current.focus();
        }
    }, [isLoading, property]);

    const statusMap = useMemo(() => {
        if (!property) return { text: 'text-gray-500', bg: 'bg-gray-100', icon: X, label: 'N/A' };
        if (property.is_sold) return { text: 'text-red-600', bg: 'bg-red-100', icon: X, label: 'SOLD' };
        return { text: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'AVAILABLE' };
    }, [property]);

    // Handler to switch the main image
    const handleThumbnailClick = useCallback((image: Image) => {
        setSelectedImage(image);
    }, []);

    // Placeholder Functions
    const handleScheduleViewing = () => alert('Viewing scheduled! (Opens modal)');
    const handleContactAgent = () => alert('Contacting agent! (Opens form)');
    const handleVirtualTour = () => alert('Starting Virtual Tour...');


    // --- Loading and Error States ---
    if (isLoading || !property) {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <Loader2 size={40} className="animate-spin text-[#007AFF] mr-3" />
                    <span className="text-lg text-gray-600">Loading Property Details...</span>
                </div>
            );
        }
        const errorMessage = typeof error === 'string' ? error : (error as any)?.message || "Property not found.";
        return <div className="p-10 text-center text-red-600 min-h-screen bg-white">Error: {errorMessage}</div>;
    }

    // --- RENDER CLIENT VIEW CONTENT ---
    return (
        <div
            ref={mainContentRef}
            tabIndex={-1}
            className="min-h-screen bg-[#F8F9FA] p-0 md:p-8 outline-none focus:outline-none"
        >
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6  md:p-0">

                {/* -------------------- 1. LEFT/MAIN CONTENT (COL 1-8) -------------------- */}
                <main className="lg:col-span-8 space-y-6">

                    {/* HERO IMAGE & BASIC INFO (Enhanced Gallery) */}
                    <InfoCard className="p-0 overflow-hidden">

                        {/* ------------------ MAIN IMAGE DISPLAY ------------------ */}
                        <div className="relative h-[480px] bg-gray-200">
                            <img
                                src={selectedImage?.secure_url || 'https://via.placeholder.com/1200x600?text=Property+Image'}
                                alt={`${property.title} Interior View`}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                            <button
                                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full hover:bg-opacity-75 transition-colors"
                                onClick={() => alert('Open Gallery Modal')}
                            >
                                View all Photos
                            </button>
                        </div>

                        {/* ------------------ THUMBNAIL GALLERY ------------------ */}
                        {galleryImages.length > 1 && (
                            <div className="flex space-x-3 p-4 overflow-x-auto whitespace-nowrap bg-gray-50 border-t border-gray-200">
                                {galleryImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`flex-shrink-0 w-24 h-20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage?.secure_url === img.secure_url
                                            ? 'ring-4 ring-[#007AFF] shadow-lg scale-105'
                                            : 'ring-1 ring-gray-300 hover:opacity-80'
                                            }`}
                                        onClick={() => handleThumbnailClick(img)}
                                    >
                                        <img
                                            src={img.secure_url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Overview and Key Stats - Remains same */}
                        <div className="p-6">
                            <h1 className="text-xl font-heading sm:text-2xl font-bold text-[#212529] mb-1 ">{property.title}</h1>
                            <p className="text-sm font-medium text-gray-500 flex items-center mb-6">
                                <MapPin size={18} className="mr-2 text-red-500" />
                                {property.area?.street}, {property.area?.city_or_town}, {property.area?.state_or_province}
                            </p>

                            {/* STATS BAR */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-t pt-4 border-gray-100">
                                <div className="text-center">
                                    <Bed size={24} className="mx-auto text-[#007AFF] mb-1" />
                                    <div className="text-lg font-bold">{property.beds || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">Beds</div>
                                </div>
                                <div className="text-center">
                                    <Bath size={24} className="mx-auto text-[#007AFF] mb-1" />
                                    <div className="text-lg font-bold">{property.baths || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">Baths</div>
                                </div>
                                <div className="text-center">
                                    <Maximize size={24} className="mx-auto text-[#007AFF] mb-1" />
                                    <div className="text-lg font-bold">{property.sqft || 'N/A'} sqft</div>
                                    <div className="text-sm text-gray-500">Area</div>
                                </div>
                                <div className="text-center">
                                    <Calendar size={24} className="mx-auto text-[#007AFF] mb-1" />
                                    <div className="text-lg font-bold">{property.year_built || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">Built</div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-4">Property Description</h2>
                            <p className=" text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                        </div>
                    </InfoCard>

                    {/* KEY FEATURES & AMENITIES */}
                    <InfoCard>
                        <h2 className="text-2xl font-bold text-gray-800  pb-2 mb-4">Key Features & Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {property.features?.length > 0 ? property.features.map((feature: string, index: number) => {
                                const Icon = getFeatureIcon(feature);
                                return (
                                    <div key={index} className="flex items-center text-gray-700 p-3 bg-[#F0F8FF] rounded-lg border border-gray-200 transition hover:shadow-md">
                                        <Icon size={20} className="mr-3 text-[#007AFF] flex-shrink-0" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                );
                            }) : (
                                <p className="text-gray-500 lg:col-span-3">No specific features listed for this property.</p>
                            )}
                        </div>
                    </InfoCard>

                    {/* Immersive Tours Section */}
                    <InfoCard>
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Virtual & Immersive Tours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                                <h3 className="font-semibold mb-2">Visual 3D Tour</h3>
                                <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                                    [3D Tour Embed Placeholder]
                                </div>
                                <SecondaryButton onClick={handleVirtualTour} className='mt-3'>Launch 3D Walkthrough</SecondaryButton>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                                <h3 className="font-semibold mb-2">Floor Plans</h3>
                                <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                                    [Floor Plan Image Placeholder]
                                </div>
                                <SecondaryButton onClick={() => alert('Download Floor Plan')} className='mt-3'>Download Plans</SecondaryButton>
                            </div>
                        </div>
                    </InfoCard>

                </main>

                {/* -------------------- 2. RIGHT/STICKY CTA (COL 9-12) -------------------- */}
                <aside className="lg:col-span-4 space-y-6">

                    {/* STICKY CTA CARD (Price & Main Actions) */}
                    <div className="lg:sticky lg:top-16  space-y-6">
                        <InfoCard className="bg-[#212529] text-white p-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-3">
                                <span className="text-xl font-medium flex items-center">
                                    {/* ICON COLOR: Bright Yellow/Gold (#F9F10C) */}
                                    <DollarSign size={20} className="mr-1 text-[#F9F10C]" /> Listing Price
                                </span>
                                {/* STATUS LABEL: The status logic remains the same, but the colors might clash. 
           We'll keep the existing dynamic status colors (green/red/yellow) 
           as status is highly functional, but ensure the text is readable. 
           (The dynamic status class will override text-white if the status is available/sold). */}
                                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusMap.text} ${statusMap.bg.replace('-100', '-300').replace('text-', 'bg-')}`}>
                                    {statusMap.label}
                                </span>
                            </div>

                            <h2 className="text-4xl font-extrabold mb-4 text-[#F9F10C]">
                                {/* PRICE COLOR: Bright Yellow/Gold (#F9F10C) for high visibility */}
                                {formatCurrency(property.price)}
                            </h2>

                            {/* Primary Button uses the new dark olive color (#938E07) */}
                            <PrimaryButton onClick={handleScheduleViewing} className='mb-3'>
                                <Calendar size={20} className="mr-2" /> Schedule a Viewing
                            </PrimaryButton>

                            {/* Secondary Button remains consistent (white/transparent) for the dark card */}
                            <SecondaryButton onClick={handleContactAgent} className='border-white text-white hover:bg-gray-700'>
                                <User size={20} className="mr-2" /> Contact Agent
                            </SecondaryButton>
                        </InfoCard>

                        {/* NEIGHBOURHOOD & SCHOOLS CARD */}
                        <InfoCard>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><MapPin size={20} className='mr-2 text-red-500' /> Neighbourhood & Schools</h3>
                            <div className="rounded-lg mb-4 h-64 w-full">
                                {/* Note: Increased height to h-64 for better visibility */}

                                {/* Assuming property.area now includes 'lat' and 'lng'
                                <MapComponent
                                    latitude={property.area?.lat || 34.0522}
                                    longitude={property.area?.lng || -118.2437}
                                    title={property.title}
                                /> */}
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Area Avg. Price:</span>
                                    <span className='text-blue-600'>{formatCurrency(585000)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span>Nearest School:</span>
                                    <span className='font-medium'>Willow Creek Elementary (0.8 mi)</span>
                                </div>
                            </div>
                            <PrimaryButton className='mt-4 py-2 text-sm' onClick={() => alert('View all neighborhood details')}>
                                View Full Report
                            </PrimaryButton>
                        </InfoCard>

                        {/* QUICK STATS/INSIGHTS */}
                        <InfoCard>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center"><AreaChart size={20} className='mr-2 text-indigo-500' /> Market Insights</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <div className='text-xs text-gray-500'>Avg. Days on Market</div>
                                    <div className='font-bold text-lg'>{property.days_on_market || 15}</div>
                                </div>
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <div className='text-xs text-gray-500'>Yearly Price Change</div>
                                    <div className='font-bold text-lg text-green-600'>+4.5%</div>
                                </div>
                                <div className='bg-gray-50 p-3 rounded-lg col-span-2'>
                                    <div className='text-xs text-gray-500'>Last Assessed Value</div>
                                    <div className='font-bold text-lg'>{formatCurrency(property.last_assessed_value || 750000)}</div>
                                </div>
                            </div>
                        </InfoCard>

                    </div>
                </aside>
            </div>
        </div>
    );
}