import { createSlice } from '@reduxjs/toolkit';
import { MOCK_EXAMS } from '../../mock-data';

const examsSlice = createSlice({
  name: 'exams',
  initialState: {
    list: MOCK_EXAMS,
    activeExam: null,
  },
  reducers: {
    addExam(state, action) {
      state.list.push(action.payload);
    },
    updateExam(state, action) {
      const idx = state.list.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteExam(state, action) {
      state.list = state.list.filter((e) => e.id !== action.payload);
    },
    setActiveExam(state, action) {
      state.activeExam = action.payload;
    },
    clearActiveExam(state) {
      state.activeExam = null;
    },
  },
});

export const { addExam, updateExam, deleteExam, setActiveExam, clearActiveExam } = examsSlice.actions;
export default examsSlice.reducer;
