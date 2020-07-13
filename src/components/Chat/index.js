import CSS from './Chat.module.css';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from 'hooks/useSocket';
import { fetchUsersSuccess, userJoin, userLeft, newMessage } from 'actions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const formatDate = ms => {
  const now = new Date();
  const date = new Date(ms);
  const day = ((0).toString() + date.getDate()).slice(-2);
  const month = ((0).toString() + (date.getMonth() + 1)).slice(-2);
  const hours = ((0).toString() + (date.getHours() + 1)).slice(-2);
  const min = ((0).toString() + (date.getMinutes() + 1)).slice(-2);

  if (
    now.getFullYear() === date.getFullYear() &&
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth()
  ) {
    return `${hours}:${min}`;
  }

  return `${day}.${month}.${date.getFullYear()} ${hours}:${min}`;
};

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const messages = useSelector(state => state.chat.messages);
  const textareaEl = useRef(null);

  useEffect(() => {
    window.scroll(0, document.body.offsetHeight);
  }, [messages]);

  useEffect(() => {
    if (socket && socket.connected) {
      socket.emit('users count');

      socket.on('users count', users => {
        dispatch(fetchUsersSuccess({ users }));
      });
      socket.on('user joined', () => {
        dispatch(userJoin());
      });
      socket.on('user left', () => {
        dispatch(userLeft());
      });
      socket.on('new message', message => {
        if (message.self) {
          textareaEl.current.value = '';
        }
        dispatch(newMessage({ message }));
      });
    }
  }, [socket, dispatch]);

  const onSubmit = ev => {
    ev.preventDefault();
    const message = textareaEl.current.value.trim();
    if (!message) return;

    socket.emit('new message', message);
  };

  const onKeyDown = ev => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      onSubmit(ev);
    }
  };

  return (
    <div className={CSS.container}>
      <List className={CSS.messagesList}>
        {messages.map(message => (
          <Paper
            key={message.text + message.created_at}
            elevation={3}
            className={`${CSS.message} ${message.self ? CSS.selfMessage : ''}`}
          >
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={message.text}
                secondary={formatDate(message.created_at)}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
      <form action="#" onSubmit={onSubmit} className={CSS.form}>
        <TextField
          autoFocus
          label="Enter - отправить | Shift + Enter - перенос строки"
          onKeyDown={onKeyDown}
          inputRef={textareaEl}
          multiline
          rows={4}
          variant="outlined"
          className={CSS.textarea}
        />
        <Button color="primary" variant="contained" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;
