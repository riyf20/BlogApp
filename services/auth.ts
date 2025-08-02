// Logs user in by connecting to backend
export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

// Logs user in by connecting to backend
export const loginGuestUser = async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/login/guest-mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Guest login failed');
  return data;
};

// Signs user up by connecting to backend
export const signupUser = async (username:string, password:string, email:string, firstName:string, lastName:string) => {

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, firstName, lastName }),
  });

  const data = await response.json();
  if(response.ok) {console.log("all good for now")}
  if (!response.ok) throw new Error(data.message || 'Signup failed');
}

// Grab profile data
export const userData = async (username: string, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/${username}/data`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Profile data fetch failed');
  // console.log(data[0])
  return data[0];
};