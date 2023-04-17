import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Avatar from "../../../components/common/Avatar";
import Button from "../../../components/common/Button";
import IconButton from "../../../components/common/IconButton";
import Modal from "../../../components/common/Modal";
import Tabs, { TabsContent } from "../../../components/common/Tabs";
import { selectUserProfile, userSliceActions } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { MoreVerticalOutline as MoreIcon } from "@styled-icons/evaicons-outline/MoreVerticalOutline";
import { TrashAlt as TrashIcon } from "@styled-icons/fa-regular/TrashAlt";
import { Dropdown, DropdownItem } from "../../../components/common/Dropdown";
import { theme } from "../../../theme";
import BackedProjectsTab from "./BackedProjectsTab";
import TransactionsTab from "./TransactionsTab";
import FollowingTab from "./FollowingTab";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WalletCard from "./WalletCard";
import EditInfoModal from "./EditInfoModal";
import AddressModalContent from "./AddressModalContent";
import { supabase } from "../../../supabaseClient";
import TextField from "../../../components/common/TextField";
import Switch from "../../../components/common/Switch";
import CompanyModal from "./CompanyModal";

const ProfilePage = () => {
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const locationHash = location.hash.split("#")[1];
  const [selectedTab, setSelectedTab] = useState<string>();

  useEffect(() => {
    setSelectedTab(locationHash?.replace("%20", " ") || "");
  }, [locationHash]);

  const profile = useAppSelector(selectUserProfile);

  const [backedProjects, setBackedProjects] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [savedCampaigns, setSavedCampaigns] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("backedCampaigns")
        .select(
          "projectId, projectData:projectId (title, mainImage, endDate, goal, raisedAmount, contractRef) "
        )
        .eq("userId", profile.id);

      if (data && !error) setBackedProjects(data);
    })();

    (async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, projectData:projectId (title, id)")
        .eq("userId", profile.id);
      if (data && !error) setTransactions(data);
    })();

    (async () => {
      const { data, error } = await supabase
        .from("savedCampaigns")
        .select(
          "*, projectData:projectId (title, mainImage, endDate, goal, raisedAmount)"
        )
        .eq("userId", profile.id);
      if (data && !error) setSavedCampaigns(data);
    })();
  }, [profile.id]);

  return (
    <>
      <div style={{ width: "100%", display: "flex", gap: 20 }}>
        <Card style={{ maxWidth: 650, flex: 1 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Avatar
              large
              fallbackText={profile.firstName[0] + profile.lastName[0] || ""}
            />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span style={{ fontWeight: "bold", fontSize: 18 }}>
                {profile.firstName + " " + profile.lastName}
              </span>
              <span>{profile.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button
                color="violet400"
                onClick={() => setOpenProfileModal(true)}
              >
                Edit
              </Button>
              <Dropdown
                align="bottom-end"
                trigger={
                  <IconButton ring>
                    <div style={{ padding: 5 }}>
                      <MoreIcon size={25} />
                    </div>
                  </IconButton>
                }
              >
                <DropdownItem
                  css={{ color: theme.colors.red }}
                  leftSlot={<TrashIcon size={15} />}
                >
                  Delete Account
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
          <div style={{ marginTop: 20, fontStyle: "italic" }}>
            {profile.description || "No description"}
          </div>
          <div
            style={{ marginTop: 20, display: "flex", flexDirection: "column" }}
          >
            <b>Address:</b>
            <div>
              {profile.address ? (
                <>
                  <p>{profile.address.country},</p>
                  <span>{profile.address.residence}</span>
                </>
              ) : (
                "No address"
              )}
            </div>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <b>Phone:</b>
              <div>{profile.phone}</div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", gap: 20 }}>
                <h4>Company Profile</h4>
                <Switch
                  checked={profile.hasCompany}
                  onChange={(value) => {
                    if (value) setCompanyModal(true);
                    else dispatch(userSliceActions.setHasCompany(value));
                  }}
                />
              </div>
              {profile.hasCompany && (
                <>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <Avatar
                      large
                      fallbackText={
                        profile.companyName && profile.companyName[0]
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: 18 }}>
                        {profile.companyName || "No Name"}
                      </span>
                      <span>{profile.companyEmail || "No Email"}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 20, fontStyle: "italic" }}>
                    {profile.companyDescription || "No description"}
                  </div>
                </>
              )}
            </div>
            <Modal
              title="Address"
              open={openAddressModal}
              onOpenChange={setOpenAddressModal}
            >
              <AddressModalContent
                closeModal={() => setOpenAddressModal(false)}
              />
            </Modal>
            <Modal
              title="Edit Profile"
              open={openProfileModal}
              onOpenChange={setOpenProfileModal}
            >
              <EditInfoModal closeModal={() => setOpenProfileModal(false)} />
            </Modal>
            <Modal
              title="Set Company"
              open={companyModal}
              onOpenChange={setCompanyModal}
            >
              <CompanyModal closeModal={() => setCompanyModal(false)} />
            </Modal>
          </div>
        </Card>
        <WalletCard />
      </div>
      <br />
      <div style={{ maxWidth: 970 }}>
        <Tabs
          minHeight={400}
          tabList={[
            "Backed Campaigns",
            "Transactions",
            "Saved Campaigns",
            "Creators",
          ]}
          value={selectedTab}
          extraActionIndex={[0, 1, 2, 3]}
          extraOnClick={(tabName) => {
            if (tabName === "Creators") {
              navigate("/creator-dashboard/projects");
            } else navigate(location.pathname + "#" + tabName);
          }}
        >
          <TabsContent value="Backed Campaigns">
            <BackedProjectsTab
              projects={backedProjects}
              transactions={transactions}
            />
          </TabsContent>
          <TabsContent value="Transactions">
            <TransactionsTab transactions={transactions} />
          </TabsContent>
          <TabsContent value="Saved Campaigns">
            <FollowingTab savedCampaigns={savedCampaigns} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
