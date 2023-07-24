import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';

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

export interface SubscrubersUser {
  subscriberId: string;
  authorId: string;
}

export interface Users {
  name: string;
  balance: number;
  id: string;
  userSubscribedTo: SubscrubersUser[];
  subscribedToUser: SubscrubersUser[];
}

export interface Posts {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export interface memberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;

  profiles: Profile[];
}

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
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
