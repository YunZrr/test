import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

const GetCoin = ({client, account, env}) => {
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