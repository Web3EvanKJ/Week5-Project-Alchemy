import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [savedContent, setSavedContent] = useState([]);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(await provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    const savedContents = JSON.parse(localStorage.getItem("content"));
    if (savedContents) {
      console.log("Saved");
      setSavedContent([savedContents]);
      console.log(savedContent);
    }
  }, []);

  useEffect(() => {
    handleContentChange();
  }, [escrows]);

  const handleContentChange = () => {
    console.log("Here");
    console.log(escrows);
    setSavedContent(escrows);
    console.log(savedContent);
    localStorage.setItem("content", JSON.stringify(escrows));
  };

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(
      ethers.utils.parseUnits(document.getElementById("wei").value)
    );
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(
            escrowContract.address
          ).innerText = `✓ It's been approved! `;
        });
        await approve(escrowContract, signer);
      },
    };
    console.log("Working tho");
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>
      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      <div id="container">
        <h1>SavedContent</h1>
        {savedContent.map((saved, i) => {
          return (
            <div key={i}>
              {saved.value} <br />
              {saved.arbiter} <br />
              {saved.beneficiary} <br />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

// 0x9d4240f1e92130c3C493990039384202d9180594
// 0x4be49aE2daE6a63880518e02c6E9931c5DDa760c
