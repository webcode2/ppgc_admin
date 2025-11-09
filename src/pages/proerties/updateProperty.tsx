import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboardCard";
import FileUpload from "../../components/fileUpload";
import FacilitiesSelect from "../../components/properties/propertyFacilitySecetion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPropertyById, updateProperty } from "../../store/slice/propertySlice";
import Loading from "../../components/loading";
import { OutlineButton, SolidButton } from "../../components/buttons";
import { Save, ArrowLeft } from "lucide-react";
import { PropertyPayload, PropertyImage, Area } from "../../utils/types/propertiesType";

const UpdatePropertyScreen = () => {
    const { property_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isLoading, selectedProperty } = useSelector(
        (state: RootState) => state.property
    );

    const [formData, setFormData] = useState<PropertyPayload>({
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

    const [errors, setErrors] = useState<Record<string, string>>({});

    /** Fetch property data */
    useEffect(() => {
        if (property_id) {
            dispatch(fetchPropertyById(Number(property_id)));
        }
    }, [property_id, dispatch]);

    /** Prepopulate form when data is ready */
    useEffect(() => {
        if (selectedProperty) {
            setFormData({
                title: selectedProperty.title || "",
                price: selectedProperty.price || 0,
                description: selectedProperty.description || "",
                availability: selectedProperty.availability || "",
                type: selectedProperty.type || "",
                cover_image: selectedProperty.cover_image || { public_id: "", secure_url: "" },
                other_images: selectedProperty.other_images || [],
                features: selectedProperty.features || [],
                area: {
                    country: selectedProperty.area?.country || "",
                    state_or_province: selectedProperty.area?.state_or_province || "",
                    city_or_town: selectedProperty.area?.city_or_town || "",
                    county: selectedProperty.area?.county || "",
                    street: selectedProperty.area?.street || "",
                    zip_or_postal_code: selectedProperty.area?.zip_or_postal_code || "",
                    building_name_or_suite: selectedProperty.area?.building_name_or_suite || "",
                },
            });
        }
    }, [selectedProperty]);

    /** Field Handlers */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            area: { ...prev.area, [name]: value },
        }));
    };

    const handleFeaturesChange = (selected: string[]) => {
        setFormData((prev) => ({ ...prev, features: selected }));
    };

    const handleCoverDrop = (files: File[]) => {
        if (!files.length) return;
        const f = files[0];
        setFormData((prev) => ({
            ...prev,
            cover_image: { public_id: f.name, secure_url: URL.createObjectURL(f) },
        }));
    };

    const handleOtherImagesDrop = (files: File[]) => {
        const imgs: PropertyImage[] = files.map((f) => ({
            public_id: f.name,
            secure_url: URL.createObjectURL(f),
        }));
        setFormData((prev) => ({ ...prev, other_images: imgs }));
    };

    const handleSave = async () => {
        await dispatch(updateProperty({ id: Number(property_id), data: formData })).unwrap();
        navigate("/dashboard/properties");
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

    /** LOADING OVERLAY */
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LEFT COLUMN */}
                <div className="md:row-span-2 h-full">
                    <DashboardCard title="Update Property" showDropDown={false}>
                        <div className="space-y-6 mt-10">
                            {/* Title + Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Property Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                    >
                                        <option value="">Select type</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="villa">Villa</option>
                                        <option value="studio">Studio</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price + Availability */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium">Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    >
                                        <option value="">Select status</option>
                                        <option value="available">Available</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-600 mb-1 text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* RIGHT: Cover Image */}
                <div className="h-full">
                    <DashboardCard title="Cover Image" showDropDown={false}>
                        <FileUpload onDropFile={handleCoverDrop} />
                        {formData.cover_image?.secure_url && (
                            <img
                                src={formData.cover_image.secure_url}
                                alt="cover"
                                className="mt-3 rounded-md border w-full object-cover"
                            />
                        )}
                    </DashboardCard>
                </div>

                {/* RIGHT: Features */}
                <div className="h-full">
                    <DashboardCard title="Features" showDropDown={false}>
                        <FacilitiesSelect
                            selected={formData.features}
                            onChange={handleFeaturesChange}
                            property_type={formData.type}
                        />
                    </DashboardCard>
                </div>

                {/* Area Info */}
                <div className="col-span-2">
                    <DashboardCard title="Property Location" showDropDown={false}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {areaFieldsOrder.map((field) => (
                                <div key={field}>
                                    <label className="block text-gray-600 mb-1 text-sm font-medium capitalize">
                                        {String(field).replace(/_/g, " ")}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.area[field]}
                                        onChange={handleAreaChange}
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* Other Images */}
                <div className="col-span-2">
                    <DashboardCard title="Other Images" showDropDown={false}>
                        <FileUpload onDropFile={handleOtherImagesDrop} multiple />
                        <div className="flex flex-wrap gap-3 mt-3">
                            {formData.other_images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.secure_url}
                                    alt={img.public_id}
                                    className="w-28 h-28 object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    </DashboardCard>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between items-center w-full pb-5 col-span-2">
                    <OutlineButton
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 active:scale-95"
                    >
                        <ArrowLeft size={18} /> Back
                    </OutlineButton>

                    <SolidButton
                        onClick={handleSave}
                        className="flex items-center gap-2 active:scale-95 border border-[#938E07]"
                    >
                        <Save size={18} /> Update
                    </SolidButton>
                </div>
            </div>
        </div>
    );
};

export default UpdatePropertyScreen;
