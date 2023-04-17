import Button from "../../../components/common/Button";
import { selectUserProfile, setUserWallet } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const WalletPage = () => {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectUserProfile)?.wallet;

  const chooseWallet = async () => {
    let eth;

    if (typeof window !== undefined) {
      eth = (window as any).ethereum;
    }

    const metamask = eth;

    try {
      if (!metamask) alert("Please install metamask!");
      const accounts = await metamask
        .request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        })
        .then(() =>
          metamask.request({
            method: "eth_requestAccounts",
          })
        );

      dispatch(setUserWallet(accounts[0]));
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object");
    }
  };

  return (
    <div>
      <Button onClick={() => chooseWallet()}>Choose wallet</Button>
      <div>Wallet saved in account: {wallet || "none"}</div>
    </div>
  );
};

export default WalletPage;
