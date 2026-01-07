import axios from 'axios';

const GRAPHQL_URL = 'https://frontend-test-api.aircall.dev/graphql';

const LOGIN_MUTATION = `
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    user {
      id
      username
    }
  }
}
`;

const REFRESH_MUTATION = `
mutation {
  refreshToken {
    access_token
  }
}
`;

export const login = async (username: string, password: string) => {
  const res = await axios.post(GRAPHQL_URL, {
    query: LOGIN_MUTATION,
    variables: {
      input: { username, password },
    },
  });

  const access_token = res.data.data.login.access_token;
  localStorage.setItem('access_token', access_token);

  return access_token;
};

export const refreshToken = async () => {
  const token = localStorage.getItem('access_token');

  const res = await axios.post(
    GRAPHQL_URL,
    { query: REFRESH_MUTATION },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const newToken = res.data.data.refreshToken.access_token;
  localStorage.setItem('access_token', newToken);

  return newToken;
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
