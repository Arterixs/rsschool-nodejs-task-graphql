import { GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { posts } from './posts.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import {
  Context,
  Id,
  PostChange,
  PostCreate,
  ProfileChange,
  ProfileCreate,
  Subscrubers,
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
      resolve: async (_parent, args: PostCreate, { prisma }: Context) => {
        return await prisma.post.create({ data: { ...args.dto } });
      },
    },
    createUser: {
      type: userType,
      args: {
        dto: { type: userInput },
      },
      resolve: async (_parent, args: UserCreate, { prisma }: Context) => {
        return await prisma.user.create({ data: { ...args.dto } });
      },
    },
    createProfile: {
      type: profiles,
      args: {
        dto: { type: profileInput },
      },
      resolve: async (_parent, args: ProfileCreate, { prisma }: Context) => {
        return await prisma.profile.create({ data: { ...args.dto } });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        try {
          await prisma.post.delete({ where: { id: args.id } });
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
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        try {
          await prisma.user.delete({ where: { id: args.id } });
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
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        try {
          await prisma.profile.delete({ where: { id: args.id } });
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
      resolve: async (_parent, args: PostChange, { prisma }: Context) => {
        return await prisma.post.update({
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
      resolve: async (_parent, args: UserChange, { prisma }: Context) => {
        return await prisma.user.update({
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
      resolve: async (_parent, args: ProfileChange, { prisma }: Context) => {
        return await prisma.profile.update({
          where: { id: args.id },
          data: { ...args.dto },
        });
      },
    },
    subscribeTo: {
      type: userType,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (_parent, args: Subscrubers, { prisma }: Context) => {
        return await prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (_parent, args: Subscrubers, { prisma }: Context) => {
        try {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
          return true;
        } catch {
          return false;
        }
      },
    },
  },
});
