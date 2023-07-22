export type PostChange = PostCreate & Id;
export type ProfileChange = { dto: Omit<ProfileInput, 'userId'> } & Id;
export type UserChange = UserCreate & Id;

export type PostCreate = {
  dto: PostInput;
};

export type UserCreate = {
  dto: UserInput;
};

export type ProfileCreate = {
  dto: ProfileInput;
};

export type Id = {
  id: string;
};

export interface Subscrubers {
  userId: string;
  authorId: string;
}

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
