import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface Document {
  id: string;
  vehicle_id: string;
  type: string;
  document_url: string;
  title: string;
  status: string;
  expiry_date?: string;
}

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  isLoading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk('documents/fetchByVehicle', async (vehicleId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/documents/vehicle/${vehicleId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load documents');
  }
});

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDocuments.fulfilled, (state, action) => { state.isLoading = false; state.documents = action.payload; })
      .addCase(fetchDocuments.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export default documentSlice.reducer;