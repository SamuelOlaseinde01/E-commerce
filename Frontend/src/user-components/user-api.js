async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login() {
  await sleep(5000);
  return "Samuel";
}
