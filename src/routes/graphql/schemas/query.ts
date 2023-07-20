import { GraphQLList, GraphQLObjectType } from 'graphql';
import { member, memberTypeEnum } from './memberTypes.js';
import { UUIDType } from '../types/uuid.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { posts } from './posts.js';

export const getQueryTypes = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): GraphQLObjectType<any, any> => {
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
            type: memberTypeEnum,
          },
        },
        resolve: async (_parent, args: { id: string }) => {
          return await prisma.memberType.findFirst({
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
          return await prisma.post.findFirst({
            where: { id: args.id },
          });
        },
      },
    }),
  });

  return queryType;
};
