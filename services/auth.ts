import { useAuthStore } from "@/utils/authStore";
import { setItem } from "expo-secure-store";

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

// Grab user's blog data
export const userBlogData = async (username: string, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search?type=author&field=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Blog data fetch failed');
  return data;
};

// Grab user's comment data
export const userCommentData = async (username: string, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search?type=profile&field=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Blog data fetch failed');
  // console.log(data)
  return data;
};

export const updateUserData = async (username: string, userID:number, token:string, 
  newdata:{fName:string, lName:string, userName:string, email:string, password:string}) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/profile/${username}/${userID}/update`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(newdata)
  })
  const data = await response.json();
  // console.log(JSON.stringify(newdata))
  // console.log(data)
  if (!response.ok) throw new Error(data.message || 'Failed to update user profile');
  return data;
};

export const refreshExpiredToken = async (refreshToken:string, userID:number, username:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/refreshtoken`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refreshToken, userID, username})
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Blog data fetch failed');
  // console.log(data)
  return data;
}