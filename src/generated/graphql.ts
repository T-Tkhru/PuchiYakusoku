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
  dueDate: Scalars['String']['input'];
  level: Level;
  receiverId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
};

export enum Level {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type Mutation = {
  __typename?: 'Mutation';
  createPromise?: Maybe<Promise>;
};


export type MutationCreatePromiseArgs = {
  input: CreatePromiseInput;
};

export type Promise = {
  __typename?: 'Promise';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  level?: Maybe<Level>;
  receiver?: Maybe<User>;
  sender?: Maybe<User>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Query = {
  __typename?: 'Query';
  promises?: Maybe<Array<Promise>>;
  receivedPromises?: Maybe<Array<Promise>>;
  sentPromises?: Maybe<Array<Promise>>;
};


export type QueryReceivedPromisesArgs = {
  receiverId: Scalars['String']['input'];
};


export type QuerySentPromisesArgs = {
  senderId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lineId?: Maybe<Scalars['String']['output']>;
  pictureUrl?: Maybe<Scalars['String']['output']>;
  receivedPromises?: Maybe<Array<Promise>>;
  sentPromises?: Maybe<Array<Promise>>;
};

export type GetPromisesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPromisesQuery = { __typename?: 'Query', promises?: Array<{ __typename?: 'Promise', id?: string | null, content?: string | null, level?: Level | null, dueDate?: string | null, sender?: { __typename?: 'User', id?: string | null, displayName?: string | null, pictureUrl?: string | null } | null, receiver?: { __typename?: 'User', id?: string | null, displayName?: string | null, pictureUrl?: string | null } | null }> | null };

export type CreatePromiseMutationVariables = Exact<{
  input: CreatePromiseInput;
}>;


export type CreatePromiseMutation = { __typename?: 'Mutation', createPromise?: { __typename?: 'Promise', id?: string | null, content?: string | null, level?: Level | null, dueDate?: string | null, sender?: { __typename?: 'User', id?: string | null, displayName?: string | null, pictureUrl?: string | null } | null, receiver?: { __typename?: 'User', id?: string | null, displayName?: string | null, pictureUrl?: string | null } | null } | null };


export const GetPromisesDocument = gql`
    query GetPromises {
  promises {
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