import ReactDOM from 'react-dom/client'
// TODO: class with conditional expression in tailwind
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'
import { Provider } from 'react-redux'
import store from './store/index.tsx'
// sui sdk
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';


// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	devnet: { url: getFullnodeUrl('devnet') },
	testnet: { url: getFullnodeUrl('testnet') },
});
const queryClient = new QueryClient();

// TODO: process not defined
// console.log(process.env.REACT_APP_DB_HOST)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork='devnet'>
            <WalletProvider>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
)
