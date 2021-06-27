import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Category = {
  __typename?: 'Category';
  name: Scalars['String'];
  promotors?: Maybe<Array<User>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CategoryResponse = {
  __typename?: 'CategoryResponse';
  errors?: Maybe<Array<FieldError>>;
  category?: Maybe<Category>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  chooseCategories4Promotor?: Maybe<UserResponse>;
  votePromotor: Scalars['Boolean'];
  createPromotion: Scalars['Boolean'];
  deletePromotion: Scalars['Boolean'];
  createCategory: CategoryResponse;
  deleteCategory: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  addPicture: Scalars['Boolean'];
  createProduct: ProductResponse;
  updateProduct: ProductResponse;
  deleteProduct: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  addSocialMedia: Scalars['Boolean'];
  deleteSocialMedia: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  saveProduct: Scalars['Boolean'];
  unSaveProduct: Scalars['Boolean'];
};


export type MutationChooseCategories4PromotorArgs = {
  categories: Array<Scalars['String']>;
  id: Scalars['Int'];
};


export type MutationVotePromotorArgs = {
  value: Scalars['Int'];
  promotorId: Scalars['Int'];
};


export type MutationCreatePromotionArgs = {
  productId: Scalars['Int'];
};


export type MutationDeletePromotionArgs = {
  productId: Scalars['Int'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  name: Scalars['String'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  productId: Scalars['Int'];
};


export type MutationAddPictureArgs = {
  productId: Scalars['Int'];
  picture: Scalars['Upload'];
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationUpdateProductArgs = {
  input: ProductInput;
  productId: Scalars['Int'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationAddSocialMediaArgs = {
  social_media: Scalars['String'];
  link: Scalars['String'];
};


export type MutationDeleteSocialMediaArgs = {
  link: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  token: Scalars['String'];
  socialMedia: Scalars['String'];
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationSaveProductArgs = {
  productId: Scalars['Int'];
};


export type MutationUnSaveProductArgs = {
  productId: Scalars['Int'];
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  products: Array<Product>;
  hasMore: Scalars['Boolean'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['Float'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  saved?: Maybe<Scalars['Boolean']>;
  quantity: Scalars['Int'];
  price: Scalars['Int'];
  comision: Scalars['Float'];
  discount: Scalars['Float'];
  creatorId: Scalars['Int'];
  creator: User;
  categories?: Maybe<Array<Product_Category>>;
  promotors?: Maybe<Array<User>>;
  interestedUsers?: Maybe<Array<User>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type ProductInput = {
  title: Scalars['String'];
  text: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
  categoryNames?: Maybe<Array<Scalars['String']>>;
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  errors?: Maybe<Array<FieldError>>;
  product?: Maybe<Product>;
};

export type Product_Category = {
  __typename?: 'Product_Category';
  productId: Scalars['Int'];
  categoryName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  promotores: Array<User>;
  promotor: User;
  promotoresByCategory?: Maybe<Array<User>>;
  allCategories: Array<Category>;
  hello: Scalars['String'];
  products: PaginatedProducts;
  product?: Maybe<Product>;
  productsByCategory?: Maybe<Array<Product>>;
  allProductCategories: Array<Product_Category>;
  productCategories?: Maybe<Array<Product_Category>>;
  me?: Maybe<User>;
  users: Array<User>;
  user: User;
  savedProducts?: Maybe<User>;
};


export type QueryPromotorArgs = {
  id: Scalars['Int'];
};


export type QueryPromotoresByCategoryArgs = {
  categoryName: Scalars['String'];
};


export type QueryProductsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};


export type QueryProductsByCategoryArgs = {
  categoryName: Scalars['String'];
};


export type QueryProductCategoriesArgs = {
  productId: Scalars['Int'];
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};

export type SocialMedia = {
  __typename?: 'SocialMedia';
  social_media: Scalars['String'];
  link: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  socialMedia?: Maybe<Array<SocialMedia>>;
  userType: Scalars['String'];
  influencerVoteStatus?: Maybe<Scalars['Int']>;
  influencerPoints: Scalars['Float'];
  activePromotions: Scalars['Float'];
  categories?: Maybe<Array<Category>>;
  promotes?: Maybe<Array<Product>>;
  savedProducts?: Maybe<Array<Product>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  confirmation: Scalars['String'];
};

export type ProductSnippetFragment = (
  { __typename?: 'Product' }
  & Pick<Product, 'id' | 'title' | 'points' | 'price' | 'textSnippet' | 'voteStatus'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type PromotorUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'userType' | 'influencerPoints' | 'influencerVoteStatus'>
  & { categories?: Maybe<Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'name'>
  )>>, socialMedia?: Maybe<Array<(
    { __typename?: 'SocialMedia' }
    & Pick<SocialMedia, 'link' | 'social_media'>
  )>> }
);

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularCategoryResponseFragment = (
  { __typename?: 'CategoryResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & Pick<FieldError, 'field' | 'message'>
  )>>, category?: Maybe<(
    { __typename?: 'Category' }
    & Pick<Category, 'name'>
  )> }
);

export type RegularProductResponseFragment = (
  { __typename?: 'ProductResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & Pick<FieldError, 'field' | 'message'>
  )>>, product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'text' | 'points' | 'creatorId'>
  )> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'userType'>
  & { savedProducts?: Maybe<Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id'>
  )>> }
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type AddPictureMutationVariables = Exact<{
  picture: Scalars['Upload'];
  productId: Scalars['Int'];
}>;


export type AddPictureMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addPicture'>
);

export type AddSocialMediaMutationVariables = Exact<{
  social_media: Scalars['String'];
  link: Scalars['String'];
}>;


export type AddSocialMediaMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addSocialMedia'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type ChooseCategories4PromotorMutationVariables = Exact<{
  id: Scalars['Int'];
  categories: Array<Scalars['String']> | Scalars['String'];
}>;


export type ChooseCategories4PromotorMutation = (
  { __typename?: 'Mutation' }
  & { chooseCategories4Promotor?: Maybe<(
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'userType'>
      & { categories?: Maybe<Array<(
        { __typename?: 'Category' }
        & Pick<Category, 'name'>
      )>> }
    )> }
  )> }
);

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createCategory: (
    { __typename?: 'CategoryResponse' }
    & RegularCategoryResponseFragment
  ) }
);

export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
}>;


export type CreateProductMutation = (
  { __typename?: 'Mutation' }
  & { createProduct: (
    { __typename?: 'ProductResponse' }
    & RegularProductResponseFragment
  ) }
);

export type CreatePromotionMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type CreatePromotionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createPromotion'>
);

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProduct'>
);

export type DeletePromotionMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type DeletePromotionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePromotion'>
);

export type DeleteSocialMediaMutationVariables = Exact<{
  link: Scalars['String'];
}>;


export type DeleteSocialMediaMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteSocialMedia'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
  socialMedia: Scalars['String'];
  token: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type SaveProductMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type SaveProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'saveProduct'>
);

export type UnSaveProductMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type UnSaveProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'unSaveProduct'>
);

export type UpdateProductMutationVariables = Exact<{
  productId: Scalars['Int'];
  input: ProductInput;
}>;


export type UpdateProductMutation = (
  { __typename?: 'Mutation' }
  & { updateProduct: (
    { __typename?: 'ProductResponse' }
    & RegularProductResponseFragment
  ) }
);

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  productId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type VotePromotorMutationVariables = Exact<{
  value: Scalars['Int'];
  promotorId: Scalars['Int'];
}>;


export type VotePromotorMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'votePromotor'>
);

export type SavedProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type SavedProductsQuery = (
  { __typename?: 'Query' }
  & { savedProducts?: Maybe<(
    { __typename?: 'User' }
    & { savedProducts?: Maybe<Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'points' | 'text' | 'voteStatus'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ), categories?: Maybe<Array<(
        { __typename?: 'Product_Category' }
        & Pick<Product_Category, 'categoryName'>
      )>>, promotors?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )>> }
    )>> }
  )> }
);

export type CategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoryQuery = (
  { __typename?: 'Query' }
  & { allCategories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'name'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type MySavedProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySavedProductsQuery = (
  { __typename?: 'Query' }
  & { savedProducts?: Maybe<(
    { __typename?: 'User' }
    & { savedProducts?: Maybe<Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id'>
    )>> }
  )> }
);

export type ProductQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProductQuery = (
  { __typename?: 'Query' }
  & { product?: Maybe<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'points' | 'price' | 'quantity' | 'text' | 'voteStatus'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ), categories?: Maybe<Array<(
      { __typename?: 'Product_Category' }
      & Pick<Product_Category, 'categoryName'>
    )>>, promotors?: Maybe<Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )>> }
  )> }
);

export type ProductsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products: (
    { __typename?: 'PaginatedProducts' }
    & Pick<PaginatedProducts, 'hasMore'>
    & { products: Array<(
      { __typename?: 'Product' }
      & ProductSnippetFragment
    )> }
  ) }
);

export type ProductsByCategoryQueryVariables = Exact<{
  categoryName: Scalars['String'];
}>;


export type ProductsByCategoryQuery = (
  { __typename?: 'Query' }
  & { productsByCategory?: Maybe<Array<(
    { __typename?: 'Product' }
    & ProductSnippetFragment
  )>> }
);

export type PromotorQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PromotorQuery = (
  { __typename?: 'Query' }
  & { promotor: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'userType' | 'activePromotions'>
    & { categories?: Maybe<Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'name'>
    )>>, socialMedia?: Maybe<Array<(
      { __typename?: 'SocialMedia' }
      & Pick<SocialMedia, 'link' | 'social_media'>
    )>>, promotes?: Maybe<Array<(
      { __typename?: 'Product' }
      & Pick<Product, 'id' | 'title'>
    )>> }
  ) }
);

export type PromotoresQueryVariables = Exact<{ [key: string]: never; }>;


export type PromotoresQuery = (
  { __typename?: 'Query' }
  & { promotores: Array<(
    { __typename?: 'User' }
    & PromotorUserFragment
  )> }
);

export type PromotoresByCategoryQueryVariables = Exact<{
  categoryName: Scalars['String'];
}>;


export type PromotoresByCategoryQuery = (
  { __typename?: 'Query' }
  & { promotoresByCategory?: Maybe<Array<(
    { __typename?: 'User' }
    & PromotorUserFragment
  )>> }
);

export type UserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'username' | 'userType'>
  ) }
);

export const ProductSnippetFragmentDoc = gql`
    fragment ProductSnippet on Product {
  id
  title
  points
  price
  textSnippet
  voteStatus
  creator {
    id
    username
  }
}
    `;
export const PromotorUserFragmentDoc = gql`
    fragment PromotorUser on User {
  id
  username
  userType
  influencerPoints
  influencerVoteStatus
  categories {
    name
  }
  socialMedia {
    link
    social_media
  }
}
    `;
export const RegularCategoryResponseFragmentDoc = gql`
    fragment RegularCategoryResponse on CategoryResponse {
  errors {
    field
    message
  }
  category {
    name
  }
}
    `;
export const RegularProductResponseFragmentDoc = gql`
    fragment RegularProductResponse on ProductResponse {
  errors {
    field
    message
  }
  product {
    id
    createdAt
    updatedAt
    title
    text
    points
    creatorId
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  userType
  savedProducts {
    id
  }
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const AddPictureDocument = gql`
    mutation AddPicture($picture: Upload!, $productId: Int!) {
  addPicture(picture: $picture, productId: $productId)
}
    `;
export type AddPictureMutationFn = Apollo.MutationFunction<AddPictureMutation, AddPictureMutationVariables>;

/**
 * __useAddPictureMutation__
 *
 * To run a mutation, you first call `useAddPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPictureMutation, { data, loading, error }] = useAddPictureMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useAddPictureMutation(baseOptions?: Apollo.MutationHookOptions<AddPictureMutation, AddPictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPictureMutation, AddPictureMutationVariables>(AddPictureDocument, options);
      }
export type AddPictureMutationHookResult = ReturnType<typeof useAddPictureMutation>;
export type AddPictureMutationResult = Apollo.MutationResult<AddPictureMutation>;
export type AddPictureMutationOptions = Apollo.BaseMutationOptions<AddPictureMutation, AddPictureMutationVariables>;
export const AddSocialMediaDocument = gql`
    mutation AddSocialMedia($social_media: String!, $link: String!) {
  addSocialMedia(social_media: $social_media, link: $link)
}
    `;
export type AddSocialMediaMutationFn = Apollo.MutationFunction<AddSocialMediaMutation, AddSocialMediaMutationVariables>;

/**
 * __useAddSocialMediaMutation__
 *
 * To run a mutation, you first call `useAddSocialMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSocialMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSocialMediaMutation, { data, loading, error }] = useAddSocialMediaMutation({
 *   variables: {
 *      social_media: // value for 'social_media'
 *      link: // value for 'link'
 *   },
 * });
 */
export function useAddSocialMediaMutation(baseOptions?: Apollo.MutationHookOptions<AddSocialMediaMutation, AddSocialMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSocialMediaMutation, AddSocialMediaMutationVariables>(AddSocialMediaDocument, options);
      }
export type AddSocialMediaMutationHookResult = ReturnType<typeof useAddSocialMediaMutation>;
export type AddSocialMediaMutationResult = Apollo.MutationResult<AddSocialMediaMutation>;
export type AddSocialMediaMutationOptions = Apollo.BaseMutationOptions<AddSocialMediaMutation, AddSocialMediaMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ChooseCategories4PromotorDocument = gql`
    mutation ChooseCategories4Promotor($id: Int!, $categories: [String!]!) {
  chooseCategories4Promotor(id: $id, categories: $categories) {
    errors {
      field
      message
    }
    user {
      id
      username
      userType
      categories {
        name
      }
    }
  }
}
    `;
export type ChooseCategories4PromotorMutationFn = Apollo.MutationFunction<ChooseCategories4PromotorMutation, ChooseCategories4PromotorMutationVariables>;

/**
 * __useChooseCategories4PromotorMutation__
 *
 * To run a mutation, you first call `useChooseCategories4PromotorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChooseCategories4PromotorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chooseCategories4PromotorMutation, { data, loading, error }] = useChooseCategories4PromotorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      categories: // value for 'categories'
 *   },
 * });
 */
export function useChooseCategories4PromotorMutation(baseOptions?: Apollo.MutationHookOptions<ChooseCategories4PromotorMutation, ChooseCategories4PromotorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChooseCategories4PromotorMutation, ChooseCategories4PromotorMutationVariables>(ChooseCategories4PromotorDocument, options);
      }
export type ChooseCategories4PromotorMutationHookResult = ReturnType<typeof useChooseCategories4PromotorMutation>;
export type ChooseCategories4PromotorMutationResult = Apollo.MutationResult<ChooseCategories4PromotorMutation>;
export type ChooseCategories4PromotorMutationOptions = Apollo.BaseMutationOptions<ChooseCategories4PromotorMutation, ChooseCategories4PromotorMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    ...RegularCategoryResponse
  }
}
    ${RegularCategoryResponseFragmentDoc}`;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    ...RegularProductResponse
  }
}
    ${RegularProductResponseFragmentDoc}`;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const CreatePromotionDocument = gql`
    mutation CreatePromotion($productId: Int!) {
  createPromotion(productId: $productId)
}
    `;
export type CreatePromotionMutationFn = Apollo.MutationFunction<CreatePromotionMutation, CreatePromotionMutationVariables>;

/**
 * __useCreatePromotionMutation__
 *
 * To run a mutation, you first call `useCreatePromotionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePromotionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPromotionMutation, { data, loading, error }] = useCreatePromotionMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useCreatePromotionMutation(baseOptions?: Apollo.MutationHookOptions<CreatePromotionMutation, CreatePromotionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePromotionMutation, CreatePromotionMutationVariables>(CreatePromotionDocument, options);
      }
export type CreatePromotionMutationHookResult = ReturnType<typeof useCreatePromotionMutation>;
export type CreatePromotionMutationResult = Apollo.MutationResult<CreatePromotionMutation>;
export type CreatePromotionMutationOptions = Apollo.BaseMutationOptions<CreatePromotionMutation, CreatePromotionMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const DeletePromotionDocument = gql`
    mutation DeletePromotion($productId: Int!) {
  deletePromotion(productId: $productId)
}
    `;
export type DeletePromotionMutationFn = Apollo.MutationFunction<DeletePromotionMutation, DeletePromotionMutationVariables>;

/**
 * __useDeletePromotionMutation__
 *
 * To run a mutation, you first call `useDeletePromotionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePromotionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePromotionMutation, { data, loading, error }] = useDeletePromotionMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useDeletePromotionMutation(baseOptions?: Apollo.MutationHookOptions<DeletePromotionMutation, DeletePromotionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePromotionMutation, DeletePromotionMutationVariables>(DeletePromotionDocument, options);
      }
export type DeletePromotionMutationHookResult = ReturnType<typeof useDeletePromotionMutation>;
export type DeletePromotionMutationResult = Apollo.MutationResult<DeletePromotionMutation>;
export type DeletePromotionMutationOptions = Apollo.BaseMutationOptions<DeletePromotionMutation, DeletePromotionMutationVariables>;
export const DeleteSocialMediaDocument = gql`
    mutation DeleteSocialMedia($link: String!) {
  deleteSocialMedia(link: $link)
}
    `;
export type DeleteSocialMediaMutationFn = Apollo.MutationFunction<DeleteSocialMediaMutation, DeleteSocialMediaMutationVariables>;

/**
 * __useDeleteSocialMediaMutation__
 *
 * To run a mutation, you first call `useDeleteSocialMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSocialMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSocialMediaMutation, { data, loading, error }] = useDeleteSocialMediaMutation({
 *   variables: {
 *      link: // value for 'link'
 *   },
 * });
 */
export function useDeleteSocialMediaMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSocialMediaMutation, DeleteSocialMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSocialMediaMutation, DeleteSocialMediaMutationVariables>(DeleteSocialMediaDocument, options);
      }
export type DeleteSocialMediaMutationHookResult = ReturnType<typeof useDeleteSocialMediaMutation>;
export type DeleteSocialMediaMutationResult = Apollo.MutationResult<DeleteSocialMediaMutation>;
export type DeleteSocialMediaMutationOptions = Apollo.BaseMutationOptions<DeleteSocialMediaMutation, DeleteSocialMediaMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!, $socialMedia: String!, $token: String!) {
  login(
    usernameOrEmail: $usernameOrEmail
    password: $password
    socialMedia: $socialMedia
    token: $token
  ) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *      socialMedia: // value for 'socialMedia'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SaveProductDocument = gql`
    mutation SaveProduct($productId: Int!) {
  saveProduct(productId: $productId)
}
    `;
export type SaveProductMutationFn = Apollo.MutationFunction<SaveProductMutation, SaveProductMutationVariables>;

/**
 * __useSaveProductMutation__
 *
 * To run a mutation, you first call `useSaveProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveProductMutation, { data, loading, error }] = useSaveProductMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useSaveProductMutation(baseOptions?: Apollo.MutationHookOptions<SaveProductMutation, SaveProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveProductMutation, SaveProductMutationVariables>(SaveProductDocument, options);
      }
export type SaveProductMutationHookResult = ReturnType<typeof useSaveProductMutation>;
export type SaveProductMutationResult = Apollo.MutationResult<SaveProductMutation>;
export type SaveProductMutationOptions = Apollo.BaseMutationOptions<SaveProductMutation, SaveProductMutationVariables>;
export const UnSaveProductDocument = gql`
    mutation UnSaveProduct($productId: Int!) {
  unSaveProduct(productId: $productId)
}
    `;
export type UnSaveProductMutationFn = Apollo.MutationFunction<UnSaveProductMutation, UnSaveProductMutationVariables>;

/**
 * __useUnSaveProductMutation__
 *
 * To run a mutation, you first call `useUnSaveProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnSaveProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unSaveProductMutation, { data, loading, error }] = useUnSaveProductMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useUnSaveProductMutation(baseOptions?: Apollo.MutationHookOptions<UnSaveProductMutation, UnSaveProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnSaveProductMutation, UnSaveProductMutationVariables>(UnSaveProductDocument, options);
      }
export type UnSaveProductMutationHookResult = ReturnType<typeof useUnSaveProductMutation>;
export type UnSaveProductMutationResult = Apollo.MutationResult<UnSaveProductMutation>;
export type UnSaveProductMutationOptions = Apollo.BaseMutationOptions<UnSaveProductMutation, UnSaveProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($productId: Int!, $input: ProductInput!) {
  updateProduct(productId: $productId, input: $input) {
    ...RegularProductResponse
  }
}
    ${RegularProductResponseFragmentDoc}`;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($value: Int!, $productId: Int!) {
  vote(value: $value, productId: $productId)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      value: // value for 'value'
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const VotePromotorDocument = gql`
    mutation VotePromotor($value: Int!, $promotorId: Int!) {
  votePromotor(value: $value, promotorId: $promotorId)
}
    `;
export type VotePromotorMutationFn = Apollo.MutationFunction<VotePromotorMutation, VotePromotorMutationVariables>;

/**
 * __useVotePromotorMutation__
 *
 * To run a mutation, you first call `useVotePromotorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVotePromotorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [votePromotorMutation, { data, loading, error }] = useVotePromotorMutation({
 *   variables: {
 *      value: // value for 'value'
 *      promotorId: // value for 'promotorId'
 *   },
 * });
 */
export function useVotePromotorMutation(baseOptions?: Apollo.MutationHookOptions<VotePromotorMutation, VotePromotorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VotePromotorMutation, VotePromotorMutationVariables>(VotePromotorDocument, options);
      }
export type VotePromotorMutationHookResult = ReturnType<typeof useVotePromotorMutation>;
export type VotePromotorMutationResult = Apollo.MutationResult<VotePromotorMutation>;
export type VotePromotorMutationOptions = Apollo.BaseMutationOptions<VotePromotorMutation, VotePromotorMutationVariables>;
export const SavedProductsDocument = gql`
    query SavedProducts {
  savedProducts {
    savedProducts {
      id
      createdAt
      updatedAt
      title
      points
      text
      voteStatus
      creator {
        id
        username
      }
      categories {
        categoryName
      }
      promotors {
        id
        username
      }
    }
  }
}
    `;

/**
 * __useSavedProductsQuery__
 *
 * To run a query within a React component, call `useSavedProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSavedProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSavedProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSavedProductsQuery(baseOptions?: Apollo.QueryHookOptions<SavedProductsQuery, SavedProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SavedProductsQuery, SavedProductsQueryVariables>(SavedProductsDocument, options);
      }
export function useSavedProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SavedProductsQuery, SavedProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SavedProductsQuery, SavedProductsQueryVariables>(SavedProductsDocument, options);
        }
export type SavedProductsQueryHookResult = ReturnType<typeof useSavedProductsQuery>;
export type SavedProductsLazyQueryHookResult = ReturnType<typeof useSavedProductsLazyQuery>;
export type SavedProductsQueryResult = Apollo.QueryResult<SavedProductsQuery, SavedProductsQueryVariables>;
export const CategoryDocument = gql`
    query Category {
  allCategories {
    name
  }
}
    `;

/**
 * __useCategoryQuery__
 *
 * To run a query within a React component, call `useCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoryQuery(baseOptions?: Apollo.QueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
      }
export function useCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
        }
export type CategoryQueryHookResult = ReturnType<typeof useCategoryQuery>;
export type CategoryLazyQueryHookResult = ReturnType<typeof useCategoryLazyQuery>;
export type CategoryQueryResult = Apollo.QueryResult<CategoryQuery, CategoryQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MySavedProductsDocument = gql`
    query mySavedProducts {
  savedProducts {
    savedProducts {
      id
    }
  }
}
    `;

/**
 * __useMySavedProductsQuery__
 *
 * To run a query within a React component, call `useMySavedProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySavedProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySavedProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySavedProductsQuery(baseOptions?: Apollo.QueryHookOptions<MySavedProductsQuery, MySavedProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MySavedProductsQuery, MySavedProductsQueryVariables>(MySavedProductsDocument, options);
      }
export function useMySavedProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySavedProductsQuery, MySavedProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MySavedProductsQuery, MySavedProductsQueryVariables>(MySavedProductsDocument, options);
        }
export type MySavedProductsQueryHookResult = ReturnType<typeof useMySavedProductsQuery>;
export type MySavedProductsLazyQueryHookResult = ReturnType<typeof useMySavedProductsLazyQuery>;
export type MySavedProductsQueryResult = Apollo.QueryResult<MySavedProductsQuery, MySavedProductsQueryVariables>;
export const ProductDocument = gql`
    query Product($id: Int!) {
  product(id: $id) {
    id
    createdAt
    updatedAt
    title
    points
    price
    quantity
    text
    voteStatus
    creator {
      id
      username
    }
    categories {
      categoryName
    }
    promotors {
      id
      username
    }
  }
}
    `;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductQuery(baseOptions: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
      }
export function useProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductQueryResult = Apollo.QueryResult<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = gql`
    query Products($limit: Int!, $cursor: String) {
  products(limit: $limit, cursor: $cursor) {
    hasMore
    products {
      ...ProductSnippet
    }
  }
}
    ${ProductSnippetFragmentDoc}`;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useProductsQuery(baseOptions: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const ProductsByCategoryDocument = gql`
    query ProductsByCategory($categoryName: String!) {
  productsByCategory(categoryName: $categoryName) {
    ...ProductSnippet
  }
}
    ${ProductSnippetFragmentDoc}`;

/**
 * __useProductsByCategoryQuery__
 *
 * To run a query within a React component, call `useProductsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsByCategoryQuery({
 *   variables: {
 *      categoryName: // value for 'categoryName'
 *   },
 * });
 */
export function useProductsByCategoryQuery(baseOptions: Apollo.QueryHookOptions<ProductsByCategoryQuery, ProductsByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsByCategoryQuery, ProductsByCategoryQueryVariables>(ProductsByCategoryDocument, options);
      }
export function useProductsByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsByCategoryQuery, ProductsByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsByCategoryQuery, ProductsByCategoryQueryVariables>(ProductsByCategoryDocument, options);
        }
export type ProductsByCategoryQueryHookResult = ReturnType<typeof useProductsByCategoryQuery>;
export type ProductsByCategoryLazyQueryHookResult = ReturnType<typeof useProductsByCategoryLazyQuery>;
export type ProductsByCategoryQueryResult = Apollo.QueryResult<ProductsByCategoryQuery, ProductsByCategoryQueryVariables>;
export const PromotorDocument = gql`
    query Promotor($id: Int!) {
  promotor(id: $id) {
    id
    username
    userType
    categories {
      name
    }
    socialMedia {
      link
      social_media
    }
    promotes {
      id
      title
    }
    activePromotions
  }
}
    `;

/**
 * __usePromotorQuery__
 *
 * To run a query within a React component, call `usePromotorQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePromotorQuery(baseOptions: Apollo.QueryHookOptions<PromotorQuery, PromotorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PromotorQuery, PromotorQueryVariables>(PromotorDocument, options);
      }
export function usePromotorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PromotorQuery, PromotorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PromotorQuery, PromotorQueryVariables>(PromotorDocument, options);
        }
export type PromotorQueryHookResult = ReturnType<typeof usePromotorQuery>;
export type PromotorLazyQueryHookResult = ReturnType<typeof usePromotorLazyQuery>;
export type PromotorQueryResult = Apollo.QueryResult<PromotorQuery, PromotorQueryVariables>;
export const PromotoresDocument = gql`
    query Promotores {
  promotores {
    ...PromotorUser
  }
}
    ${PromotorUserFragmentDoc}`;

/**
 * __usePromotoresQuery__
 *
 * To run a query within a React component, call `usePromotoresQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotoresQuery({
 *   variables: {
 *   },
 * });
 */
export function usePromotoresQuery(baseOptions?: Apollo.QueryHookOptions<PromotoresQuery, PromotoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PromotoresQuery, PromotoresQueryVariables>(PromotoresDocument, options);
      }
export function usePromotoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PromotoresQuery, PromotoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PromotoresQuery, PromotoresQueryVariables>(PromotoresDocument, options);
        }
export type PromotoresQueryHookResult = ReturnType<typeof usePromotoresQuery>;
export type PromotoresLazyQueryHookResult = ReturnType<typeof usePromotoresLazyQuery>;
export type PromotoresQueryResult = Apollo.QueryResult<PromotoresQuery, PromotoresQueryVariables>;
export const PromotoresByCategoryDocument = gql`
    query PromotoresByCategory($categoryName: String!) {
  promotoresByCategory(categoryName: $categoryName) {
    ...PromotorUser
  }
}
    ${PromotorUserFragmentDoc}`;

/**
 * __usePromotoresByCategoryQuery__
 *
 * To run a query within a React component, call `usePromotoresByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotoresByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotoresByCategoryQuery({
 *   variables: {
 *      categoryName: // value for 'categoryName'
 *   },
 * });
 */
export function usePromotoresByCategoryQuery(baseOptions: Apollo.QueryHookOptions<PromotoresByCategoryQuery, PromotoresByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PromotoresByCategoryQuery, PromotoresByCategoryQueryVariables>(PromotoresByCategoryDocument, options);
      }
export function usePromotoresByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PromotoresByCategoryQuery, PromotoresByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PromotoresByCategoryQuery, PromotoresByCategoryQueryVariables>(PromotoresByCategoryDocument, options);
        }
export type PromotoresByCategoryQueryHookResult = ReturnType<typeof usePromotoresByCategoryQuery>;
export type PromotoresByCategoryLazyQueryHookResult = ReturnType<typeof usePromotoresByCategoryLazyQuery>;
export type PromotoresByCategoryQueryResult = Apollo.QueryResult<PromotoresByCategoryQuery, PromotoresByCategoryQueryVariables>;
export const UserDocument = gql`
    query User($userId: Int!) {
  user(userId: $userId) {
    username
    userType
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;