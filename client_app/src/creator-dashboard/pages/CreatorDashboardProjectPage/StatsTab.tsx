import React, { useCallback, useEffect, useState } from "react";
import Card from "../../../components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../../theme";
import { Select } from "@mantine/core";
import { supabase } from "../../../supabaseClient";
import PredictionCard from "./PredictionCard";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const WEEKS = [
  "First Quarter",
  "Second Quarter",
  "Third Quarter",
  "Forth Quarter",
];

const StatsTab = ({
  projectId,
  startDate,
  projectData,
}: {
  projectId: string | undefined;
  startDate: string | undefined;
  projectData: Project;
}) => {
  const [transactions, setTransactions] =
    useState<{ name: string; amount: number; backers?: number }[]>();

  const [selectValue, setSelectValue] = useState("Last Week");

  const getTransactionsLastWeek = useCallback(async () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);

    const { data, error } = await supabase
      .from("transactions")
      .select("createdAt, amount, userId")
      .eq("projectId", projectId)
      .gt("createdAt", d.toISOString());

    const { data: backersData, error: error2 } = await supabase
      .from("backedCampaigns")
      .select("createdAt, userId")
      .eq("projectId", projectId)
      .gt("createdAt", d.toISOString());

    if (!error && data) {
      const structuredData: any = {};
      const structuredBakers: any = {};

      data?.forEach((item) => {
        structuredData[
          DAYS[new Date(item["createdAt"].split("T")[0]).getDay()]
        ] =
          (structuredData[
            DAYS[new Date(item["createdAt"].split("T")[0]).getDay()]
          ] || 0) + item.amount;
      });

      backersData?.forEach((item) => {
        structuredBakers[
          DAYS[new Date(item["createdAt"].split("T")[0]).getDay()]
        ] = {
          ...(structuredBakers[
            DAYS[new Date(item["createdAt"].split("T")[0]).getDay()]
          ] || {}),
          [item.userId]: true,
        };
      });

      const weekDays: { name: string; amount: number; backers?: number }[] = [];

      for (let i = d.getDay() + 1; i < DAYS.length; i++) {
        weekDays.push({
          name: DAYS[i],
          amount: structuredData[DAYS[i]] || 0,
          backers: Object.keys(structuredBakers[DAYS[i]] || {}).length,
        });
      }
      for (let i = 0; i <= d.getDay(); i++) {
        weekDays.push({
          name: DAYS[i],
          amount: structuredData[DAYS[i]] || 0,
          backers: Object.keys(structuredBakers[DAYS[i]] || {}).length,
        });
      }

      setTransactions(weekDays);
    }
  }, [projectId]);

  const getTransactionsLastMonth = useCallback(async () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);

    const { data, error } = await supabase
      .from("transactions")
      .select("createdAt, amount, userId")
      .eq("projectId", projectId)
      .gt("createdAt", d.toISOString());

    const { data: backersData, error: error2 } = await supabase
      .from("backedCampaigns")
      .select("createdAt, userId")
      .eq("projectId", projectId)
      .gt("createdAt", d.toISOString());

    if (!error && data) {
      const structuredData: any = {};
      const structuredBakers: any = {};

      const quarter1Date = new Date(d);
      quarter1Date.setDate(quarter1Date.getDate() + 7);
      const quarter2Date = new Date(d);
      quarter2Date.setDate(quarter2Date.getDate() + 14);
      const quarter3Date = new Date(d);
      quarter3Date.setDate(quarter3Date.getDate() + 21);

      data?.forEach((item) => {
        const itemDate = new Date(item["createdAt"].split("T")[0]);
        if (itemDate < quarter1Date) {
          structuredData[WEEKS[0]] =
            (structuredData[WEEKS[0]] || 0) + item.amount;
        }
        if (itemDate < quarter2Date) {
          structuredData[WEEKS[1]] =
            (structuredData[WEEKS[1]] || 0) + item.amount;
        }
        if (itemDate < quarter3Date) {
          structuredData[WEEKS[2]] =
            (structuredData[WEEKS[2]] || 0) + item.amount;
        } else {
          structuredData[WEEKS[3]] =
            (structuredData[WEEKS[3]] || 0) + item.amount;
        }
      });

      backersData?.forEach((item) => {
        const itemDate = new Date(item["createdAt"].split("T")[0]);
        if (itemDate < quarter1Date) {
          structuredBakers[WEEKS[0]] = {
            ...(structuredBakers[WEEKS[0]] || {}),
            [item.userId]: true,
          };
        }
        if (itemDate < quarter2Date) {
          structuredBakers[WEEKS[1]] = {
            ...(structuredBakers[WEEKS[1]] || {}),
            [item.userId]: true,
          };
        }
        if (itemDate < quarter3Date) {
          structuredBakers[WEEKS[2]] = {
            ...(structuredBakers[WEEKS[2]] || {}),
            [item.userId]: true,
          };
        } else {
          structuredBakers[WEEKS[3]] = {
            ...(structuredBakers[WEEKS[3]] || {}),
            [item.userId]: true,
          };
        }
      });

      const result = WEEKS.map((weekDay) => {
        return {
          name: weekDay,
          amount: structuredData[weekDay] || 0,
          backers: Object.keys(structuredBakers[weekDay] || {}).length,
        };
      });

      setTransactions(result);
    }
  }, [projectId]);

  const getTransactionsAllTime = useCallback(async () => {
    const d = new Date();

    const { data, error } = await supabase
      .from("transactions")
      .select("createdAt, amount, userId")
      .eq("projectId", projectId);

    const { data: backersData, error: error2 } = await supabase
      .from("backedCampaigns")
      .select("createdAt, userId")
      .eq("projectId", projectId);

    if (!error && data) {
      const lastDateKey = `${d.getFullYear()}-${
        d.getMonth() + 1 < 10
          ? "0" + (d.getMonth() + 1).toString()
          : d.getMonth() + 1
      }-${d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate()}`;

      const structuredData: any = {
        [(startDate || "").split("T")[0]]: 0,
      };

      const structuredBakers: any = {
        [(startDate || "").split("T")[0]]: {},
      };

      data?.forEach((item) => {
        const itemDate = item["createdAt"].split("T")[0];
        structuredData[itemDate] =
          (structuredData[itemDate] || 0) + item.amount;
      });

      backersData?.forEach((item) => {
        const itemDate = item["createdAt"].split("T")[0];
        structuredBakers[itemDate] = {
          ...(structuredBakers[itemDate] || {}),
          [item.userId]: true,
        };
      });

      structuredData[lastDateKey] = (structuredData[lastDateKey] || 0) + 0;

      const result = Object.entries(structuredData).map(([key, value]) => ({
        name: key,
        amount: (value || 0) as number,
        backers: Object.keys(structuredBakers[key] || {}).length,
      }));

      setTransactions(result);
    }
  }, [projectId, startDate]);

  useEffect(() => {
    if (selectValue === "Last Week") {
      getTransactionsLastWeek();
    } else if (selectValue === "Last Month") {
      getTransactionsLastMonth();
    } else {
      getTransactionsAllTime();
    }
  }, [
    getTransactionsLastWeek,
    getTransactionsLastMonth,
    getTransactionsAllTime,
    selectValue,
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <Card style={{ width: "100%", height: 800 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2>Funds </h2>
            <Select
              styles={{
                input: {
                  "&:focus": {
                    borderColor: theme.colors.violet400.toString(),
                  },
                },
                selected: {
                  color: theme.colors.violet500.toString(),
                  background: theme.colors.violet100.toString(),
                },
              }}
              color="violet"
              data={["Last Week", "Last Month", "All Time"]}
              value={selectValue}
              onChange={(value: string) => setSelectValue(value)}
            />
          </div>
          <div style={{ width: "99%", height: "42%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={transactions}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  wrapperStyle={{ borderRadius: 20 }}
                  contentStyle={{
                    borderRadius: 10,
                    boxShadow: theme.shadows.boxShadow3.toString(),
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <h2>New Backers</h2>
          </div>
          <div style={{ width: "99%", height: "42%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={transactions}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  wrapperStyle={{ borderRadius: 20 }}
                  contentStyle={{
                    borderRadius: 10,
                    boxShadow: theme.shadows.boxShadow3.toString(),
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="backers"
                  stroke={theme.colors.green400.toString()}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card style={{ minWidth: 300, maxHeight: 400 }}>
          <PredictionCard projectId={projectId} projectData={projectData} />
        </Card>
      </div>
    </div>
  );
};

export default StatsTab;
