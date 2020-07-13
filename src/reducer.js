import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import {
  fetchUsersSuccess,
  userJoin,
  userLeft,
  fetchMessages,
  fetchMessagesSuccess,
  newMessage,
} from './actions';

const initialState = {
  users: 0,
  messages: [],
  loading: false,
};

const appReducer = combineReducers({
  chat: handleActions(
    {
      [fetchUsersSuccess]: (state, { payload: { users } }) => ({
        ...state,
        users,
      }),

      [userJoin]: state => ({
        ...state,
        users: state.users + 1,
      }),

      [userLeft]: state => {
        if (!state.users) return state;

        return {
          ...state,
          users: state.users - 1,
        };
      },

      [fetchMessages]: state => ({
        ...state,
        loading: true,
      }),

      [fetchMessagesSuccess]: (state, { payload: { messages } }) => ({
        ...state,
        messages,
      }),

      [newMessage]: (state, { payload: { message } }) => ({
        ...state,
        messages: [...state.messages, message].sort(
          (a, b) => a.created_at > b.created_at,
        ),
      }),
    },
    initialState,
  ),
});

export const rootReducer = (state, action) => appReducer(state, action);
