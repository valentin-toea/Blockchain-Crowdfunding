import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { selectUser, selectUserProfile } from "../../slices/userSlice";
import { useAppSelector } from "../../store/hooks";
import { supabase } from "../../supabaseClient";
import { theme } from "../../theme";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { STORAGE_URL } from "../../utils";
import Card from "../../components/Card";
import TextField from "../../components/common/TextField";
import { Search as SearchIcon } from "@styled-icons/boxicons-regular/Search";
import { File as ProjectIcon } from "@styled-icons/boxicons-regular/File";
import { Money as MoneyIcon } from "@styled-icons/boxicons-regular/Money";
import { People as PeopleIcon } from "@styled-icons/bootstrap/People";
import { TrendingUp as SuccessfulIcon } from "@styled-icons/boxicons-regular/TrendingUp";
import { TrendingDown as FailedIcon } from "@styled-icons/boxicons-regular/TrendingDown";
import IconButton from "../../components/common/IconButton";

const CreatorDashboardProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [totalRaised, setTotailRaised] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);

  const userId = useAppSelector(selectUserProfile).id;

  useEffect(() => {
    (async () => {
      let { data, error } = await supabase
        .from("projects")
        .select("id,title,goal,raisedAmount, mainImage, backers, endDate")
        .eq("userId", userId);

      if (error) toast.error(error);
      else if (data) {
        setProjects(data);
        setFilteredProjects(data);
        setPageNumber(
          data.length / 5 > Math.floor(data.length / 5)
            ? Math.floor(data.length / 5) + 1
            : Math.floor(data.length / 5)
        );

        let _totalRaised = 0;
        let _successCount = 0;
        let _failCount = 0;
        let _ongoingCount = 0;

        data.forEach((project: Project) => {
          if (project.raisedAmount >= project.goal) {
            _successCount += 1;
            _totalRaised += project.raisedAmount;
          } else if (
            project.raisedAmount < project.goal &&
            datediff(new Date(), parseDate(project.endDate)) > 0
          ) {
            _ongoingCount += 1;
            _totalRaised += project.raisedAmount;
          } else {
            _failCount++;
          }
        });

        setTotailRaised(_totalRaised);
        setSuccessCount(_successCount);
        setFailCount(_failCount);
        setOngoingCount(_ongoingCount);
      }
    })();
  }, [userId]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      const _projects = [
        ...projects.filter((project) =>
          project.title
            .toLocaleLowerCase()
            .includes(searchName.toLocaleLowerCase())
        ),
      ];

      setFilteredProjects(_projects);
      setPageNumber(
        _projects.length / 5 > Math.floor(_projects.length / 5)
          ? Math.floor(_projects.length / 5) + 1
          : Math.floor(_projects.length / 5)
      );
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchName, projects]);

  return (
    <Wrapper>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <Card style={{ width: "17.5%", minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
          >
            <ProjectIcon
              size={60}
              style={{ color: theme.colors.violet400.toString() }}
            />
            <b>{projects.length} Projects</b>
          </div>
        </Card>
        <Card style={{ width: "17.5%", minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
          >
            <MoneyIcon
              size={60}
              style={{ color: theme.colors.green400.toString() }}
            />
            <b>{totalRaised.toFixed(4)} ETH Total Raised</b>
          </div>
        </Card>
        <Card style={{ width: "17.5%", minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
          >
            <PeopleIcon size={60} style={{ color: "#ff9f00" }} />
            <b>{ongoingCount} Ongoing Campaigns</b>
          </div>
        </Card>
        <Card style={{ width: "17.5%", minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
          >
            <SuccessfulIcon
              size={60}
              style={{ color: theme.colors.green400.toString() }}
            />
            <b>{successCount} Successful Campaigns</b>
          </div>
        </Card>
        <Card style={{ width: "17.5%", minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
          >
            <FailedIcon
              size={60}
              style={{ color: theme.colors.red.toString() }}
            />
            <b>{failCount} Failed Campaigns</b>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 10 }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Your Campaigns</h2>
            <Link style={{ maxWidth: "max-content" }} to="/create-project">
              <Button css={{ maxWidth: "max-content" }} color="green400">
                Add New Campaign
              </Button>
            </Link>
          </div>
          <div style={{ maxWidth: "fit-content" }}>
            <TextField
              placeholder="Search...."
              icon={
                <SearchIcon
                  size={20}
                  style={{ color: theme.colors.violet400.toString() }}
                />
              }
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
            />
          </div>
        </div>
        <Table
          css={{
            width: "100%",
            boxShadow: "none",
            table: {
              width: "100%",
              minHeight: 447,
            },
            "table thead > tr": {
              background: theme.colors.violet300,
              color: "white",
            },
            "table tbody tr td": {
              display: "flex",
              alignItems: "center",
            },
          }}
          footer={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                Campaigns: {filteredProjects.length} / Total Pages: {pageNumber}
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <IconButton
                  onClick={() => {
                    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
                  }}
                >
                  {"<"}
                </IconButton>
                <div>{currentPage + 1}</div>
                <IconButton
                  onClick={() => {
                    setCurrentPage((prev) =>
                      prev < pageNumber - 1 ? prev + 1 : prev
                    );
                  }}
                >
                  {">"}
                </IconButton>
              </div>
            </div>
          }
          columns={columns}
          data={filteredProjects.slice(5 * currentPage, 5 * currentPage + 5)}
        />
      </Card>
    </Wrapper>
  );
};

export default CreatorDashboardProjects;

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  padding: "0 30px",
});

const columns = [
  {
    Header: "Title",
    accessor: "title",
    minWidth: 350,
    Cell: ({ cell }: { cell: any }) => {
      return (
        <Link
          to={`${cell.row.original.id}`}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              height: 50,
              width: 100,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <AspectRatio.Root ratio={16 / 9}>
              <img
                src={STORAGE_URL + cell.row.original.mainImage}
                alt="campaign"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </AspectRatio.Root>
          </div>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>
            {cell.row.original.title}
          </span>
        </Link>
      );
    },
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
    maxWidth: 110,
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
    Header: "Raised Amount",
    accessor: "raisedAmount",
    maxWidth: 110,
  },
  {
    Header: "Goal",
    accessor: "goal",
    maxWidth: 110,
  },

  {
    Header: "",
    accessor: "edit",
    Cell: ({ cell }: { cell: any }) => (
      <Link
        style={{ width: "100%" }}
        to={`/creator-dashboard/edit-project/${cell.row.original.id}/${cell.row.original.title}`}
      >
        <Button color="violet300">EDIT</Button>
      </Link>
    ),
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
