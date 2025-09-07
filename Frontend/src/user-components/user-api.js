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

export async function createProfile(formData) {
  const token = localStorage.getItem("userToken");
  const res = await fetch("http://localhost:3000/api/v1/user/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  return data;
}

export async function getProfile() {
  const token = localStorage.getItem("userToken");
  const res = await fetch("http://localhost:3000/api/v1/user/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    return { msg: data.msg, field: data.field };
  }
  return data;
}

export async function getProducts(search) {
  const res = await fetch(
    `http://localhost:3000/api/v1/products?search=${search}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  return data;
}

export async function getProduct(id) {
  const res = await fetch(`http://localhost:3000/api/v1/products/${id}`);
  const data = res.json();
  if (!res.ok) {
    throw { msg: data.msg };
  }
  return data;
}

export async function addToCart(items) {
  const token = localStorage.getItem("userToken");
  const res = await fetch("http://localhost:3000/api/v1/orders/add-to-cart", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(items),
  });
  const data = res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  return data;
}

export async function getCart() {
  const token = localStorage.getItem("userToken");
  const res = await fetch("http://localhost:3000/api/v1/orders/add-to-cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw { msg: data.msg, field: data.field };
  }
  console.log(data);
  return data.cart;
}
