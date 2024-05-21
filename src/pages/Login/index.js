import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { Button } from 'antd';
import { useSelector } from "react-redux";
import './index.css'
import { useEffect, useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useDispatch } from "react-redux";


const AIRDROP_OBJ = '0x765dc322bed2fec830da868a6a701bfa13980676b51bb9ecb99f5d350b306187'
const TOPN_OBJ = '0xb29f446af3d60ab02df2793cc7fd6cf9a7ab9d2c9ae05a723338091a28c153f3'
const TOUCH_SUPPLY = '0x7976874edaef1f6c021ba9b390468bfdf55677f854d8ef97f439c948867cffd9'
const CLAIM_AIRDROP_FN = '0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch::claim_airdrop'
const CLAIM_TOPN_FN = '0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch::claim_topn'
// const COIN_TOUCH_TYPE = '0x2::coin::Coin<0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch::TOUCH>'
const COIN_TOUCH_TYPE = '0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch::TOUCH'

const CLAIM_NFT_FN = '0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch_level::claim'
const ELIGIBLE_OBJ = '0x85b343fe7a3896ec2feeecf023431f7150ff7c405efe5a4779867c1bd63617dd'
const NFT_OBJ_TYPE = '0x653fac157ea5fc2c2a825498e60e92a22a4d32af7c951a17d191b57e42f30cfc::touch_level::TouchProfile'

const Login = () => {
    // const account = useSelector(state => state.user.walletAddr)
    const currentAccount = useCurrentAccount();
    // const dispatch = useDispatch()
    // useEffect(async () => {
    //     let touchCoin = await suiClient.getBalance({
    //         owner: currentAccount.address,
    //         coinType: COIN_TOUCH_TYPE
    //     });
    //     setTouBalance((Number(touchCoin.totalBalance)/10**9).toFixed(2))
    // }, [currentAccount])
    const [touBalance, setTouBalance] = useState('0')
    const [imageUrlList, setImageUrlList] = useState([])
    const suiClient = useSuiClient();
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

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
                        let touchCoin = await suiClient.getBalance({
                            owner: currentAccount.address,
                            coinType: COIN_TOUCH_TYPE
                        });
                        // TODO: get coin decimal use the following sdk
                        // suiClient.getCoinMetadata()
                        setTouBalance((Number(touchCoin.totalBalance)/10**9).toFixed(2))
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
                    })
                }
            }
        )
    }

    return (
        <div style={{backgroundColor:'#f3f0ff', height:'100vh'}}>
            <div className="connect-btn">
                <div style={{padding: '15px 0 0 15px'}}>
                    {currentAccount && <div>{ `Balance: ${touBalance}` }</div>}
                </div>
                <ConnectButton className="btn1" />
            </div>
            <div className="btn2">
                {currentAccount && <Button type="primary" size="large" onClick={claimTouch}>Claim $TOU</Button>}
            </div>
            <div className="btn2">
                {currentAccount && <Button type="primary" size="large" onClick={claimNFT}>Claim TouchNFT</Button>}
            </div>
        </div>
    )
}

export default Login