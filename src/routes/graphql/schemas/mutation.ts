import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { createPostInput, posts } from './posts.js';
import { prismaCopy } from '../index.js';
import { UUIDType } from '../types/uuid.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { memberEnum } from './memberTypes.js';

interface PostCreate {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

interface UserCreate {
  dto: {
    name: string;
    balance: number;
  };
}

interface ProfileCreate {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberEnum },
    userId: { type: UUIDType },
  }),
});

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: posts,
      description: 'createPost',
      args: {
        dto: {
          type: CreatePostInput,
        },
      },
      resolve: async (_parent, args: PostCreate) => {
        return await prismaCopy.post.create({ data: { ...args.dto } });
      },
    },
    createUser: {
      type: userType,
      description: 'createUser',
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_parent, args: UserCreate) => {
        return await prismaCopy.user.create({ data: { ...args.dto } });
      },
    },
    createProfile: {
      description: 'createProfile',
      type: profiles,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (_parent, args: ProfileCreate) => {
        return await prismaCopy.profile.create({ data: { ...args.dto } });
      },
    },
  },
});
