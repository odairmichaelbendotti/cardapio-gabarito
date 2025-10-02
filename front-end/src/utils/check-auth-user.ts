export const CheckAuth = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth", {
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return;
  }
};
