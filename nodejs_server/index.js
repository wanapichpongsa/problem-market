const express = require('express');
const StellarSdk = require('stellar-sdk');
const axios = require('axios');

const app = express();
app.use(express.json());

// Set up Stellar testnet/mainnet
const NETWORK = 'testnet';  // Switch to 'mainnet' when live
const server = NETWORK === 'testnet' 
    ? new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org') 
    : new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const networkPassphrase = NETWORK === 'testnet' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC;

// Endpoint to initiate the escrow payment
app.post('/create-escrow', async (req, res) => {
    const { senderSecret, recipientPublicKey, amount } = req.body;

    if (!StellarSdk.StrKey.isValidEd25519PublicKey(recipientPublicKey)) {
        return res.status(400).json({ error: 'Invalid recipient public key' });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        // Load the sender's account
        const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
        const senderPublicKey = senderKeypair.publicKey();
        const account = await server.loadAccount(senderPublicKey);

        // Build the escrow transaction with a claimable balance
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            StellarSdk.Operation.createClaimableBalance({
                asset: StellarSdk.Asset.native(), // XLM
                amount: amount,
                claimants: [
                    {
                        destination: recipientPublicKey,
                        predicate: StellarSdk.ClaimPredicate.unconditional(),  // Escrow condition
                    },
                ],
            })
        )
        .setTimeout(30)
        .build();

        // Sign the transaction and submit to the Stellar network
        transaction.sign(senderKeypair);
        const result = await server.submitTransaction(transaction);
        res.json({ message: 'Escrow payment created!', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Endpoint for the bounty hunter to claim the prize
app.post('/claim-prize', async (req, res) => {
    const { recipientSecret } = req.body;

    try {
        // Load the recipient's account
        const recipientKeypair = StellarSdk.Keypair.fromSecret(recipientSecret);
        const recipientPublicKey = recipientKeypair.publicKey();
        const account = await server.loadAccount(recipientPublicKey);

        // Find claimable balances for the recipient
        const claimableBalances = await server
            .claimableBalances()
            .forClaimant(recipientPublicKey)
            .call();

        // If there are claimable balances, claim them
        if (claimableBalances.records.length > 0) {
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: await server.fetchBaseFee(),
                networkPassphrase: networkPassphrase,
            })
            .addOperation(
                StellarSdk.Operation.claimClaimableBalance({
                    balanceId: claimableBalances.records[0].id,
                })
            )
            .setTimeout(30)
            .build();

            // Sign and submit the transaction
            transaction.sign(recipientKeypair);
            const result = await server.submitTransaction(transaction);
            res.json({ message: 'Prize claimed successfully!', result });
        } else {
            res.status(404).json({ error: 'No claimable balances found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
