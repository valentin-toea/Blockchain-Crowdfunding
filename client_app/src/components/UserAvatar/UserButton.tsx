import React from "react";
import { theme } from "../../theme";
import Avatar from "../common/Avatar";
import { Dropdown, DropdownItem } from "../common/Dropdown";
import { Exit as ExitIcon } from "@styled-icons/boxicons-regular/Exit";
import { Wallet as WalletIcon } from "@styled-icons/boxicons-regular/Wallet";
import { SettingsOutline as SettingsIon } from "@styled-icons/evaicons-outline/SettingsOutline";
import { File as FileIcon } from "@styled-icons/boxicons-regular/File";
import { FolderPlus as CreateIcon } from "@styled-icons/boxicons-regular/FolderPlus";
import { UserPin as UserIcon } from "@styled-icons/boxicons-regular/UserPin";
import IconButton from "../common/IconButton";
import { Separator } from "../common/Separator";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Transfer as TransferIcon } from "@styled-icons/boxicons-regular/Transfer";
import { Heart as HeartIcon } from "@styled-icons/boxicons-regular/Heart";
import { useAppSelector } from "../../store/hooks";
import { selectUserProfile } from "../../slices/userSlice";

const imageSrc =
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80";

const UserAvatar = () => {
  const navigate = useNavigate();
  const userData = useAppSelector(selectUserProfile);

  return (
    <Dropdown
      trigger={
        <IconButton ring>
          <Avatar
            fallbackText={
              userData.firstName && userData.lastName
                ? userData.firstName[0].toUpperCase() +
                  userData.lastName[0].toUpperCase()
                : ""
            }
          />
        </IconButton>
      }
    >
      <DropdownItem
        leftSlot={<UserIcon />}
        onClick={() => navigate("/account/profile")}
      >
        Profile
      </DropdownItem>
      <DropdownItem
        leftSlot={<WalletIcon />}
        onClick={() => navigate("/account/profile")}
      >
        Wallet
      </DropdownItem>
      <DropdownItem
        leftSlot={<FileIcon />}
        onClick={() => navigate("/account/profile#Backed%20Campaigns")}
      >
        Backed Campaigns
      </DropdownItem>
      <DropdownItem
        leftSlot={<TransferIcon />}
        onClick={() => navigate("/account/profile#Transactions")}
      >
        Your Transactions
      </DropdownItem>
      <DropdownItem
        leftSlot={<HeartIcon />}
        onClick={() => navigate("/account/profile#Saved%20Campaigns")}
      >
        Saved Campaigns
      </DropdownItem>

      <Separator />
      <DropdownItem
        leftSlot={<CreateIcon />}
        onClick={() => navigate("/creator-dashboard")}
      >
        Creator Studio
      </DropdownItem>

      <Separator />
      <DropdownItem
        css={{ color: theme.colors.red }}
        leftSlot={<ExitIcon />}
        onClick={() => supabase.auth.signOut().catch(console.error)}
      >
        Logout
      </DropdownItem>
    </Dropdown>
  );
};

export default UserAvatar;
