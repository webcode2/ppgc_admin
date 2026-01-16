import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios or fetch wrapper is used for API calls
import { AppInvestmentItem, CreateInvestmentPayload, InvestmentResponse } from '../../utils/types/investment';
import apiClient from '../../utils/axiosConfig';



// Interface for the Slice State
interface InvestmentState {
    plans: InvestmentResponse[];
    subscriptions: AppInvestmentItem[]
    isLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

// --- 2. Initial State ---

const initialState: InvestmentState = {
    plans: [],
    subscriptions: [],
    isLoading: 'idle',
    error: null,
};

// --- 3. Async Thunk: createInvestment ---

/**
 * Creates a new investment plan by sending data to the backend API.
 * The payload is the sanitized, validated InvestmentPlan data from the form.
 *
 * @param planData The validated and sanitized plan data.
 * @param thunkAPI Redux Thunk API object (used for getState, dispatch, etc.)
 */
export const createInvestment = createAsyncThunk<
    InvestmentResponse, // Return type on fulfillment (success)
    CreateInvestmentPayload, // First argument type (input data)
    { rejectValue: string } // Type for the rejection value (error message)
>('investment/createInvestment', async (planData, { rejectWithValue }) => {
    try {
        const res = await apiClient.post('/investments/new')
        // Return the successfully created data
        return res.data;

    } catch (error) {
        // Handle the error and return a custom message
        let errorMessage = 'An unknown error occurred during submission.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Return the error message using rejectWithValue to update state.error
        return rejectWithValue(errorMessage);
    }
});


export const fetchSubscriptions = createAsyncThunk<
    AppInvestmentItem[],                              // RETURN TYPE = array
    Record<string, string> | string | null,           // ARGUMENT TYPE = filter
    { rejectValue: string }                           // REJECT VALUE TYPE
>(
    "investment/fetchSubscriptions",
    async (filter, { rejectWithValue }) => {
        try {
            let query = "";

            // -----------------------------
            // 1. SANITIZE + NORMALIZE FILTER
            // -----------------------------
            if (filter && typeof filter === "string") {
                // Only allow safe characters in raw query
                const safe = /^[a-zA-Z0-9=&_\-]*$/;
                if (!safe.test(filter)) {
                    return rejectWithValue("Invalid query parameter format.");
                }
                query = filter.startsWith("?") ? filter : `?${filter}`;
            }

            if (filter && typeof filter === "object") {
                const safeObject: Record<string, string> = {};

                // sanitize keys + values
                for (const [key, value] of Object.entries(filter)) {
                    const safeKey = key.replace(/[^a-zA-Z0-9_\-]/g, "");
                    const safeValue = value.replace(/[^a-zA-Z0-9_\-]/g, "");
                    safeObject[safeKey] = safeValue;
                }

                const qs = new URLSearchParams(safeObject).toString();
                query = `?${qs}`;
            }

            // -----------------------------
            // 3. EXECUTE CALL
            // -----------------------------
            const response = await apiClient.get(`/investments/all/${query}`);

            if (!response || !Array.isArray(response.data)) {
                return rejectWithValue("Unexpected server response format.");
            }

            // -----------------------------
            // 4. VALIDATE API PAYLOAD SHAPE
            // -----------------------------
            const items: AppInvestmentItem[] = response.data.map((item: any) => ({
                name: String(item.name ?? ""),
                amount: Number(item.amount ?? 0),
                interest_rate: Number(item.interest_rate ?? 0),
                duration: Number(item.duration ?? 0),
                trx: {
                    amount: Number(item.trx?.amount ?? 0),
                    name: String(item.trx?.name ?? ""),
                    trx_id: String(item.trx?.trx_id ?? ""),
                    id: Number(item.trx?.id ?? 0),
                    trx_type: String(item.trx?.trx_type ?? "deposit"),
                    created_at: String(item.trx?.created_at ?? new Date().toISOString()),
                },
                id: Number(item.id ?? 0),
                created_at: String(item.created_at ?? new Date().toISOString()),
                roi: Number(item.roi ?? 0),
                maturity_time: String(item.maturity_time ?? new Date().toISOString()),
                status: String(item.status ?? "inactive"),
            }));

            return items;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to fetch subscriptions";

            return rejectWithValue(message);
        }
    }
);


// --- 4. Redux Slice ---

export const investmentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        // Non-thunk reducers can go here if needed (e.g., resetState)
        resetStatus(state) {
            state.isLoading = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle the PENDING state of the async thunk
            .addCase(createInvestment.pending, (state) => {
                state.isLoading = 'pending';
                state.error = null;
            })
            // Handle the FULFILLED state (success)
            .addCase(createInvestment.fulfilled, (state, action: PayloadAction<InvestmentResponse>) => {
                state.isLoading = 'succeeded';
                // Add the new plan to the state if it was published
                state.plans.push(action.payload);

            })
            // Handle the REJECTED state (failure)
            .addCase(createInvestment.rejected, (state, action) => {
                state.isLoading = 'failed';
                state.error = action.payload || 'Failed to create investment plan.';
            });
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.isLoading = "pending";
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.subscriptions = action.payload;
                state.isLoading = "succeeded";
                state.error = null;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.isLoading = "failed";
                state.error = action.payload ?? "Failed to fetch subscriptions";
            });
    },
});

// --- 5. Exports ---

export const { resetStatus } = investmentSlice.actions;

export default investmentSlice.reducer;