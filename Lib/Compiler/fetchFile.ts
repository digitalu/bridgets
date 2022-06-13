export const fetchFile = `import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

const urlServer = '';

interface FETCH {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  body?: Record<any, any>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  files?: Record<string, File>;
}

const getQueryUrl = (query: FETCH["query"]) => {
    let queryString = ""
    if (!query) return queryString

    Object.entries(query).forEach(([name, value]) => {
        queryString += \`\${name}=\${value}&\`
    })

    queryString.slice(0, -1)

    return queryString
}

export const Fetch = async ({ path, method, body, query, headers, files }: FETCH) => {
  let completeUrl = urlServer.replace(/\\/$/, '') + path;
  if (query && Object.keys(query).length > 0) completeUrl += '?' + getQueryUrl(query)

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
};`;
