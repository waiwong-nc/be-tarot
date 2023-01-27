export default [
    {
      user_name: "For testing expired verification code",
      email: "test@hottymail.com",
      password: "pw123",
      code: 1111,
      created_at: new Date(1674815709531),
    },
    {
      user_name: "For testing entering wrong verification code",
      email: "test@hottymail.com",
      password: "pw123",
      code: 1111,
      created_at: new Date(),
    }
  ];