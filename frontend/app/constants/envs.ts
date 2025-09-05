
const processEnv = import.meta.env

export const envs = {
  serverUrl: processEnv.VITE_SERVER_URL,
  apiUrl: `${processEnv.VITE_SERVER_URL}/api`,
};
export default envs;
