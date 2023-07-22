export type PostCreate = {
  dto: PostInput;
};

export type UserCreate = {
  dto: UserInput;
};

export type ProfileCreate = {
  dto: ProfileInput;
};

interface PostInput {
  title: string;
  content: string;
  authorId: string;
}

interface UserInput {
  name: string;
  balance: number;
}

interface ProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
}
