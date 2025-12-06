import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios or fetch wrapper is used for API calls
import { CreateInvestmentPayload, InvestmentResponse } from '../../utils/types/investment';
import apiClient from '../../utils/axiosConfig';



// Interface for the Slice State
interface InvestmentState {
    plans: InvestmentResponse[];
    isLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

// --- 2. Initial State ---

const initialState: InvestmentState = {
    plans: [],
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
    },
});

// --- 5. Exports ---

export const { resetStatus } = investmentSlice.actions;

export default investmentSlice.reducer;