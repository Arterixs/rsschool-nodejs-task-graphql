import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { profiles } from './profiles.js';
import { posts } from './posts.js';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { Prisma, PrismaClient } from '@prisma/client';

export const getPostQL = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
) => {
  const userType = new GraphQLObjectType({
    name: 'users',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      name: {
        type: GraphQLString,
      },
      balance: {
        type: GraphQLFloat,
      },
      profile: {
        type: profiles,
        resolve(parent: { id: string }) {
          return prisma.profile.findUnique({
            where: { userId: parent.id },
          });
        },
      },
      posts: {
        type: new GraphQLList(posts),
        resolve(parent: { id: string }) {
          return prisma.post.findMany({
            where: { authorId: parent.id },
          });
        },
      },
    }),
  });
  return userType;
};
