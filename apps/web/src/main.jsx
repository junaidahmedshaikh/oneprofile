import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { store } from './store';
import { App } from './app/App';
import { bindAuthTokenAccessors } from './lib/api';
import { useQuery } from '@tanstack/react-query';
import { setToken, clearAuth, setCredentials, setBootstrapped, setUser } from './store/authSlice';
import { authApi } from './lib/authApi';
import './styles/index.css';

bindAuthTokenAccessors(
  () => store.getState().auth.accessToken,
  (token) => store.dispatch(token ? setToken(token) : clearAuth())
);

function Bootstrap() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);

  // Extract tokens from URL search parameters on initial mount (for Google OAuth redirects)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRefreshToken = params.get("refreshToken");

    if (urlToken) {
      dispatch(setCredentials({
        accessToken: urlToken,
        user: null
      }));

      if (urlRefreshToken) {
        localStorage.setItem("oneprofile_fallback_refresh_token", urlRefreshToken);
      }

      params.delete("token");
      params.delete("refreshToken");
      const newSearch = params.toString();
      const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, document.title, newPath);
    }
  }, [dispatch]);

  // Global user query synchronizer to prevent Redux status desyncs
  const { data: userData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      return response.data.data.user;
    },
    enabled: !!token
  });

  React.useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [userData, dispatch]);

  React.useEffect(() => {
    if (!token) {
      authApi.refresh()
        .then((response) => {
          dispatch(setCredentials(response.data.data));
          const newRefreshToken = response.data?.data?.refreshToken;
          if (newRefreshToken) {
            localStorage.setItem("oneprofile_fallback_refresh_token", newRefreshToken);
          }
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
