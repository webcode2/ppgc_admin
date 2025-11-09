import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import { API_SERVER_BASE_URL } from "../../utils/utils";
import { jwtDecode } from "jwt-decode";




// Thunk to fetch data from API
export const loginAccount = createAsyncThunk(
    'auth/loginAccount',
    async (payload: { email: string, password: string }, { rejectWithValue }) => {
    // console.log(data)
        try {
            const { data } = await axios.post(`${API_SERVER_BASE_URL}/auth/signin`, payload, {
                headers: { "Content-Type": "application/json" }
            })
            console.log(data)
            return data?.access_token ? data : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data);
        }
    }
);
export const preRegisterAccount = createAsyncThunk(
    'auth/preRegisterAccount',
    async (data, { rejectWithValue }) => {

        console.log(data)
        try {
            const res = await axios.post(`${API_SERVER_BASE_URL}/auth/request-email-verification-code`, data, {
                headers: { "Content-Type": "application/json" }
            })
            console.log(res);


            return res.status === 200 || res.status === 201 ? { data } : rejectWithValue("something Went wrong")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response?.data.details || "Oops! something went wrong");
        }
    }
);


export const registerAccount = createAsyncThunk(
    'auth/registerAccount',
    async (data, { rejectWithValue }) => {

        console.log(data)
        try {
            const user = await axios.post(`${API_SERVER_BASE_URL}/auth/confirm-email-verification-code`, data, {
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

// Utility: Save to local storage
const saveToLocalStorage = (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
};

// Status type
type Status = "idle" | "loading" | "succeeded" | "failed";

// User model
interface User {
    jwtSub: string;
    bio: string | null;
    roles: string[];
    first_name: string;
    last_name: string;
    email: string;
    access_token: string;
    refresh_token: string;
}

// Pre-auth state
interface PreAuthState {
    authStep: number;
    authName: string;
    authEmail: string;
    authPassword: string;
    error: string | null;
}

// Auth state
interface AuthState {
    status: Status;
    isAuthenticated: boolean;
    preAuth: PreAuthState;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    status: "idle",
    isAuthenticated: false,
    preAuth: {
        authStep: 0,
        authName: "",
        authEmail: "",
        authPassword: "",
        error: null,
    },
    user: null,
    isLoading: false,
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        busyAccount: (state, action) => { action.payload === undefined ? state.isLoading = true : state.isLoading = action.payload },
        setUser: (state, action) => { state.user = action.payload },

        logOut: (state,) => {
            localStorage.removeItem("userDetails");
            return state = initialState
        },
        clearError: (state) => { state.error = null },
        resetPreAuth: (state) => { state.preAuth.authStep = 0 },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.status = "loading";
            })
            .addCase(loginAccount.fulfilled, (state, action: PayloadAction<User>) => {
                const decoded: any = jwtDecode(action.payload.access_token);
                console.log(decoded)
                const jwtSub = decoded?.sub || "";

                const user: User = {
                    jwtSub,
                    bio: action.payload.bio || null,
                    roles: action.payload.roles || [],
                    first_name: action.payload.first_name,
                    last_name: action.payload.last_name,
                    email: action.payload.email,
                    access_token: action.payload.access_token,
                    refresh_token: action.payload.refresh_token,
                };

                state.user = user;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.status = "succeeded";

                saveToLocalStorage("userDetails", user);
            })
            .addCase(loginAccount.rejected, (state, action: any) => {
                state.isLoading = false;
                state.status = "failed";
                state.error = action.error?.message || "Login failed";
            })
            // Check if authenticated cases
            .addCase(checkIfAuthenticated.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkIfAuthenticated.fulfilled, (state, action: PayloadAction<User>) => {
                const user: User = {
                    jwtSub: action.payload.jwtSub,
                    bio: action.payload.bio || null,
                    roles: action.payload.roles || [],
                    first_name: action.payload.first_name,
                    last_name: action.payload.last_name,
                    email: action.payload.email,
                    access_token: action.payload.access_token,
                    refresh_token: action.payload.refresh_token,
                };

                state.user = user;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.status = "succeeded";
            })
            .addCase(checkIfAuthenticated.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    (action.payload as string) ||
                    action.error?.message ||
                    "Authentication check failed";
            })


            //  For Registration
            .addCase(preRegisterAccount.pending, (state) => {
                state.isLoading = true
                state.error = null
            }).addCase(preRegisterAccount.fulfilled, (state, action) => {
                console.log(action)
                //    Store the and proced to thhe next step

            })
            .addCase(preRegisterAccount.rejected, (state, action) => {
                state.error =
                    (action.payload as string) ||
                    action.error?.message ||
                    "New Registration failed";
                state.isLoading = false

            })

            .addCase(registerAccount.pending, (state) => {

            }).addCase(registerAccount.fulfilled, (state, action) => {
                // TODO state state here
                // 
                state.preAuth.authStep = 3

                // saveToLocalStorage({ _: state.user.details, name: "userDeails" })

            }).addCase(registerAccount.rejected, (state, action) => {
                state.preAuth.authStep = 3
                state.isAuthenticated = true
                state.preAuth.error = (action.payload as string) ||
                    action.error?.message ||
                    "Registration failed";
            })

    }
});

export const { setUser, logOut, clearError } = authSlice.actions;
export default authSlice.reducer;
