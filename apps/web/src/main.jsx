import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { store } from './store';
import { App } from './app/App';
import { bindAuthTokenAccessors } from './lib/api';
import { setToken, clearAuth, setCredentials, setBootstrapped } from './store/authSlice';
import { authApi } from './lib/authApi';
import './styles/index.css';

bindAuthTokenAccessors(
  () => store.getState().auth.accessToken,
  (token) => store.dispatch(token ? setToken(token) : clearAuth())
);

function Bootstrap() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);

  React.useEffect(() => {
    if (!token) {
      authApi.refresh()
        .then((response) => {
          dispatch(setCredentials(response.data.data));
        })
        .catch(() => {})
        .finally(() => {
          dispatch(setBootstrapped(true));
        });
    } else {
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, token]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Bootstrap />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
