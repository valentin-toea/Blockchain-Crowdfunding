import { ethers } from "ethers";
import React, { useEffect } from "react";
import Button from "../../../components/common/Button";
import { selectNewProject } from "../../../slices/newProjectSlice";
import { useAppSelector } from "../../../store/hooks";

const ContractStep = () => {
  const projectData = useAppSelector(selectNewProject);

  useEffect(() => {
    /*  (async () => {
      // Set Provider
      const rpc = "HTTP://127.0.0.1:8545";
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const signer = provider.getSigner();

      // Contract Instance
      const contractInstance = new ethers.Contract(
        "0x08c65BB536E35c1685C52772750318D1c9C70f8a",
        crowdfundingContract.abi,
        signer
      );

      // For view function
      const result = await contractInstance.functions.returnAllProjects();
      console.log(result);

      result[0].forEach((address: string) => {
        const projectInst = new ethers.Contract(
          address,
          projectContract.abi,
          signer
        );

        projectInst
          .getDetails()
          .then((val: any) => console.log(parseInt(val.requestsCount)));
      });
    })(); */
  }, []);

  const handleClick = async () => {
    /*   //accounts
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    // Set Provider
    const rpc = "HTTP://127.0.0.1:8545";
    const provider = new ethers.providers.JsonRpcProvider(rpc);

    // Contract Instance
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      "0x08c65BB536E35c1685C52772750318D1c9C70f8a",
      crowdfundingContract.abi,
      signer
    );

    console.log(accounts[0]);

    let tx = await contractInstance.functions.startProject(
      projectData.title,
      projectData.shortDescription,
      20,
      1000,
      1
    );

    console.log(tx.hash);

    await tx.wait();

    // For view function
         var result = await contractInstance.functions.startProject(
      projectData.title,
      projectData.shortDescription,
      20,
      10000000,
      1000
    );
    console.log(result);
    let result = await contractInstance.functions.returnAllProjects();
    console.log(result); */
  };

  return (
    <div>
      ContractStep
      <Button onClick={handleClick}>Create smart contract for project</Button>
    </div>
  );
};

export default ContractStep;
