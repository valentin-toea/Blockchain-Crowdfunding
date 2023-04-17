import React, { useMemo } from "react";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";
import Card from "../../../components/Card";
import Button from "../../../components/common/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUserProfile, setUserWallet } from "../../../slices/userSlice";
import { toast } from "react-toastify";

const WalletCard = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);

  const shortWallet = useMemo(() => {
    return profile.wallet
      ? profile.wallet.substring(2, 5) +
          "..." +
          profile.wallet.substring(
            profile.wallet.length - 4,
            profile.wallet.length
          )
      : "Not Connected";
  }, [profile.wallet]);

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
      toast.error("Error occured while connecting your wallet.");
    }
  };

  return (
    <Card
      style={{ minWidth: 300, minHeight: 220, maxHeight: 220, height: 220 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Wallet</h4>
          <Button
            color="violet400"
            style={{
              maxWidth: 90,
            }}
            onClick={chooseWallet}
          >
            Change
          </Button>
        </div>
        <div
          style={{
            marginTop: 10,
            height: "100%",
            width: "100%",
            background: "grey",
            borderRadius: 10,
            padding: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundImage: `linear-gradient(
            45deg,
            hsl(240deg 100% 20%) 0%,
            hsl(289deg 100% 21%) 11%,
            hsl(315deg 100% 27%) 22%,
            hsl(329deg 100% 36%) 33%,
            hsl(337deg 100% 43%) 44%,
            hsl(357deg 91% 59%) 56%,
            hsl(17deg 100% 59%) 67%,
            hsl(34deg 100% 53%) 78%,
            hsl(45deg 100% 50%) 89%,
            hsl(55deg 100% 50%) 100%
          )`,
          }}
        >
          <span style={{ color: "white", fontSize: 18 }}>
            <b>
              {profile.wallet
                ? `0x${shortWallet.toUpperCase()}`
                : shortWallet.toUpperCase()}
            </b>
          </span>
          <EthereumIcon
            size={25}
            style={{ color: "white", alignSelf: "right" }}
          />
        </div>
      </div>
    </Card>
  );
};

export default WalletCard;
