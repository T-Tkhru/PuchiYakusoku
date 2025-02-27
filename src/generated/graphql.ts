import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
};

export type CreatePromiseInput = {
  content: Scalars['String']['input'];
  direction: Scalars['Boolean']['input'];
  dueDate: Scalars['String']['input'];
  level: Level;
};

export type CreateUserInput = {
  displayName: Scalars['String']['input'];
  pictureUrl: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export enum Level {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptPromise?: Maybe<Promise>;
  completePromise?: Maybe<Promise>;
  createPromise?: Maybe<Promise>;
  createUser?: Maybe<User>;
  rejectPromise?: Maybe<Promise>;
};


export type MutationAcceptPromiseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompletePromiseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreatePromiseArgs = {
  input: CreatePromiseInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationRejectPromiseArgs = {
  id: Scalars['ID']['input'];
};

export type Promise = {
  __typename?: 'Promise';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  content: Scalars['String']['output'];
  direction: Scalars['Boolean']['output'];
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isAccepted?: Maybe<Scalars['Boolean']['output']>;
  level: Level;
  receiver?: Maybe<User>;
  sender: User;
};

export type Query = {
  __typename?: 'Query';
  promise?: Maybe<Promise>;
  promises?: Maybe<Array<Promise>>;
  receivedPromises?: Maybe<Array<Promise>>;
  sentPromises?: Maybe<Array<Promise>>;
  userByUserId?: Maybe<User>;
};


export type QueryPromiseArgs = {
  id: Scalars['String']['input'];
};


export type QueryReceivedPromisesArgs = {
  receiverId: Scalars['String']['input'];
};


export type QuerySentPromisesArgs = {
  senderId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pictureUrl?: Maybe<Scalars['String']['output']>;
  receivedPromises?: Maybe<Array<Promise>>;
  sentPromises?: Maybe<Array<Promise>>;
  userId: Scalars['String']['output'];
};

export type GetUserByUserIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserByUserIdQuery = { __typename?: 'Query', userByUserId?: { __typename?: 'User', id: string, userId: string, displayName: string, pictureUrl?: string | null } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, userId: string, displayName: string, pictureUrl?: string | null } | null };

export type GetPromisesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPromisesQuery = { __typename?: 'Query', promises?: Array<{ __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, direction: boolean, isAccepted?: boolean | null, completedAt?: string | null, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null }, receiver?: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } | null }> | null };

export type GetPromiseQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPromiseQuery = { __typename?: 'Query', promise?: { __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, direction: boolean, isAccepted?: boolean | null, completedAt?: string | null, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null }, receiver?: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } | null } | null };

export type CreatePromiseMutationVariables = Exact<{
  input: CreatePromiseInput;
}>;


export type CreatePromiseMutation = { __typename?: 'Mutation', createPromise?: { __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null }, receiver?: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } | null } | null };

export type AcceptPromiseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AcceptPromiseMutation = { __typename?: 'Mutation', acceptPromise?: { __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, direction: boolean, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null }, receiver?: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } | null } | null };

export type RejectPromiseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RejectPromiseMutation = { __typename?: 'Mutation', rejectPromise?: { __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, direction: boolean, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } } | null };

export type CompletePromiseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompletePromiseMutation = { __typename?: 'Mutation', completePromise?: { __typename?: 'Promise', id: string, content: string, level: Level, dueDate: string, direction: boolean, sender: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null }, receiver?: { __typename?: 'User', id: string, displayName: string, pictureUrl?: string | null } | null } | null };


export const GetUserByUserIdDocument = gql`
    query GetUserByUserId {
  userByUserId {
    id
    userId
    displayName
    pictureUrl
  }
}
    `;

/**
 * __useGetUserByUserIdQuery__
 *
 * To run a query within a React component, call `useGetUserByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByUserIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserByUserIdQuery(baseOptions?: Apollo.QueryHookOptions<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>(GetUserByUserIdDocument, options);
      }
export function useGetUserByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>(GetUserByUserIdDocument, options);
        }
export function useGetUserByUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>(GetUserByUserIdDocument, options);
        }
export type GetUserByUserIdQueryHookResult = ReturnType<typeof useGetUserByUserIdQuery>;
export type GetUserByUserIdLazyQueryHookResult = ReturnType<typeof useGetUserByUserIdLazyQuery>;
export type GetUserByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByUserIdSuspenseQuery>;
export type GetUserByUserIdQueryResult = Apollo.QueryResult<GetUserByUserIdQuery, GetUserByUserIdQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    userId
    displayName
    pictureUrl
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const GetPromisesDocument = gql`
    query GetPromises {
  promises {
    id
    content
    level
    dueDate
    direction
    sender {
      id
      displayName
      pictureUrl
    }
    receiver {
      id
      displayName
      pictureUrl
    }
    isAccepted
    completedAt
  }
}
    `;

/**
 * __useGetPromisesQuery__
 *
 * To run a query within a React component, call `useGetPromisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPromisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPromisesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPromisesQuery(baseOptions?: Apollo.QueryHookOptions<GetPromisesQuery, GetPromisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPromisesQuery, GetPromisesQueryVariables>(GetPromisesDocument, options);
      }
export function useGetPromisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPromisesQuery, GetPromisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPromisesQuery, GetPromisesQueryVariables>(GetPromisesDocument, options);
        }
export function useGetPromisesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPromisesQuery, GetPromisesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPromisesQuery, GetPromisesQueryVariables>(GetPromisesDocument, options);
        }
export type GetPromisesQueryHookResult = ReturnType<typeof useGetPromisesQuery>;
export type GetPromisesLazyQueryHookResult = ReturnType<typeof useGetPromisesLazyQuery>;
export type GetPromisesSuspenseQueryHookResult = ReturnType<typeof useGetPromisesSuspenseQuery>;
export type GetPromisesQueryResult = Apollo.QueryResult<GetPromisesQuery, GetPromisesQueryVariables>;
export const GetPromiseDocument = gql`
    query GetPromise($id: String!) {
  promise(id: $id) {
    id
    content
    level
    dueDate
    direction
    sender {
      id
      displayName
      pictureUrl
    }
    receiver {
      id
      displayName
      pictureUrl
    }
    isAccepted
    completedAt
  }
}
    `;

/**
 * __useGetPromiseQuery__
 *
 * To run a query within a React component, call `useGetPromiseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPromiseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPromiseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPromiseQuery(baseOptions: Apollo.QueryHookOptions<GetPromiseQuery, GetPromiseQueryVariables> & ({ variables: GetPromiseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPromiseQuery, GetPromiseQueryVariables>(GetPromiseDocument, options);
      }
export function useGetPromiseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPromiseQuery, GetPromiseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPromiseQuery, GetPromiseQueryVariables>(GetPromiseDocument, options);
        }
export function useGetPromiseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPromiseQuery, GetPromiseQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPromiseQuery, GetPromiseQueryVariables>(GetPromiseDocument, options);
        }
export type GetPromiseQueryHookResult = ReturnType<typeof useGetPromiseQuery>;
export type GetPromiseLazyQueryHookResult = ReturnType<typeof useGetPromiseLazyQuery>;
export type GetPromiseSuspenseQueryHookResult = ReturnType<typeof useGetPromiseSuspenseQuery>;
export type GetPromiseQueryResult = Apollo.QueryResult<GetPromiseQuery, GetPromiseQueryVariables>;
export const CreatePromiseDocument = gql`
    mutation CreatePromise($input: CreatePromiseInput!) {
  createPromise(input: $input) {
    id
    content
    level
    dueDate
    sender {
      id
      displayName
      pictureUrl
    }
    receiver {
      id
      displayName
      pictureUrl
    }
  }
}
    `;
export type CreatePromiseMutationFn = Apollo.MutationFunction<CreatePromiseMutation, CreatePromiseMutationVariables>;

/**
 * __useCreatePromiseMutation__
 *
 * To run a mutation, you first call `useCreatePromiseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePromiseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPromiseMutation, { data, loading, error }] = useCreatePromiseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePromiseMutation(baseOptions?: Apollo.MutationHookOptions<CreatePromiseMutation, CreatePromiseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePromiseMutation, CreatePromiseMutationVariables>(CreatePromiseDocument, options);
      }
export type CreatePromiseMutationHookResult = ReturnType<typeof useCreatePromiseMutation>;
export type CreatePromiseMutationResult = Apollo.MutationResult<CreatePromiseMutation>;
export type CreatePromiseMutationOptions = Apollo.BaseMutationOptions<CreatePromiseMutation, CreatePromiseMutationVariables>;
export const AcceptPromiseDocument = gql`
    mutation AcceptPromise($id: ID!) {
  acceptPromise(id: $id) {
    id
    content
    level
    dueDate
    direction
    sender {
      id
      displayName
      pictureUrl
    }
    receiver {
      id
      displayName
      pictureUrl
    }
  }
}
    `;
export type AcceptPromiseMutationFn = Apollo.MutationFunction<AcceptPromiseMutation, AcceptPromiseMutationVariables>;

/**
 * __useAcceptPromiseMutation__
 *
 * To run a mutation, you first call `useAcceptPromiseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptPromiseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptPromiseMutation, { data, loading, error }] = useAcceptPromiseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptPromiseMutation(baseOptions?: Apollo.MutationHookOptions<AcceptPromiseMutation, AcceptPromiseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptPromiseMutation, AcceptPromiseMutationVariables>(AcceptPromiseDocument, options);
      }
export type AcceptPromiseMutationHookResult = ReturnType<typeof useAcceptPromiseMutation>;
export type AcceptPromiseMutationResult = Apollo.MutationResult<AcceptPromiseMutation>;
export type AcceptPromiseMutationOptions = Apollo.BaseMutationOptions<AcceptPromiseMutation, AcceptPromiseMutationVariables>;
export const RejectPromiseDocument = gql`
    mutation RejectPromise($id: ID!) {
  rejectPromise(id: $id) {
    id
    content
    level
    dueDate
    direction
    sender {
      id
      displayName
      pictureUrl
    }
  }
}
    `;
export type RejectPromiseMutationFn = Apollo.MutationFunction<RejectPromiseMutation, RejectPromiseMutationVariables>;

/**
 * __useRejectPromiseMutation__
 *
 * To run a mutation, you first call `useRejectPromiseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectPromiseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectPromiseMutation, { data, loading, error }] = useRejectPromiseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectPromiseMutation(baseOptions?: Apollo.MutationHookOptions<RejectPromiseMutation, RejectPromiseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectPromiseMutation, RejectPromiseMutationVariables>(RejectPromiseDocument, options);
      }
export type RejectPromiseMutationHookResult = ReturnType<typeof useRejectPromiseMutation>;
export type RejectPromiseMutationResult = Apollo.MutationResult<RejectPromiseMutation>;
export type RejectPromiseMutationOptions = Apollo.BaseMutationOptions<RejectPromiseMutation, RejectPromiseMutationVariables>;
export const CompletePromiseDocument = gql`
    mutation CompletePromise($id: ID!) {
  completePromise(id: $id) {
    id
    content
    level
    dueDate
    direction
    sender {
      id
      displayName
      pictureUrl
    }
    receiver {
      id
      displayName
      pictureUrl
    }
  }
}
    `;
export type CompletePromiseMutationFn = Apollo.MutationFunction<CompletePromiseMutation, CompletePromiseMutationVariables>;

/**
 * __useCompletePromiseMutation__
 *
 * To run a mutation, you first call `useCompletePromiseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompletePromiseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completePromiseMutation, { data, loading, error }] = useCompletePromiseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompletePromiseMutation(baseOptions?: Apollo.MutationHookOptions<CompletePromiseMutation, CompletePromiseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompletePromiseMutation, CompletePromiseMutationVariables>(CompletePromiseDocument, options);
      }
export type CompletePromiseMutationHookResult = ReturnType<typeof useCompletePromiseMutation>;
export type CompletePromiseMutationResult = Apollo.MutationResult<CompletePromiseMutation>;
export type CompletePromiseMutationOptions = Apollo.BaseMutationOptions<CompletePromiseMutation, CompletePromiseMutationVariables>;