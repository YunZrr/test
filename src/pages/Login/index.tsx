import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { Button } from 'antd';
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { suiClient, signer } from "@/utils/sui";
// import { useDispatch } from "react-redux";
import {
    COIN_TYPE, TOPN_OBJ, TOUCH_SUPPLY, CLAIM_TOPN_FN, VIRTUOSO_LV2, VIRTUOSO_LV3,
    AIRDROP_OBJ, CLAIM_AIRDROP_FN, NFT_OBJ_TYPE,
    MINT_TO,
    ADMIN_CAP,
    NFT_INFOS,
} from "@/utils/constants";
import { useTitle } from "@/utils/func";


const Login = () => {
    useTitle("Login")
    // const account = useSelector(state => state.user.walletAddr)
    const currentAccount = useCurrentAccount();
    const [walletAddr, setWalletAddr] = useState('')
    const [touBalance, setTouBalance] = useState('0')
    // TODO: image_url list replace imageUrl
    const [imageUrl, setImageUrl] = useState('')
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const getBalance = async () => {
        if (!currentAccount) return 
        setWalletAddr(currentAccount.address)
        const { totalBalance } = await suiClient.getBalance({
            owner: currentAccount.address,
            coinType: COIN_TYPE
        });
        return totalBalance
    }

    const getDecimal = async () => {
        const res = await suiClient.getCoinMetadata({
            coinType: COIN_TYPE
        });
        if (res) return res.decimals;
    }

    useEffect(() => {
        setTouBalance('0'); // TODO: switch wallet 
        const setBalance = async () => {
            const totalBalance = await getBalance();
            const decimal = await getDecimal()
            if (decimal) {
                setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(0))
            }
        }
        setBalance();
    }, [currentAccount])

    const claimTouch = () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            // arguments: [txb.object(TOPN_OBJ), txb.object(TOUCH_SUPPLY)],
            // target: CLAIM_TOPN_FN,
            arguments: [txb.object(AIRDROP_OBJ), txb.object(TOUCH_SUPPLY)],
            target: CLAIM_AIRDROP_FN,
        });

        signAndExecuteTransactionBlock(
            {
                transactionBlock: txb,
                options: { showEffects: true },
            },
            {
                onSuccess: (tx) => {
                    suiClient.waitForTransactionBlock({
                        digest: tx.digest
                    }).then(async () => {
                        const totalBalance = await getBalance();
                        const decimal = await getDecimal()
                        if (decimal) {
                            setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(0))
                        }
                    })
                }
            }
        )
    }

    const getNFT = async () => {
        const txb = new TransactionBlock();

        const nft = NFT_INFOS.filter(item => 
            item.personality == 'Virtuoso' && item.level == '2'
        )
        console.log(nft)
        txb.moveCall({
            arguments: [
                txb.object(ADMIN_CAP),
                txb.pure.string(nft[0].fame),
                txb.pure.string(nft[0].personality),
                txb.pure.u8(Number(nft[0].level)),
                txb.pure.string(nft[0].desc),
                txb.pure.string(nft[0].url.slice(0, nft[0].url.lastIndexOf('/'))),
                txb.pure.address(walletAddr)
            ],
            target: MINT_TO 
        });

        const txRes = await suiClient.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: txb,
        })
        if (txRes) {
            console.log(txRes)
            setImageUrl(nft[0].url)
            let nft_objs = await suiClient.getOwnedObjects({
                owner: walletAddr,
                options: { showType: true, showContent: true },
                filter: {StructType: NFT_OBJ_TYPE}
            })
            console.log(nft_objs.data.map(obj => obj.data?.content))
        }
    }

    const upgradeNFT = async () => {
        // TODO: get current NFT info and call move function to upgrade NFT
        setImageUrl(VIRTUOSO_LV3)
    }

    return (
        <div style={{backgroundColor:'#f3f0ff', height:'100vh'}}>
            <div className=" flex justify-between pt-4 pr-4">
                <div style={{padding: '15px 0 0 15px'}}>
                    {
                        currentAccount &&
                        <div className=" flex justify-center items-center">
                            <img width={'30px'} src="https://ipfs.io/ipfs/bafybeig7cm6xn2p3wy6yw4do4o7edg5ikm77yyc3jr3tnpddonsxfnkxki/touch.png" />
                            <div style={{marginLeft: '5px'}}>
                                {`Touch: ${touBalance}`}
                            </div>
                        </div>
                    }
                </div>
                {/* // TODO: tailwind cannot use here? */}
                <ConnectButton className=" text-red-300 bg-red-200" style={{backgroundColor:'yellowgreen'}} />
            </div>
            <div className="mt-16 flex justify-center">
                {currentAccount && <Button type="primary" size="large" onClick={claimTouch}>Claim $TOU</Button>}
            </div>
            <div className="mt-16 flex justify-center">
                {currentAccount && <Button type="primary" size="large" onClick={getNFT}>Get NFT</Button>}
            </div>
            {
                currentAccount &&
                <div className="mt-16">
                    <img src={imageUrl} />
                    <div className="mt-16 flex justify-center">
                        {imageUrl && <Button type="primary" size="large" onClick={upgradeNFT}>Upgrade To Lv.3</Button>}
                    </div>
                </div>
            }
        </div>
    )
}

export default Login