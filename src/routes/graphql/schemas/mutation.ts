import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';
import { posts } from './posts.js';
import { prismaCopy } from '../index.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import {
  Id,
  PostChange,
  PostCreate,
  ProfileChange,
  ProfileCreate,
  UserChange,
  UserCreate,
} from '../types/interface.js';
import { changePostInput, postInput } from './mutations/post.js';
import { changeUserInput, userInput } from './mutations/user.js';
import { changeProfileInput, profileInput } from './mutations/profile.js';
import { UUIDType } from '../types/uuid.js';

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
    changePost: {
      type: posts,
      args: {
        dto: { type: changePostInput },
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: PostChange) => {
        return await prismaCopy.post.update({
          where: { id: args.id },
          data: { ...args.dto },
        });
      },
    },
    changeUser: {
      type: userType,
      args: {
        dto: { type: changeUserInput },
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: UserChange) => {
        return await prismaCopy.user.update({
          where: { id: args.id },
          data: { ...args.dto },
        });
      },
    },
    changeProfile: {
      type: profiles,
      args: {
        dto: { type: changeProfileInput },
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: ProfileChange) => {
        return await prismaCopy.profile.update({
          where: { id: args.id },
          data: { ...args.dto },
        });
      },
    },
  },
});
