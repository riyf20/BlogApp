import { useAuthStore } from "@/utils/authStore";
import { setItem } from "expo-secure-store";

// Logs user in
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

// Logs Guest User in
export const loginGuestUser = async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/login/guest-mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Guest login failed');
  return data;
};

// Signs user up 
export const signupUser = async (username:string, password:string, email:string, firstName:string, lastName:string) => {

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, firstName, lastName }),
  });

  const data = await response.json();
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
  if (!response.ok) throw new Error(data.message || 'Comment data fetch failed');
  return data;
};

// Updates user credentials
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
  if (!response.ok) throw new Error(data.message || 'Failed to update user profile');
  return data;
};

// Refreshes expired tokens
export const refreshExpiredToken = async (refreshToken:string, userID:number, username:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/refreshtoken`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refreshToken, userID, username})
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Refresh Token Failed');
  return data;
}

// Clears token during logout
export const clearRefreshToken = async (refreshToken:string, userID:number, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/refreshtoken/delete`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({refreshToken, userID})
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Deleting refresh Token failed');
  return data;
}

// Deletes specified blog
export const deleteBlog = async (blogId:number, token:string, username:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/profile/${username}/${blogId}/delete`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to delete blog');
  return data;
};

// Deletes specified comment
export const deleteComment = async (username:string, postid:number, commentId:number, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/profile/${username}/${commentId}/${postid}/delete`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to delete comment');
  return data;
};

// Searches blogs
export const userSearch = async (searchBy:string, search:string, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/search?type=${searchBy}&field=${encodeURIComponent(search)}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Blog search failed');
  return data;
};

// Searches comments
export const fetchComments = async (id:number, token:string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${id}/comments`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Comment search failed');
  return data;
}

// Enters new comment for a specific blog
export const sendComment = async (body:string, user:string, id:number, token:string) => {

  const comment = {body, user, id}

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${id}/comment`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(comment)
  })
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to comment');
  return data;
};

// Posts new blog
export const postBlog = async (author:string, token:string, title:string, body:string) => {

  const blog = {title, body, author}

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/post`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(blog)
  })
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to post blog');
  return data;

};

// Posts images for new blog
export const postImage = async (blogId:number, blogAuthor:string, imageBlob:any, token:string, fileUri:string) => {

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/images/upload`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ blogId, blogAuthor, imageBlob, fileUri })
  })
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Failed to post images');
  return data;

};
