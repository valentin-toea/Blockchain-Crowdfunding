import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../slices/userSlice';
import newProjectReducer from '../slices/newProjectSlice';
import homePageReducer from '../slices/homePageSlice';
import projectReducer from '../slices/projectSlice';
import transactionReducer from '../slices/transactionSlice';
import notificationReducer from '../slices/notificationsSlice';
import searchPageReducer from '../slices/searchPageSlice';
import editProjectReducer from '../slices/editProjectSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    newProject: newProjectReducer,
    editProject: editProjectReducer,
    homePage: homePageReducer,
    searchPage: searchPageReducer,
    project: projectReducer,
    transaction: transactionReducer,
    notificationManager: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
