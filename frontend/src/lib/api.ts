const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed.");
  }

  return result;
};