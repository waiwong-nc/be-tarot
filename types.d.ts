type userDataType = {
  user_name: string;
  email: string;
  password: string;
};

type pendingUserDataType = {
  user_name: string;
  email: string;
  password: string;
  code: number;
  created_at: any;
};

type entriesDataType = {
  user_id: number;
  entry_body: string;
  created_at: any;
  tarot_card_id: any[];
  intention: string;
};

type SeedDataType = {
  usersData: userDataType[];
  entriesData: entriesDataType[];
  pendingUsersData: pendingUserDataType[];
};
