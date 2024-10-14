import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { useState } from "react";
import axios from 'axios';

function Landing() {
    const [repoUrl, setRepoUrl] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [nextPage, setNextPage] = useState<boolean>(false);
    const [publicKey, setPublicKey] = useState<string>("");
    const [contributorKey, setContributorKey] = useState<string>("");
    const [privateKey, setPrivateKey] = useState<string>("");
    const [conPrivKey, setConPrivKey] = useState<string>("");
    const [prizeMoney, setPrizeMoney] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    // Function to check if a GitHub pull request is merged
    async function isPullRequestMerged(repoUrl: string) {
        try {
            // Extract owner, repo, and pull number from the URL
            const urlParts = repoUrl.split('/');
            const owner = urlParts[3];
            const repo = urlParts[4];
            const pullNumber = urlParts[6];
    
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`);
            console.log(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`)
            return response.data.merged;
        } catch (error: any) {
            console.error('Error fetching pull request status:', error.message);
            return false; // Assume not merged on error
        }
    }

    async function createEscrowe() {
        // Data for the POST request
        const data = {
            privateKey,
            publicKey,
            prizeMoney,
        };

        // Axios POST request to the `/create-escrow` endpoint
        await axios.post('http://localhost:3000/create-escrow', data)
        .then((response: { data: any; }) => {
            console.log('Escrow payment created successfully:', response.data);
        })
        .catch((error: { response: { data: any; }; message: any; }) => {
            console.error('Error creating escrow:', error.response ? error.response.data : error.message);
        });
    }

    async function claimBounty() {
        const data = {
            conPrivKey
        }

        await axios.post('http://localhost:3000/create-escrow', data)
        .then((response: { data: any; }) => {
            console.log('Escrow payment created successfully:', response.data);
        })
        .catch((error: { response: { data: any; }; message: any; }) => {
            console.error('Error creating escrow:', error.response ? error.response.data : error.message);
        });
    }

    const confirmBounty = () => {
        let condition = confirm(`Are you sure you would like to proceed?\n\nYour GitHub Repository: ${repoUrl}\nYour Stellar Wallet Public Key: ${publicKey}\nYour Bounty Reward: ${prizeMoney}`)
        if (condition) {
            createEscrowe();
            alert("Bounty has been successfully added. Thank you for using our services.")
            location.reload()
        }
    }

    const redirectToGitHubAuth = (username: string) => {
        const clientId = "Ov23li9vGwNkP1LjPN3m"; // Replace with your GitHub OAuth app client ID
        const redirectUri = "http://localhost:5173"; // Replace with your redirect URI

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&login=${username}`;

        window.location.href = authUrl;
    };

    // Example usage
    const handleGitHubAuth = async (): Promise<void> => {
        if (username) {
            if (await isPullRequestMerged(url)) {
                let condition = confirm(`You are about to be redirected to Github. Once you have authorized your GitHub Account, the Bounty Rewards will be automatizally transferred to your Stellar Wallet.\n\nYour Stellar Wallet Public Key: ${contributorKey}\n\nIf your public key is correct, click OK to proceed. Thank you for using our services.`)
                if (condition) {
                    claimBounty();
                    redirectToGitHubAuth(username);
                }
            }
            else {
                alert("The pull request has not been merged yet. Please wait for the pull request to be merged before claiming your rewards.");
            }
        };
    }

    if (nextPage) {
        return (
            <>
                <br />
                <h1><b>Problem Market</b></h1>
                <br />

                <br />
                <hr style={{ border: '1px solid #ccc', margin: '20px 0', width: '100%' }} />
                <br />

                <h1>First, let's set up your Github Webhook</h1>
                <br />
                <br />
                <ol>
                    <li>1. Go to Your Repository Settings: 
                        Navigate to your GitHub repository and click on the "Settings" tab.
                    </li>
                    <br />
                    <li>2. Access Webhooks: 
                        In the left sidebar, click on "Webhooks" under the "Options" section.
                    </li>
                    <br />
                    <li>3. Add a New Webhook: 
                        Click the "Add webhook" button at the top right.
                    </li>
                    <br />
                    <li>4. Configure the Payload URL: 
                        In the "Payload URL" field, enter the URL where you want to receive the webhook payloads.
                    </li>
                    <br />
                    <li>5. Set Content Type: 
                        Set the "Content type" to "application/json".
                    </li>
                    <br />
                    <li>6. Choose Events: 
                        Select "Let me select individual events" and check the "Pull requests" option.
                    </li>
                    <br />
                    <li>7. Save the Webhook: 
                        Click the "Add webhook" button to save your new webhook configuration.
                    </li>
                </ol>
                
                <br />
                <hr style={{ border: '1px solid #ccc', margin: '20px 0', width: '100%' }} />
                <br />

                <h1>Now, fill in the details for your Bounty</h1>
                <br /><br />
                <ol>
                    <li>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="publicKey" className="text-left">Enter your Stellar Wallet Public key</Label>
                            <Textarea placeholder="e.g. GXXXXXXXXXXXXXXX..." 
                                onChange={(e) => setPublicKey(e.target.value)}
                                id="publicKey" />
                                
                        </div>
                        <br />
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="priv" className="text-left">Enter your Stellar Wallet Private key</Label>
                            <Textarea placeholder="e.g. XXXXXXXXXXXXXXX..." 
                                onChange={(e) => setPrivateKey(e.target.value)}
                                id="priv" />
                                
                        </div>
                        <br />
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="prizeMoney" className="text-left">Enter your Bounty Reward in XLM</Label>
                            <Textarea placeholder="e.g. 1000" 
                                onChange={(e) => setPrizeMoney(parseFloat(e.target.value))}
                                id="prizeMoney" />
                        </div>
                        <br />
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="desc" className="text-left">Enter Instructions for Contributors</Label>
                            <Textarea placeholder="e.g. Payment Conditions, Requirements, Performance, Etc." 
                                onChange={(e) => setDescription(e.target.value)}
                                id="desc" />
                        </div>
                    </li>
                </ol>
                <br />
                <Button size={"lg"} onClick={(e) => {publicKey != '' && prizeMoney != 0 && description != '' && confirmBounty()}}>Proceed</Button>
                <br />

                <br />
                <hr style={{ border: '1px solid #ccc', margin: '20px 0', width: '100%' }} />
                <br />
            </>
        )
    }

    return (
        <>
            <br />
            <h1><b>Problem Market</b></h1>
            <br />

            <br />
            <hr style={{ border: '1px solid #ccc', margin: '20px 0', width: '100%' }} />
            <br />

            <br />
            <h1>Are you a <b>Developer</b> Looking for Contributors?  Add a Bounty to your Github Repository!</h1>
            <br />
            <br />
            <Textarea 
                placeholder="URL to your GitHub Repository (e.g. github.com/your-username/your-repository)" 
                onChange={(e) => setRepoUrl(e.target.value)}
            />
            <br />
            <Button size={"lg"} onClick={(e) => {repoUrl != '' && setNextPage(true)}}>Let's Go</Button>
            <br />

            <br />
            <hr style={{ border: '1px solid #ccc', margin: '20px 0', width: '100%' }} />
            <br />

            <br />
            <h1>Are you a <b>Contributor</b> Waiting for your Bounty Rewards? Claim your Rewards Now!</h1>
            <br /><br />

            <div className="grid w-full gap-1.5">
                <Label htmlFor="contrib" className="text-left">Enter your Stellar Wallet Public key</Label>
                <Textarea placeholder="e.g. GXXXXXXXXXXXXXXX..." 
                    onChange={(e) => setContributorKey(e.target.value)}
                    id="contrib" />
                    
            </div>
            <br />

            <div className="grid w-full gap-1.5">
                <Label htmlFor="conpriv" className="text-left">Enter your Stellar Wallet Private key</Label>
                <Textarea placeholder="e.g. XXXXXXXXXXXXXXX..." 
                    onChange={(e) => setConPrivKey(e.target.value)}
                    id="conpriv" />
                    
            </div>
            <br />

            <div className="grid w-full gap-1.5">
                <Label htmlFor="user" className="text-left">Enter your GitHub Username</Label>
                <Textarea placeholder="e.g. Your Username" 
                    onChange={(e) => setUsername(e.target.value)}
                    id="user" />
                    
            </div>
            <br />

            <div className="grid w-full gap-1.5">
                <Label htmlFor="url" className="text-left">Enter the URL to your merged pull request</Label>
                <Textarea placeholder="e.g. https://github.com/owner/repo/pull/123" 
                    onChange={(e) => setUrl(e.target.value)}
                    id="url" />
            </div>
            <br />

            <br />
                <Button size={"lg"} onClick={(e) => username!='' && contributorKey!='' && handleGitHubAuth()}>Claim your Rewards</Button>
            <br />

        </>
    );
}

export default Landing;