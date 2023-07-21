import { GraphQLList, GraphQLObjectType } from 'graphql';
import { member, memberEnum } from './memberTypes.js';
import { UUIDType } from '../types/uuid.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { posts } from './posts.js';
import { getPostQL } from './users.js';
import { profiles } from './profiles.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const getQueryTypes = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): Map<any, any> => {
  const userType = getPostQL(prisma);
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      memberTypes: {
        type: new GraphQLList(member),
        resolve: async (_parent) => {
          return await prisma.memberType.findMany();
        },
      },
      memberType: {
        type: member,
        args: {
          id: {
            type: memberEnum,
          },
        },
        resolve: async (_parent, args: { id: MemberTypeId }) => {
          return await prisma.memberType.findUnique({
            where: { id: args.id },
          });
        },
      },
      posts: {
        type: new GraphQLList(posts),
        resolve: async (_source) => {
          return await prisma.post.findMany();
        },
      },
      post: {
        type: posts,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_parent, args: { id: string }) => {
          return await prisma.post.findUnique({
            where: { id: args.id },
          });
        },
      },
      users: {
        type: new GraphQLList(userType),
        resolve: async (_source) => {
          return await prisma.user.findMany();
        },
      },
      user: {
        type: userType,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_parent, args: { id: string }) => {
          return await prisma.user.findUnique({
            where: { id: args.id },
          });
        },
      },
      profiles: {
        type: new GraphQLList(profiles),
        resolve: async (_source) => {
          return await prisma.profile.findMany();
        },
      },
      profile: {
        type: profiles,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_parent, args: { id: string }) => {
          return await prisma.profile.findUnique({
            where: { id: args.id },
          });
        },
      },
    }),
  });
  const storage = new Map();
  storage.set(1, queryType);
  storage.set(2, userType);

  return storage;
};
