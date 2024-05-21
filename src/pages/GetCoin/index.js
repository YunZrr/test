import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

// use getFullnodeUrl to define Devnet RPC location
const env = 'devnet';
const rpcUrl = getFullnodeUrl('devnet');
// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl });
const account = '0x1551c0853e5b1dcce1e02b59a3b65ce815549b798adebb721e2f1cf0d7427b6d'

const GetCoin = () => {
    const getToken = async () => {
        await requestSuiFromFaucetV0({
            host: getFaucetHost(env),
            recipient: account,
        })
    };
    const getCoins = async () => {
        let coins = await client.getAllCoins({
            owner: account,
        })
        console.log(coins)
    }

    const objectType = '0x2::coin::Coin<0x760adea6e304f4af43a16b6c997ae25337455f7c502b6826020a38ecebcf603f::touch::TOUCH>';
    const getOwnedObjects = async () => {
        let my_touch = await client.getOwnedObjects({
            owner: account,
            options: { showType: true, showContent: true },
            filter: {StructType: objectType}
        })
        console.log(my_touch.data.map(obj => obj.data.content.fields))
    }
    const getAllBalances = async () => {
        const bals = await client.getAllBalances({
            owner: account,
        })
        console.log(bals)
    }
    return (
        <div>
            <button onClick={getToken}>Get Faucet Token</button>
            <br />
            <button onClick={getCoins}>Get All Coins</button>
            <br />
            <button onClick={getOwnedObjects}>Get Touch Coin</button>
            <br />
            <button onClick={getAllBalances}>Get All Balances</button>
        </div>
    );
}

export default GetCoin