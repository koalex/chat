import { createAction } from 'redux-actions';

export const TYPES = {
  FETCH_USERS_SUCCESS: '@@CHAT/FETCH_USERS_SUCCESS',
  USER_JOIN: '@@CHAT/USER_JOIN',
  USER_LEFT: '@@CHAT/USER_LEFT',
  FETCH_MESSAGES: '@@CHAT/FETCH_MESSAGES',
  FETCH_MESSAGES_SUCCESS: '@@CHAT/FETCH_MESSAGES_SUCCESS',
  NEW_MESSAGE: '@@CHAT/NEW_MESSAGE',
};

export const fetchUsersSuccess = createAction(TYPES.FETCH_USERS_SUCCESS);

export const userJoin = createAction(TYPES.USER_JOIN);

export const userLeft = createAction(TYPES.USER_LEFT);

export const fetchMessages = createAction(TYPES.FETCH_MESSAGES);

export const fetchMessagesSuccess = createAction(TYPES.FETCH_MESSAGES_SUCCESS);
// TODO: fetchMessagesError

export const newMessage = createAction(TYPES.NEW_MESSAGE);
