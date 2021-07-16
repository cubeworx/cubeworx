import axios from 'axios';

const JSON_RPC_VERSION = '2.0';
let requestId = 0;

export default function rpc(method, params) {
  requestId += 1;
  const payload = {
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
    id: requestId,
  };
  return axios.post('/api/rpc', payload)
    .then((response) => {
      if (response.data.jsonrpc !== JSON_RPC_VERSION) {
        throw new Error(`[${method} RPC response had invalid JSONRPC version.`);
      }
      if (response.data.id !== payload.id) {
        throw new Error(`[${method}] RPC response ID did not match.`);
      }
      if (response.data.error) {
        console.log(response.data.error);
        throw new Error(`[${method}] RPC returned an error.`);
      }
      if (!response.data.result) {
        throw new Error(`[${method}] RPC did not return a result.`);
      }
      return response.data.result;
    })
    .catch((error) => {
      if (error.response) {
        console.log(`API Response Error: ${error.response.data}`);
      } else if (error.request) {
        console.log('API Request Error:');
        console.log(error.request);
      } else {
        console.log(`API Error ${error.message}`);
      }
      throw new Error(error.response.data);
    });
}
