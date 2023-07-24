import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { member, memberEnum } from './memberTypes.js';
import { userType } from './users.js';
import { Context, Profile, memberType } from '../types/interface.js';
import DataLoader from 'dataloader';

export const profiles: GraphQLObjectType<Profile, Context> = new GraphQLObjectType({
  name: 'profiles',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: memberEnum,
    },
    memberType: {
      type: member,
      resolve: async (parent: Profile, _args, context: Context, info) => {
        const { dataLoaders, prisma } = context;
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader<string, memberType | undefined>(
            async (ids: readonly string[]) => {
              const members = await prisma.memberType.findMany({
                where: { id: { in: ids as string[] } },
              });
              const sortedInIdsOrder = ids.map((id) =>
                members.find((member) => member.id === id),
              );
              return sortedInIdsOrder;
            },
          );
          dataLoaders.set(info.fieldNodes, dl);
        }
        return await dl.load(parent.memberTypeId);
      },
    },
    user: {
      type: userType,
    },
  }),
});
