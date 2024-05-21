import { Button } from "antd"
import { ACCOUNTS } from "@/utils/constants"


const UpdateEligible = () => {
    const updateTopN = async () => {
        // TODO: move call to update_topn
    }
    const updateAirdrop = async () => {
        // TODO: move call to update_topn
    }
    const updateEligibleAddrs = async () => {
        // TODO: move call to update_topn
    }

    return (
        <div style={{backgroundColor:'#f3f0ff', height:'100vh'}}>
            <div className="pt-52 flex justify-center">
                <Button type="primary" size="large" onClick={updateAirdrop}>Early Airdrop</Button>
            </div>
            <div className="mt-24 flex justify-center">
                <Button type="primary" size="large" onClick={updateTopN}>TopN Awards</Button>
            </div>
            <div className="mt-24 flex justify-center">
                <Button type="primary" size="large" onClick={updateEligibleAddrs}>NFT WhiteList</Button>
            </div>
        </div>
    )
}

export default UpdateEligible