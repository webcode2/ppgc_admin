import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AppDispatch } from "../../store";
import { createInvestment } from "../../store/slice/investmentSlice";
import {
    CreateInvestmentPayload,
    SubmissionStatus,
} from "../../utils/types/investment";
import { SolidButton } from "../../components/buttons";

// -------------------------
// ZOD VALIDATION SCHEMA
// -------------------------
const InvestmentSchema = z.object({
    name: z.string().trim().min(2, "Plan name must be at least 2 characters"),
    amount: z
        .string()
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid positive amount"),
    interest_rate: z
        .string()
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Interest rate must be positive"),
    duration: z
        .string()
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 1, "Duration must be at least 1 month"),
    category: z.enum(["Stocks", "Bonds", "Real Estate", "Crypto", "Other"]),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    status: z.enum(["DRAFT", "PUBLISHED"]),
});

export default function CreateInvestmentPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        interest_rate: "",
        duration: "",
        category: "",
        description: "",
        status: "DRAFT" as SubmissionStatus,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // -------------------------
        // VALIDATE WITH ZOD
        // -------------------------
        const result = InvestmentSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];

                if (typeof field === "string") {
                    fieldErrors[field] = issue.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }
        const safeData = result.data;

        // -------------------------
        // SANITIZATION + PAYLOAD MAPPING
        // -------------------------
        const sanitized: CreateInvestmentPayload = {
            planName: safeData.name.trim(),
            minInvestmentAmount: Number(safeData.amount),
            annualInterestRate: Number(safeData.interest_rate),
            durationMonths: Number(safeData.duration),
            category: safeData.category,
            description: safeData.description.trim(),
            status: safeData.status,
        };

        try {
            alert("seding data")
            await dispatch(createInvestment(sanitized)).unwrap();
            navigate("/investments");
        } catch (error) {
            setErrors({"message":JSON.stringify(error)})
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bg-neutral-100 w-full max-w-3xl p-8 rounded-xl border border-neutral-400 shadow-2xs">
                <h1 className="text-3xl font-bold text-neutral-600 mb-6">Create Investment Plan</h1>
                {errors.message && (
                                <p className="text-red-800 bg-red-200 p-4 text-xs">{errors.message}</p>
                            )}

                <form onSubmit={handleSubmit} className="space-y-6 ">
                    <div className="grid grid-cols-2 space-x-4 space-y-3">

                        {/* Plan Name */}
                        <div className="col-span-2">
                            <label className="text-gray-700 text-sm">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                                placeholder="Example: High Yield Bond"
                            />
                            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                        </div>

                        {/* Min Amount */}
                        <div>
                            <label className="text-gray-700 text-sm">Minimum Investment Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                                placeholder="5000"
                            />
                            {errors.amount && <p className="text-red-400 text-sm">{errors.amount}</p>}
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="text-gray-700 text-sm">Annual Interest Rate (%)</label>
                            <input
                                type="number"
                                name="interest_rate"
                                value={formData.interest_rate}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                                placeholder="5.5"
                            />
                            {errors.interest_rate && (
                                <p className="text-red-400 text-sm">{errors.interest_rate}</p>
                            )}
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="text-gray-700 text-sm">Duration (Months)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                                placeholder="12"
                            />
                            {errors.duration && (
                                <p className="text-red-400 text-sm">{errors.duration}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-gray-700 text-sm">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                            >
                                <option value="">Select Category</option>
                                <option value="Stocks">Stocks</option>
                                <option value="Bonds">Bonds</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Crypto">Crypto</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && (
                                <p className="text-red-400 text-sm">{errors.category}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="text-gray-700 text-sm">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 rounded-md  text-gray-900 border border-neutral-300"
                                placeholder="Detailed description of the investment plan"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm">{errors.description}</p>
                            )}
                        </div>
                    </div>
                   

                        <div className="justify-end w-full flex items-center space-x-2" >
                            <label className="text-gray-700 text-sm">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className=" p-3 rounded-md  text-gray-900 border border-neutral-300"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Publish</option>
                            </select>
                        </div>
                    {/* Actions */}
                    <div className="flex justify-between w-full mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/investments")}
                            className="px-6 py-3 bg-gray-400 text-gray-900 rounded-lg hover:scale-105 transition-all ease-in"
                        >
                            Cancel
                        </button>

                        <SolidButton
                            type="submit"
                            className="px-6 py-3 "
                        >
                            Save Plan
                        </SolidButton>
                    </div>

                </form>
            </div>
        </div>
    );
}
