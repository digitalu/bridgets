export const fetchFile = `const urlServer = '';

import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import url from 'url';

interface FETCH {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  body?: Record<any, any>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  files?: Record<string, File>;
}

export const Fetch = async ({ path, method, body, query, headers, files }: FETCH) => {
  let completeUrl = urlServer.replace(/\\/$/, '') + path;
  if (query) completeUrl += '/' + new url.URLSearchParams(query).toString();

  const config: AxiosRequestConfig = { url: completeUrl, method };

  if (headers) config.headers = headers;
  if (body) config.data = body;
  else if (files) {
    const formData = new FormData();
    Object.entries(files).forEach(([name, file]) => formData.append(name, file));
    config.data = formData;
    config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
  }

  return axios(config)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};
`;
