import { generateApolloClient } from '@deep-foundation/hasura/client';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { LocalStoreProvider } from '@deep-foundation/store/local';
import { QueryStoreProvider } from '@deep-foundation/store/query';

export function ProviderConnected({
	children,
}: { children: any }) {
	const [token, setToken] = useTokenController();
	return <>{children}</>;
}

const GRAPHQL_PATH = process.env.NEXT_PUBLIC_GQL_PATH;
const GRAPHQL_SSL = !!+process.env.NEXT_PUBLIC_GQL_SSL;

export function Provider({ children }: { children: any }) {
	const rootClient = generateApolloClient({
		path: GRAPHQL_PATH,
		ssl: GRAPHQL_SSL,
		token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzgwIn0sImlhdCI6MTY5MDAzMTcwOX0.yQeqO_toByCmY9rlr0dbMyRiYrp0dw2c4S2BRHyY0is',
	})

	return (
		<QueryStoreProvider>
			<LocalStoreProvider>
				<TokenProvider>
					<ApolloClientTokenizedProvider
						options={{
							client: 'deeplinks-app',
							path: GRAPHQL_PATH,
							ssl: GRAPHQL_SSL,
							ws: !!process?.browser,
							token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzgwIn0sImlhdCI6MTY5MDAzMTcwOX0.yQeqO_toByCmY9rlr0dbMyRiYrp0dw2c4S2BRHyY0is',
						}}
					>
						<ProviderConnected>
							<DeepProvider apolloClient={rootClient}>{children}</DeepProvider>
						</ProviderConnected>
					</ApolloClientTokenizedProvider>
				</TokenProvider>
			</LocalStoreProvider>
		</QueryStoreProvider>
	);
}