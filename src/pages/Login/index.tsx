import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClientMutation } from "@mysten/dapp-kit";
import { Button } from 'antd';
import { useEffect, useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { suiClient } from "@/utils/sui";
import {
    INIT_GAME,
    WZQ_GAME_INFOS,
    JOIN_GAME,
    PLAY_GAME,
} from "@/utils/constants";
import { useTitle } from "@/utils/func";


const Login = () => {
    useTitle("Login")
    const currentAccount = useCurrentAccount();
    const [walletAddr, setWalletAddr] = useState('')
    const { mutateAsync: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock()
    const { mutateAsync: waitForTransactionBlock } = useSuiClientMutation('waitForTransactionBlock')

    useEffect(() => {
        if (currentAccount) {
            setWalletAddr(currentAccount.address)
        }
    }, [currentAccount])

    const initGame = async () => {
        // 拿到所有的 SUI coin
        let res = await suiClient.getCoins({
            owner: walletAddr,
        })
        let sui_coins = res.data.map(obj => obj.coinObjectId)
        let coin_sui = sui_coins[0]
        console.log(coin_sui)

        const txb = new TransactionBlock();

        // txb.mergeCoins(txb.object(sui_coins[0]), [ txb.object(sui_coins[1]) ])

        txb.moveCall({
            arguments: [
                txb.object(WZQ_GAME_INFOS),
                txb.object(coin_sui),
                txb.pure(500000000),  // 0.5 SUI
            ],
            target: INIT_GAME,
        });

        const tx = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
        })
        await waitForTransactionBlock({
            digest: tx.digest,
        })
    }

    const joinGame = async () => {
        // 拿到所有的 SUI coin
        let res = await suiClient.getCoins({
            owner: walletAddr,
        })
        let sui_coins = res.data.map(obj => obj.coinObjectId)
        let coin_sui = sui_coins[0]
        console.log(coin_sui)

        const txb = new TransactionBlock();

        // txb.mergeCoins(txb.object(sui_coins[0]), [ txb.object(sui_coins[1]) ])

        txb.moveCall({
            arguments: [
                txb.object(WZQ_GAME_INFOS),
                txb.pure.address('0x1551c0853e5b1dcce1e02b59a3b65ce815549b798adebb721e2f1cf0d7427b6d'),
                txb.object(coin_sui),
                txb.pure(500000000),  // 0.5 SUI , 合约已优化，暂未部署，必须传入一样的数值
            ],
            target: JOIN_GAME,
        });

        const tx = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
        })
        await waitForTransactionBlock({
            digest: tx.digest,
        })
    }

    const playGame = async () => {
        // 合约中规定每人轮流下棋
        // 每次下棋前，拿到链上当前棋局，显示在一旁，防止玩家作弊
        // 前端棋盘用本地数据渲染，链上棋盘缩小放右上角，用于实时对照
        let res = await suiClient.getObject({
            id: WZQ_GAME_INFOS,
        })
        // TODO: 怎么拿到链上棋盘数据
        // 可查看： https://suiscan.xyz/devnet/object/0x96fb37431f8ef4a7e778bb2652d01b92a356ed12b14dd53a905cd32c37f321e4
        console.log(res)

        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [
                txb.object(WZQ_GAME_INFOS),
                txb.pure.address('0x1551c0853e5b1dcce1e02b59a3b65ce815549b798adebb721e2f1cf0d7427b6d'),
                txb.pure.address('0xf2b6e76f00a8a1c9de435484254f33585870682fea82aa8727d7ed95268a5232'),
                // 在坐标 (1, 1) 处落子
                txb.pure(1),
                txb.pure(1),
            ],
            target: PLAY_GAME,
        });

        const tx = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
        })
        await waitForTransactionBlock({
            digest: tx.digest,
        })
        //     let nft_objs = await suiClient.getOwnedObjects({
        //         owner: walletAddr,
        //         options: { showType: true, showContent: true },
        //         filter: {StructType: NFT_OBJ_TYPE}
        //     })
        //     console.log(nft_objs.data.map(obj => obj.data?.content))
    }

    return (
        <div style={{backgroundColor:'#f3f0ff', height:'100vh'}}>
            <div className="pt-4 pr-4">
                <ConnectButton className=" text-red-300 bg-red-200" style={{backgroundColor:'yellowgreen'}} />
            </div>
            <div className="mt-16 flex justify-center">
                {currentAccount && <Button type="primary" size="large" onClick={initGame}>Init Game</Button>}
            </div>
            <div className="mt-16 flex justify-center">
                {currentAccount && <Button type="primary" size="large" onClick={joinGame}>Join Game</Button>}
            </div>
            <div className="mt-16 flex justify-center">
                {currentAccount && <Button type="primary" size="large" onClick={playGame}>Play Game</Button>}
            </div>
        </div>
    )
}

export default Login