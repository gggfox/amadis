import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedProducts } from "../../generated/graphql";
import { NextPageContext } from "next";
import { createUploadLink } from "apollo-upload-client";

const createClient = (ctx: NextPageContext) => new ApolloClient({
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    headers: {
      cookie: 
        (typeof window === 'undefined' 
          ? ctx?.req?.headers.cookie 
          : undefined) || '',
    },
    fetch,
    fetchOptions: { credentials: "include" },
  }) as any,
  //uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
  headers: {
    cookie: 
      (typeof window === 'undefined' 
        ? ctx?.req?.headers.cookie 
        : undefined) || '',
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: [],
            merge(
              existing: PaginatedProducts | undefined, 
              incoming: PaginatedProducts
            ):PaginatedProducts {
              return {
                ...incoming,
                products: [...(existing?.products || []), ...incoming.products],
              };
            },
          },
          me:{
            keyArgs:["userId"],
            },
          }
          
        },
      },
  }),
});

export const withApollo = createWithApollo(createClient);