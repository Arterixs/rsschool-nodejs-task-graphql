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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let dl = dataLoaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (ids: readonly string[]) => {
            const rows = await prisma.memberType.findMany({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              where: { id: { in: ids as string[] } },
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const sortedInIdsOrder = ids.map((id) => rows.find((x) => x.id === id));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return sortedInIdsOrder;
          });
          dataLoaders.set(info.fieldNodes, dl);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return await dl.load(parent.memberTypeId);
      },
    },
    user: {
      type: userType,
    },
  }),
});
