import { GraphQLList, GraphQLObjectType } from 'graphql';
import { member, memberEnum } from './memberTypes.js';
import { UUIDType } from '../types/uuid.js';
import { posts } from './posts.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context, Id } from '../types/interface.js';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(member),
      resolve: async (_parent, _args, { prisma }: Context) => {
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
      resolve: async (_parent, args: { id: MemberTypeId }, { prisma }: Context) => {
        return await prisma.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(posts),
      resolve: async (_source, _args, { prisma }: Context) => {
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
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        return await prisma.post.findUnique({
          where: { id: args.id },
        });
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (_source, _args, { prisma }: Context) => {
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
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        return await prisma.user.findUnique({
          where: { id: args.id },
          include: {
            subscribedToUser: true,
            userSubscribedTo: true,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(profiles),
      resolve: async (_source, _args, { prisma }: Context) => {
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
      resolve: async (_parent, args: Id, { prisma }: Context) => {
        return await prisma.profile.findUnique({
          where: { id: args.id },
          include: {
            user: true,
            memberType: true,
          },
        });
      },
    },
  }),
});
