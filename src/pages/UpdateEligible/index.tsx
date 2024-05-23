import { Button } from "antd"
import {
    ACCOUNTS, ADMIN_CAP, AIRDROP_OBJ, CLEAR_AIRDROP_FN, COIN_VALUES, 
    TOPN_OBJ, UPDATE_AIRDROP_FN,
    UPDATE_TOPN_FN,
} from "@/utils/constants"
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { suiClient, signer } from "@/utils/sui"
import { useTitle } from "@/utils/func"


const UpdateEligible = () => {
    useTitle('Airdrop')
    const updateAirdrop = async () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [
                txb.object(ADMIN_CAP),
                txb.object(AIRDROP_OBJ),
                txb.pure(ACCOUNTS),
                txb.pure(COIN_VALUES),
            ],
            target: UPDATE_AIRDROP_FN 
        });

        const txRes = await suiClient.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: txb,
        })
        console.log(txRes)
    }
    const updateTopN = async () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [
                txb.object(ADMIN_CAP),
                txb.object(TOPN_OBJ),
                txb.pure(ACCOUNTS),
                txb.pure(COIN_VALUES),
            ],
            target: UPDATE_TOPN_FN 
        });

        const txRes = await suiClient.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: txb,
        })
        console.log(txRes)
    }
    const clearAirdrop = async () => {
        const txb = new TransactionBlock();
        txb.moveCall({
            arguments: [
                txb.object(ADMIN_CAP),
                txb.object(AIRDROP_OBJ),
            ],
            target: CLEAR_AIRDROP_FN
        });

        const txRes = await suiClient.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: txb,
        })
        console.log(txRes)
    }

    return (
        <div style={{backgroundColor:'#f3f0ff', height:'100vh'}}>
            <div className="pt-52 flex justify-center">
                <Button type="primary" size="large" onClick={updateAirdrop}>Set Airdrop List</Button>
            </div>
            <div className="mt-24 flex justify-center">
                <Button type="primary" size="large" onClick={updateTopN}>Set TopN Awards</Button>
            </div>
            <div className="mt-24 flex justify-center">
                <Button type="primary" size="large" onClick={clearAirdrop}>Clear Airdrop List</Button>
            </div>
        </div>
    )
}

export default UpdateEligible