import React, { useState } from "react";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import { useDispatch, useSelector } from "react-redux";
import { createProperty } from "../../store/slice/propertySlice";
import { OutlineButton, SolidButton } from "../../components/buttons";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Area, Errors, PropertyImage, PropertyPayload } from "../../utils/propertiesType";
import { AppDispatch, RootState } from "../../store";

const PropertyWizard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [step, setStep] = useState<number>(1);
    const [errors, setErrors] = useState<Errors>({});
    const property_type = useSelector((state: RootState) => state.property.propertyTypes)
    const [type, setType] = useState<string[]>(property_type);


    const [property, setProperty] = useState<PropertyPayload>({
        title: "",
        price: 0,
        description: "",
        availability: "",
        type: "",
        cover_image: { public_id: "", secure_url: "" },
        other_images: [],
        features: [],
        area: {
            country: "",
            state_or_province: "",
            city_or_town: "",
            county: "",
            street: "",
            zip_or_postal_code: "",
            building_name_or_suite: "",
        },
    });

    // ---------------- VALIDATION ----------------
    const validateStep1 = (): boolean => {
        const errs: Errors = {};
        if (!property.title) errs.title = "Title is required.";
        if (!property.type) errs.type = "Property type is required.";
        if (!property.description) errs.description = "Description is required.";
        if (!property.cover_image.secure_url)
            errs.cover_image = "Cover image is required.";
        if (!property.features.length)
            errs.features = "Select at least one feature.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errs: Errors = {};
        if (!property.price || Number(property.price) <= 0)
            errs.price = "Enter a valid price.";
        if (!property.availability)
            errs.availability = "Availability is required.";
        if (!property.area.country) errs.country = "Country is required.";
        if (!property.area.city_or_town) errs.city_or_town = "City is required.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ---------------- HANDLERS ----------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "price") {
            const num = value === "" ? 0 : Number(value);
            setProperty((prev) => ({ ...prev, price: Number.isNaN(num) ? prev.price : num }));
        } else {
            setProperty((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProperty((prev) => ({ ...prev, area: { ...prev.area, [name]: value } }));
    };

    const handleFeaturesChange = (selected: string[]) => {
        setProperty((prev) => ({ ...prev, features: selected }));
    };

    const handleCoverDrop = (files: File[]) => {
        if (!files?.length) return;
        const f = files[0];
        setProperty((prev) => ({
            ...prev,
            cover_image: { public_id: f.name, secure_url: URL.createObjectURL(f) },
        }));
    };

    const handleOtherImagesDrop = (files: File[]) => {
        const imgs: PropertyImage[] = files.map((f) => ({
            public_id: f.name,
            secure_url: URL.createObjectURL(f),
        }));
        setProperty((prev) => ({ ...prev, other_images: imgs }));
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
            setErrors({});
        }
    };

    const handleBack = () => setStep(1);

    const handleSave = () => {
        if (validateStep2()) {
            dispatch(createProperty(property));
            console.log("Final payload:", property);
        }
    };

    const areaFieldsOrder: (keyof Area)[] = [
        "country",
        "state_or_province",
        "city_or_town",
        "county",
        "street",
        "zip_or_postal_code",
        "building_name_or_suite",
    ];

    return (
        <div className="space-y-6">
            {/* ---------------- STEP 1 ---------------- */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="md:row-span-2 h-full">
                        <DashboardCard title="Property Information" showDropDown={false}>
                            <div className="space-y-6 mt-10">
                                {/* Title & Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-600 mb-1 text-sm font-medium">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={property.title}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1 text-sm font-medium">Property Type</label>
                                        <select
                                            name="type"
                                            value={property.type}
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                setProperty((prev) => ({ ...prev, type: e.target.value }))
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        >
                                            <option value="">Select type</option>
                                            {property_type.map((type, index) => <option key={index + type.toLowerCase()} value={type.toLowerCase().replace(" ", "_")}>{type}</option>
                                            )}

                                        </select>
                                        {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={property.description}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* RIGHT COLUMN - COVER IMAGE */}
                    <div className="h-full">
                        <DashboardCard title="Cover Image" showDropDown={false}>
                            <FileUpload onDropFile={handleCoverDrop} />
                            {property.cover_image.secure_url && (
                                <img
                                    src={property.cover_image.secure_url}
                                    alt="Cover Preview"
                                    className="mt-4 w-full h-48 object-cover rounded-md border"
                                />
                            )}
                            {errors.cover_image && <p className="text-red-500 text-xs">{errors.cover_image}</p>}
                        </DashboardCard>
                    </div>

                    {/* RIGHT COLUMN - FEATURES */}
                    <div className="h-full">
                        <FacilitiesSelect
                            selected={property.features}
                            onChange={handleFeaturesChange}
                            property_type={property.type}
                        />
                        {errors.features && <p className="text-red-500 text-xs">{errors.features}</p>}
                    </div>

                    {/* NEXT BUTTON */}
                    <div className="flex justify-end items-center w-full pb-5 col-span-2">
                        <SolidButton onClick={handleNext} className="flex items-center gap-2 active:scale-95">
                            Next <ArrowRight size={18} />
                        </SolidButton>
                    </div>
                </div>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="md:row-span-2 h-full">
                        <DashboardCard title="Additional Details" showDropDown={false}>
                            <div className="space-y-6 mt-6">
                                {/* Price & Availability */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-600 mb-1 text-sm font-medium">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={property.price}
                                            onChange={handleChange}
                                            className="w-full border rounded-md px-4 py-2 text-sm"
                                        />
                                        {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1 text-sm font-medium">Availability</label>
                                        <select
                                            name="availability"
                                            value={property.availability}
                                            onChange={handleChange}
                                            className="w-full border rounded-md px-4 py-2 text-sm"
                                        >
                                            <option value="">Select availability</option>
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                        {errors.availability && <p className="text-red-500 text-xs">{errors.availability}</p>}
                                    </div>
                                </div>

                                {/* AREA FIELDS */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {areaFieldsOrder.map((field) => (
                                        <div key={field}>
                                            <label className="block text-gray-600 mb-1 text-sm font-medium capitalize">
                                                {String(field).replace(/_/g, " ")}
                                            </label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={property.area[field]}
                                                onChange={handleAreaChange}
                                                className="w-full border rounded-md px-4 py-2 text-sm"
                                            />
                                            {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* RIGHT COLUMN - OTHER IMAGES */}
                    <div className="h-full">
                        <DashboardCard title="Other Images" showDropDown={false}>
                            <FileUpload onDropFile={handleOtherImagesDrop} multiple />
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {property.other_images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img.secure_url}
                                        alt={`Property Image ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        </DashboardCard>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-between items-center w-full pb-5 col-span-2">
                        <OutlineButton onClick={handleBack} className="flex items-center gap-2 active:scale-95">
                            <ArrowLeft size={18} /> Back
                        </OutlineButton>

                        <SolidButton
                            onClick={handleSave}
                            className="flex items-center gap-2 active:scale-95 border border-[#938E07]"
                        >
                            <Save size={18} /> Save
                        </SolidButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyWizard;
