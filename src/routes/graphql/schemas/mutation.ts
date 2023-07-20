import { GraphQLObjectType } from 'graphql';

// const mutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     createPost: {
//       type: createPost,
//       args: {
//         title: { type: GraphQLString },
//         content: { type: GraphQLString },
//         authorId: { type: GraphQLString },
//       },
//       resolve: async (_parent, args: PostUncheckedCreateInput) => {
//         await prisma.post.create({ data: { ...args } });
//       },
//     },
//   },
// });
