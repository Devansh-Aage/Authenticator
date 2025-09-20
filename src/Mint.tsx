import { type FC, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PinataSDK } from "pinata";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

interface MintProps { }

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

const Mint: FC<MintProps> = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [pinataUrl, setPinataUrl] = useState<string>("");
    const [mintStatus, setMintStatus] = useState<string>("");
    const [TxUrl, setTxUrl] = useState("")

    const [studentAddress, setStudentAddress] = useState<string>("");

    const { connection } = useConnection();
    const wallet = useWallet();

    // -----------------------
    // Handle File Upload
    // -----------------------
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    // -----------------------
    // Upload File + Metadata
    // -----------------------
    const handlePinataUpload = async () => {
        if (!file) return;
        try {
            setUploadStatus("Uploading file to Pinata...");

            // Upload the file itself (image, PDF, etc.)
            const upload = await pinata.upload.public.file(file);

            if (!upload.cid) throw new Error("File upload failed");

            const fileIpfsUrl = await pinata.gateways.public.convert(upload.cid);
            setPinataUrl(fileIpfsUrl);

            // Construct metadata JSON
            const metadata = {
                name: "Marksheet NFT",
                symbol: "MARKS",
                description: "NFT representing student marksheet",
                image: fileIpfsUrl,
                attributes: [{ trait_type: "Issuer", value: "KJSIT" }],
            };

            setUploadStatus("Uploading metadata JSON to Pinata...");

            // Upload metadata JSON
            const jsonUpload = await pinata.upload.public.json(metadata);
            if (!jsonUpload.cid) throw new Error("Metadata upload failed");

            const metadataUri = await pinata.gateways.public.convert(jsonUpload.cid);

            setUploadStatus("Metadata uploaded ✅");
            return metadataUri;
        } catch (err) {
            setUploadStatus(
                `Error: ${err instanceof Error ? err.message : String(err)}`
            );
            return null;
        }
    };

    // -----------------------
    // Mint NFT
    // -----------------------
    const handleMintNFT = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            alert("Connect your wallet first!");
            return;
        }

        setMintStatus("Preparing mint...");

        const metadataUri = await handlePinataUpload();
        if (!metadataUri) {
            setMintStatus("Mint failed ❌ (metadata missing)");
            return;
        }

        try {
            const metaplex = Metaplex.make(connection).use(
                walletAdapterIdentity(wallet)
            );

            // Mint NFT
            const { nft } = await metaplex.nfts().create({
                uri: metadataUri,
                name: "Student Marksheet NFT",
                symbol: "MARKS",
                sellerFeeBasisPoints: 0,
                tokenOwner: new PublicKey(studentAddress), // NFT goes to student
            });
            setTxUrl(nft.address.toBase58())
            setMintStatus(`NFT Minted ✅ Address: ${nft.address.toBase58()}`);
            console.log("NFT:", nft);
        } catch (err) {
            console.error(err);
            setMintStatus("Mint failed ❌");
        }
    };

    return (
        <div className="flex-col flex items-center w-full px-20">
            <p className="text-center text-2xl py-7 font-medium">Mint Marksheet To Student</p>

            {/* File Upload */}
            <div className="flex flex-col">
                <div className="flex  flex-col gap-4">
                    <div>
                        <label htmlFor="file">Upload Marksheet: </label>
                        <input className="border border-zinc-600 rounded-xl px-3 py-2" type="file" onChange={handleFileUpload} />
                    </div>
                    <div>
                        <label>Student Address: </label>
                        <input
                            className="border w-sm border-zinc-600 rounded-xl px-3 py-2"
                            type="text"
                            value={studentAddress}
                            onChange={(e) => setStudentAddress(e.target.value)}
                            placeholder="Enter student wallet address..."
                        />
                    </div>
                    <button className="bg-zinc-800 w-sm p-2 mx-auto text-white rounded-xl font-medium hover:font-semibold" onClick={handleMintNFT} disabled={!file || !studentAddress}>
                        Mint Marksheet NFT
                    </button>
                </div>

                <div className="flex flex-col mt-5 gap-3">
                    <p>{uploadStatus}</p>
                    {pinataUrl && (
                        <a referrerPolicy="no-referrer" className="pl-2 font-semibold hover:text-green-500 transition-all duration-200" href={pinataUrl} target="_blank" rel="noreferrer">
                            View File on IPFS
                        </a>
                    )}
                    {TxUrl &&
                        <div>
                            Check out Transaction at
                            <a target="_blank" rel="noreferrer" className="pl-2 font-semibold hover:text-cyan-500 transition-all duration-200" href={`https://explorer.solana.com/address/${TxUrl}?cluster=devnet`} >Solana Explorer</a>
                        </div>
                    }
                </div>

            </div>

        </div>
    );
};

export default Mint;
