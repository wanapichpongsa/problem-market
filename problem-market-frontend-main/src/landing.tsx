import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { useState } from "react";

function Landing() {
    const [repoUrl, setRepoUrl] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [nextPage, setNextPage] = useState<boolean>(false);
    const [publicKey, setPublicKey] = useState<string>("");
    const [contributorKey, setContributorKey] = useState<string>("");
    const [prizeMoney, setPrizeMoney] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    const confirmBounty = () => {
        let condition = confirm(`Are you sure you would like to proceed?\n\nYour GitHub Repository: ${repoUrl}\nYour Stellar Wallet Public Key: ${publicKey}\nYour Bounty Reward: ${prizeMoney}`)
        if (condition) {
            // add shit
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
    const handleGitHubAuth = () => {
        if (username) {
            let condition = confirm(`You are about to be redirected to Github. Once you have authorized your GitHub Account, the Bounty Rewards will be automatizally transferred to your Stellar Wallet.\n\nYour Stellar Wallet Public Key: ${contributorKey}\n\nIf your public key is correct, click OK to proceed. Thank you for using our services.`)
            condition && redirectToGitHubAuth(username);
        }
    };

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
                <Label htmlFor="user" className="text-left">Enter your GitHub Username</Label>
                <Textarea placeholder="e.g. Your Username" 
                    onChange={(e) => setUsername(e.target.value)}
                    id="user" />
                    
            </div>
            <br />

            <br />
                <Button size={"lg"} onClick={(e) => username!='' && contributorKey!='' && handleGitHubAuth()}>Claim your Rewards</Button>
            <br />

        </>
    );
}

export default Landing;