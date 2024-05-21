import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { Button } from 'antd';
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { suiClient } from "@/utils/sui";
// import { useDispatch } from "react-redux";
import {
    COIN_TYPE, TOPN_OBJ, TOUCH_SUPPLY, CLAIM_TOPN_FN, CLAIM_NFT_FN,
    ELIGIBLE_OBJ, VIRTUOSO_LV2, VIRTUOSO_LV3,
    // AIRDROP_OBJ, CLAIM_AIRDROP_FN, NFT_OBJ_TYPE,
} from "@/utils/constants";


const Login = () => {
    // const account = useSelector(state => state.user.walletAddr)
    const currentAccount = useCurrentAccount();
    const [touBalance, setTouBalance] = useState('0')
    // TODO: image_url list replace imageUrl
    const [imageUrl, setImageUrl] = useState('')
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const getBalance = async () => {
        if (!currentAccount) return 
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
        setTouBalance('0'); // TODO: switch wallet optimize
        const setBalance = async () => {
            const totalBalance = await getBalance();
            const decimal = await getDecimal()
            if (decimal) {
                setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(2))
            }
        }
        setBalance();
    }, [currentAccount])

    const claimTouch = () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [txb.object(TOPN_OBJ), txb.object(TOUCH_SUPPLY)],
            target: CLAIM_TOPN_FN
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
                            setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(2))
                        }
                    })
                }
            }
        )
    }

    const claimNFT = () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [
                txb.object(ELIGIBLE_OBJ),
                txb.pure.string('Daniel Craig'),
                txb.pure.string('Virtuoso'),
                txb.pure.string('Bold and practical experimenters, masters of all kinds of tools.')
            ],
            target: CLAIM_NFT_FN
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
                        // TODO: get image url
                        // 根据规则得到image_url
                        setImageUrl(VIRTUOSO_LV2) 
                    })
                }
            }
        )
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
                {currentAccount && <Button type="primary" size="large" onClick={claimNFT}>Claim TouchNFT</Button>}
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