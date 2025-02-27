// import { ApolloClient, InMemoryCache } from "@apollo/client";

// export const client = new ApolloClient({
//   uri: "/api/graphql",
//   cache: new InMemoryCache(),
// });

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

// HTTPリンクを作成
const httpLink = createHttpLink({
  uri: "/api/graphql", // GraphQLエンドポイント
});

// リクエストにアクセストークンを追加するApollo Link
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("accessToken"); // ローカルストレージからアクセストークンを取得
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation); // 次のリンクに処理を渡す
});

// Apollo Clientのインスタンスを作成
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
