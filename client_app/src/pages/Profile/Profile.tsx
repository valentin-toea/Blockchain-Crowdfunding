import { Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/Card";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { supabase } from "../../supabaseClient";

const Profile = () => {
  const columns = getColumns();

  const params = useParams();

  const [profile, setProfile] = useState<UserProfile | null>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data && !error) setProfile(data);

      const { data: projectsData, error: error2 } = await supabase
        .from("projects")
        .select("*")
        .eq("userId", params.id);

      if (projectsData && !error2) setProjects(projectsData);
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <div>
      <h3 style={{ marginBottom: 10 }}>
        {profile?.hasCompany
          ? profile.companyName
          : profile?.firstName + " " + profile?.lastName}
        's Profile
      </h3>
      <Card style={{ maxWidth: 970, flex: 1 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar large fallbackText="US" />
          {!loading && (
            <>
              <div
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <span style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.hasCompany
                    ? profile.companyName
                    : profile?.firstName + " " + profile?.lastName}
                </span>
                <span>
                  {profile?.hasCompany ? profile.companyEmail : profile?.email}
                </span>
              </div>
            </>
          )}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Loader color="violet" />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}></div>
        </div>
        <div style={{ marginTop: 20, fontStyle: "italic" }}>
          {(profile?.hasCompany
            ? profile.companyDescription
            : profile?.description) || "No description"}
        </div>
      </Card>
      <br />
      <h3 style={{ marginBottom: 10 }}>{projects.length} Campaigns</h3>
      <Card style={{ padding: 25, maxWidth: 970 }}>
        <Table
          css={{ width: "100%", boxShadow: "none", table: { width: "100%" } }}
          columns={columns}
          data={projects}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Profile;

const getColumns = () => [
  {
    Header: "Campaign",
    accessor: "title",
    minWidth: 200,
    Cell: ({ cell }: { cell: any }) => (
      <Link to={`/project/${cell.row.original.id}`}>
        {cell.row.original.title}
      </Link>
    ),
  },
  {
    Header: "Ongoing",
    accessor: "ongoing",
    Cell: ({ cell }: { cell: any }) => (
      <div>
        {datediff(new Date(), parseDate(cell.row.original.endDate)) < 0
          ? "Done"
          : "Ongoing"}
      </div>
    ),
  },
  {
    Header: "Progress",
    accessor: "percentage",
    Cell: ({ cell }: { cell: any }) => (
      <div>
        {Math.floor(
          (100 * cell.row.original.raisedAmount) / cell.row.original.goal
        )}
        %
      </div>
    ),
  },

  {
    Header: "Raised",
    accessor: "raisedAmount",
  },
  {
    Header: "Goal",
    accessor: "goal",
  },
];

const parseDate = (str: string) => {
  const mdy = str.split("T")[0].split("-");
  return new Date(parseInt(mdy[0]), parseInt(mdy[1]) - 1, parseInt(mdy[2]));
};

const datediff = (first: Date, second: Date) => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  );
};
