import { ConnectButton, useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { Button } from 'antd';
import { useSelector } from "react-redux";
import './index.css'
import { useEffect, useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useDispatch } from "react-redux";


const AIRDROP_OBJ = '0x92d6da8f322cb96f43b41172967e3411832b22689869a54b9a4b96ffc4a86a0f'
const TOPN_OBJ = '0x9a8a65cb31a83df2202abe21b3956f00d92a68ecbd144efa752164d3d14b7a66'
const TOUCH_SUPPLY = '0x0ad2091fe715651515c65a7f0f9d6fb52de53ebd99302dd1633a1dd78fb811a6'
const CLAIM_AIRDROP_FN = '0x59b94aaeaa16165fd4e6b384b1ab889790f5f6b01c02a3a1636ab811dfb8e5a1::touch::claim_airdrop'
const CLAIM_TOPN_FN = '0x59b94aaeaa16165fd4e6b384b1ab889790f5f6b01c02a3a1636ab811dfb8e5a1::touch::claim_topn'
const COIN_TYPE = '0x59b94aaeaa16165fd4e6b384b1ab889790f5f6b01c02a3a1636ab811dfb8e5a1::touch::TOUCH'

const CLAIM_NFT_FN = '0x59b94aaeaa16165fd4e6b384b1ab889790f5f6b01c02a3a1636ab811dfb8e5a1::touch_level::claim'
const ELIGIBLE_OBJ = '0x4a341d8551eb2dedd0095c57e06a64bd4aa454e629beb48694040c65045a2cb1'
const NFT_OBJ_TYPE = '0x59b94aaeaa16165fd4e6b384b1ab889790f5f6b01c02a3a1636ab811dfb8e5a1::touch_level::TouchProfile'
const VIRTUOSO_LV2 = 'https://bafybeiekxx6cmiwkiajqjzu6o26dni4m7cpnjf66pdsuskzbpiaxagebvi.ipfs.cf-ipfs.com/Virtuoso-2-Daniel%20Craig.svg'
const VIRTUOSO_LV3 = 'https://bafybeiekxx6cmiwkiajqjzu6o26dni4m7cpnjf66pdsuskzbpiaxagebvi.ipfs.cf-ipfs.com/Virtuoso-3-Michael%20Jordan.svg'

const Login = () => {
    // const account = useSelector(state => state.user.walletAddr)
    const currentAccount = useCurrentAccount();
    const [open, setOpen] = useState(false);
    const [touBalance, setTouBalance] = useState('0')
    // TODO: image_url list replace imageUrl
    const [imageUrl, setImageUrl] = useState('')
    const suiClient = useSuiClient();
    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    const getBalance = async () => {
        const { totalBalance } = await suiClient.getBalance({
            owner: currentAccount.address,
            coinType: COIN_TYPE
        });
        return totalBalance
    }

    useEffect(() => {
        setTouBalance('0'); // TODO: switch wallet optimize
        const setBalance = async () => {
            if (!currentAccount) return
            const totalBalance = await getBalance();
            const decimal = await getDecimal()
            setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(2))
        }
        setBalance();
    }, [currentAccount])


    const getDecimal = async () => {
        const { decimals } = await suiClient.getCoinMetadata({
            coinType: COIN_TYPE
        });
        return decimals
    }
    const getBalanceOld = async () => {
        const { totalBalance } = await suiClient.getBalance({
            owner: currentAccount.address,
            coinType: COIN_TYPE
        });
        const decimal = await getDecimal()
        setTouBalance((Number(totalBalance)/10**decimal).toFixed(2))
    }

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
                        setTouBalance((Number(totalBalance) / 10 ** decimal).toFixed(2))
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
            <div className="connect-btn">
                <div style={{padding: '15px 0 0 15px'}}>
                    {
                        currentAccount &&
                        <div className="tou-bal">
                            <img width={'30px'} src="https://ipfs.io/ipfs/bafybeig7cm6xn2p3wy6yw4do4o7edg5ikm77yyc3jr3tnpddonsxfnkxki/touch.png" />
                            <div style={{marginLeft: '5px'}}>
                                {`Touch: ${touBalance}`}
                            </div>
                        </div>
                    }
                </div>
                <ConnectButton className="btn1" />
            </div>
            <div className="btn2">
                {currentAccount && <Button type="primary" size="large" onClick={claimTouch}>Claim $TOU</Button>}
            </div>
            <div className="btn2">
                {currentAccount && <Button type="primary" size="large" onClick={claimNFT}>Claim TouchNFT</Button>}
            </div>
            {
                currentAccount &&
                <div style={{marginTop: '60px'}}>
                    <img src={imageUrl} />
                    <div className="btn2">
                        {imageUrl && <Button type="primary" size="large" onClick={upgradeNFT}>Upgrade To Lv.3</Button>}
                    </div>
                </div>
            }
        </div>
    )
}

export default Login