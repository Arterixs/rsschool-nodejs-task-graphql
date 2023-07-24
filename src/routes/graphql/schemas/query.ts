/* eslint-disable @typescript-eslint/no-unsafe-call */
import { GraphQLList, GraphQLObjectType } from 'graphql';
import { member, memberEnum } from './memberTypes.js';
import { UUIDType } from '../types/uuid.js';
import { posts } from './posts.js';
import { userType } from './users.js';
import { profiles } from './profiles.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Context, Id } from '../types/interface.js';
import DataLoader from 'dataloader';

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
      // resolve: (parent, _args, context: Context, info) => {
      //   // context.dataloaders был создан на уровне сервера (см сниппет кода выше)
      //   const { dataLoaders, prisma } = context;

      //   // единожды инициализируем DataLoader для получения авторов по ids
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   let dl = dataLoaders.get(info.fieldNodes);
      //   if (!dl) {
      //     dl = new DataLoader(async (ids: any) => {
      //       // обращаемся в базу чтоб получить авторов по ids
      //       const rows = await prisma.user.findMany();
      //       // IMPORTANT: сортируем данные из базы в том порядке, как нам передали ids
      //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      //       const sortedInIdsOrder = ids.map((id) => rows.find((x) => x.id === id));
      //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      //       return sortedInIdsOrder;
      //     });
      //     // ложим инстанс дата-лоадера в WeakMap для повторного использования
      //     dataLoaders.set(info.fieldNodes, dl);
      //   }
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      //   return dl.load(1);
      // },
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
