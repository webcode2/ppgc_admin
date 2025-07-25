import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

const SERVER_URL = `http://localhost:4000/`


// Thunk to fetch data from API
export const loginAccount = createAsyncThunk(
    'auth/loginAccount',
    async (data, { rejectWithValue }) => {
        try {
            const user = await axios.post(`${SERVER_URL}api/auth/login`, data, {
                headers: { "Content-Type": "application/json" }
            })
            return user.status === 200 ? user.data : rejectWithValue("something Went wrong")
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const registerAccount = createAsyncThunk(
    'auth/registerAccount',
    async (data, { rejectWithValue }) => {

        try {
            const user = await axios.post(`${SERVER_URL}api/auth/register/`, { ...data, name: data.username }, {
                headers: { "Content-Type": "application/json" }
            })
            console.log(user.status)
            return user.status === 201 ? user.data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);

            return rejectWithValue(err.response.data);
        }
    }
);

export const checkIfAuthenticated = createAsyncThunk(
    "auth/checkIfAuthenticated", async (_, { rejectWithValue }) => {
        const details = localStorage.getItem("userDetails") || null
        if (details) {
            try {
                const userDetails = JSON.parse(details);
                if (userDetails) {
                    return userDetails;
                } else {
                    return rejectWithValue("user not login");
                }
            } catch (err) {
                return rejectWithValue(err.message);
            }
        } else { return rejectWithValue("user not logged in") }

    }
)

const saveToLocalStorage = ({ name, _ }) => {
    localStorage.setItem(name, JSON.stringify(_))
}

const initialState = {
    isAuthenticated: false,
    user: { device: null, details: null },
    isLoading: false,
    error: null,

}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        busyAccount: (state, action) => { action.payload === undefined ? state.isLoading = true : state.isLoading = action.payload },
        setUser: (state, action) => { state.user = action.payload },

        logOut: (state,) => { return state = initialState },
        clearError: (state) => { state.error = null }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAccount.fulfilled, (state, action) => {

                state.isAuthenticated = true
                state.isLoading = false;
                state.user.details = {
                    email: action.payload.email,
                    registeredAt: action.payload.createdAt,
                    name: action.payload.name,
                    id: action.payload.id,
                    token: action.payload.jwt_token

                }
                saveToLocalStorage({ _: state.user.details, name: "userDetails" })

            })
            .addCase(loginAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Check if authenticated cases
            .addCase(checkIfAuthenticated.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkIfAuthenticated.fulfilled, (state, action) => {
                state.isAuthenticated = true
                state.isLoading = false;
                state.user.details = action.payload;
            })
            .addCase(checkIfAuthenticated.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //  For Registration
            .addCase(registerAccount.pending, (state) => {
                state.isLoading = true
                state.error = null
            }).addCase(registerAccount.fulfilled, (state, action) => {
                console.log(action)
                state.isAuthenticated = true
                state.isLoading = false
                state.user.details = {
                    email: action.payload.email,
                    registeredAt: action.payload.createdAt,
                    name: action.payload.name,
                    id: action.payload.id,
                    token: action.payload.jwt_token

                }
                state.user.device = { id: action.payload.device.id, name: action.payload.device.name }

                saveToLocalStorage({ _: state.user.details, name: "userDeails" })
            })
            .addCase(registerAccount.rejected, (state, action) => {
                state.error = action.payload
                state.isLoading = false

            })

    }
});

export const { setUser, logOut, clearError } = authSlice.actions;
export default authSlice.reducer;
