import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

const Caller = () => {
    const currentAccount = useCurrentAccount();

    return (
        <div>
		    <ConnectButton />
        </div>
    )
}

export default Caller

// import { useEffect, useMemo, useState, useContext } from 'react';
// import { Spin } from "antd";
// import { useCurrentAccount, useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
// import Message from '../../components/Message';
// import useSetLocation from '../../utils/use-set-location';
// import { SetRoleContext } from '../../utils/use-set-role';
// import { GAME_PACKAGE_ID, PLAYER_WAITLIST_ID, STATE_MANAGER_MODULE, JOIN_GAME_FN } from "../../utils/constants"

// const Home = () => {
//     const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
//   const [disabled, setDisabled] = useState(false);
//   const setLocation = useSetLocation();

//   const { role, setRole } = useContext(SetRoleContext);
//   const [isLoading, setIsloading] = useState(false)
//   const account = useCurrentAccount();
//   const suiClient = useSuiClient();

//   const handleSubmit = (selected_role) => {
//     console.log(selected_role);
//     setRole(selected_role, (role) => {
//       console.log(role); // not update
//     });
//     setDisabled(true);
//     setIsloading(true);
//     if (!account) {
//       return null;
//     }
//     // setLocation("/game");
//     const txb = new TransactionBlock();
//     txb.moveCall({
//       arguments: [txb.object(PLAYER_WAITLIST_ID), txb.pure.u64(selected_role)],
//       target: JOIN_GAME_FN,
//     });

//     signAndExecuteTransactionBlock(
//       {
//         transactionBlock: txb,
//         options: {
//           // We need the effects to get the objectId of the created counter object
//           showEffects: true,
//         },
//       },
//       {
//         onSuccess: (tx) => {
//           suiClient
//             .waitForTransactionBlock({
//               digest: tx.digest,
//             })
//             .then(() => {
//               setIsloading(false);
//               console.log("join game success");
//               setLocation("/game");
//             })
//         },
//       },
//     );
//   }
