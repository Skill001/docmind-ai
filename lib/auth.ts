interface AuthPayload {
  fullName?: string;
  email: string;
  password: string;
}

interface AuthResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

async function post<T>(path: string, body: unknown): Promise<AuthResponse<T>> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        error: {
          message: payload?.error || payload?.message || response.statusText,
          status: response.status,
        },
      };
    }

    return { data: payload };
  } catch (error) {
    return {
      error: {
        message: (error as Error).message || "Unexpected network error",
      },
    };
  }
}

export async function signUp({ fullName, email, password }: AuthPayload) {
  return post<null>("/api/auth/register", { fullName, email, password });
}

export async function signIn({ email, password }: Pick<AuthPayload, "email" | "password">) {
  return post<null>("/api/auth/login", { email, password });
}

export async function signOut() {
  return post<null>("/api/auth/logout", {});
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return { user: null, error: { message: "Unable to verify login state.", status: response.status } };
  }

  const data = await response.json();
  return { user: data.user ?? null, error: null };
}
