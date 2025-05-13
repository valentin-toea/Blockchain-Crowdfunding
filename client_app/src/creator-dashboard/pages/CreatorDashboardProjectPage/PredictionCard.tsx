import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
// @ts-ignore
import ARIMAPromise from "arima/async";
import { theme } from "../../../theme";

const PredictionCard = ({
  projectId,
  projectData,
}: {
  projectId: string | undefined;
  projectData: Project;
}) => {
  const [remainingDays, setRemainingDays] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [daysNeeded, setDaysNeeded] = useState(0);

  useEffect(() => {
    if (projectData.raisedAmount < projectData.goal) {
      (async () => {
        const { data: projectData, error } = await supabase
          .from("projects")
          .select("createdAt,startDate, endDate, raisedAmount, goal")
          .eq("id", projectId)
          .single();

        if (projectData && !error) {
          const startDate = projectData["createdAt"];
          const endDate = projectData.endDate;

          const daysLeft = datediff(new Date(), parseDate(endDate));
          const daysGone = datediff(parseDate(startDate), new Date());

          if (daysLeft > 0) {
            setRemainingDays(daysLeft);
          }

          const { data, error: error2 } = await supabase
            .from("transactions")
            .select("createdAt, amount")
            .eq("projectId", projectId);

          if (data) {
            const d = new Date();
            d.setDate(d.getDate() - daysGone);

            const structuredData: any = {};

            for (let i = 1; i <= daysGone + 1; i++) {
              const intermDate = `${d.getFullYear()}-${
                d.getMonth() + 1 < 10
                  ? "0" + (d.getMonth() + 1).toString()
                  : d.getMonth() + 1
              }-${
                d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate()
              }`;

              structuredData[intermDate] = 0;

              d.setDate(d.getDate() + i);
            }

            data?.forEach((item) => {
              const itemDate = item["createdAt"].split("T")[0];
              structuredData[itemDate] =
                (structuredData[itemDate] || 0) + item.amount;
            });

            const arimaArr = Object.values(structuredData);

            ARIMAPromise.then((ARIMA: any) => {
              const ts = arimaArr;
              const arima = new ARIMA({
                p: 1,
                d: 0,
                q: 1,
                P: 0,
                D: 0,
                Q: 0,
                S: 0,
                verbose: false,
                auto: true,
              }).train(ts);
              const [pred, errors] = arima.predict(daysLeft);

              const sum1 = data.reduce(
                (partialSum, item) => partialSum + item.amount,
                0
              );

              const sum2 = pred.reduce(
                (partialSum: number, a: number, index: number) => {
                  if (sum1 + partialSum >= projectData.goal)
                    setDaysNeeded((prev) => (prev === 0 ? index : prev));
                  return partialSum + a;
                },
                0
              );

              const predictedSum = sum1 + sum2;

              const _percentage = (100 * predictedSum) / projectData.goal;

              setPercentage(_percentage);
            });
          }
        }
      })();
    }
  }, [projectData.goal, projectData.raisedAmount, projectId]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2>Success Prediction</h2>
      {projectData.raisedAmount < projectData.goal ? (
        <>
          <p>Based on current funds/backers data</p>
          <h4>Success Rate:</h4>
          <h1>{percentage > 100 ? ">100" : percentage.toFixed(2)}%</h1>
        </>
      ) : (
        <>
          <h3 style={{ color: theme.colors.green400.toString() }}>
            Project Already Succeeded
          </h3>
        </>
      )}
    </div>
  );
};

export default PredictionCard;

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
