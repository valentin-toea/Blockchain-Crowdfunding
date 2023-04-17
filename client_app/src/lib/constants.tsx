import { ethers } from "ethers";
import { toast } from "react-toastify";
import crowdfundingContract from "./Crowdfunding.json";
import projectContract from "./Project.json";

const rpc = "HTTP://127.0.0.1:8545";

export const crowdfundingAddress = "0x69DEee9acaC359009e5a38bCC247aF0c1684Fc3A";
export const crowdfundingAbi = crowdfundingContract.abi;

export const projectAbi = projectContract.abi;

// Contract Instance
export const getCrowdfundingInstance = () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  return new ethers.Contract(crowdfundingAddress, crowdfundingAbi, signer);
};

export const getProjectInstance = (address: string) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  return new ethers.Contract(address, projectAbi, signer);
};
