import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types/common.types';

interface UiState {
  modal: { isOpen: boolean; content: string | null };
  notifications: Notification[];
  globalLoading: boolean;
}

const initialState: UiState = {
  modal: { isOpen: false, content: null },
  notifications: [],
  globalLoading: false,
};

let notificationId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.modal = { isOpen: true, content: action.payload };
    },
    closeModal(state) {
      state.modal = { isOpen: false, content: null };
    },
    addNotification(
      state,
      action: PayloadAction<Omit<Notification, 'id'>>,
    ) {
      state.notifications.push({ ...action.payload, id: String(++notificationId) });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
  },
});

export const { openModal, closeModal, addNotification, removeNotification, setGlobalLoading } =
  uiSlice.actions;
export default uiSlice.reducer;

export const selectNotifications = (state: { ui: UiState }) => state.ui.notifications;
export const selectModal = (state: { ui: UiState }) => state.ui.modal;
