type userDataType = {
  user_name: string;
  email: string;
  password: string;
};

type entriesDataType = {
  user_id: number;
  entry_body: string;
  created_at: any;
  tarot_card_id: any[];
};

type TextDataType = {
  usersData: userDataType[];
  entriesData: entriesDataType[];
};
