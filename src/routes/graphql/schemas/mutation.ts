import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';
import { posts } from './posts.js';
import { prismaCopy } from '../index.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { PostCreate, ProfileCreate, UserCreate } from '../types/interface.js';
import { postInput } from './mutations/post.js';
import { userInput } from './mutations/user.js';
import { profileInput } from './mutations/profile.js';
import { UUIDType } from '../types/uuid.js';

type Id = {
  id: string;
};

export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: posts,
      args: {
        dto: { type: postInput },
      },
      resolve: async (_parent, args: PostCreate) => {
        return await prismaCopy.post.create({ data: { ...args.dto } });
      },
    },
    createUser: {
      type: userType,
      args: {
        dto: { type: userInput },
      },
      resolve: async (_parent, args: UserCreate) => {
        return await prismaCopy.user.create({ data: { ...args.dto } });
      },
    },
    createProfile: {
      type: profiles,
      args: {
        dto: { type: profileInput },
      },
      resolve: async (_parent, args: ProfileCreate) => {
        return await prismaCopy.profile.create({ data: { ...args.dto } });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: Id) => {
        try {
          await prismaCopy.post.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: Id) => {
        try {
          await prismaCopy.user.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: Id) => {
        try {
          await prismaCopy.profile.delete({ where: { id: args.id } });
          return true;
        } catch {
          return false;
        }
      },
    },
  },
});
