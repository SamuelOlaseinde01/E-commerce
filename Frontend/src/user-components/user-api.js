async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function register(creds) {
  const res = await fetch("http://localhost:3000/api/v1/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });
  const data = await res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  localStorage.setItem("userToken", data.token);
  return data;
}

export async function login(creds) {
  const res = await fetch("http://localhost:3000/api/v1/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });
  const data = await res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  localStorage.setItem("userToken", data.token);
  return data;
}
