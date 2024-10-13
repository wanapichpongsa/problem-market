# problem-market

This is the official Problem Market repository.

Problem market is a *trustless* smart contract system to equitably compensate developers on github. This means, rather than a fixed contract (that tends to undervalue or overvalue someone's work), developers will be hired based off their contribution, not how good their CV looks!

[Quick demo](https://www.youtube.com/watch?v=gZAQVz69f6I)

### What this means:

NO LITIGATION: Don't break the bank going to court. Your agreement is written is backed by Stellar's blockchain! This way, no one can cheat their way out of an agreement.

NO MORE CREDENTIALISM: You can be a kid, a college dropout – doesn't matter. If you can get things done, you deserve the contract.

NO MORE EXTORTIONATE CONTRACTS: If freelancer(s) don't deliver on their promise, they should only be partially compensated.

### How it works:

1. Connect your crypto wallet to our platform.
2. Configure the parameters (e.g., description, prize money) for your issue on the Problem Market platform.
3. Post your issue to our marketplace.
4. Prize money is automatically allocated to smart contract (to ensure you keep your end of the bargain).
5. A 'bounty hunter' accepts your task.
6. They submit their code as a pull request.
7. If you're satisfied, merge their pull request!
8. Upon merge, the bounty hunter gets paid automatically.

But wait. There's MORE:
Upon any dispute, your case will be sent to an anonymised jury (i.e., unbiased complete strangers). If the employer or employee tries to cheat their way out of this issue, the individual(s) part of the jury will vote based on their interpretation of the case.

They won't; however, receive ANY details about the people involved. 

We're starting with the dev world, but we're aiming to create a safe smart contract protocol for all types of jobs/business opportunities!

## Be a Contributor 
Join us in our mission in creating an anti-corrupt service marketplace!

### Github Webhooks

Set up your clone of our repository, and test our webhook functionality by changing directory to the `/webhook` folder.

Then, testing the Rust webhook server through `$ cargo run`, which runs on global port `0.0.0.0:3000`.

To receive github webhooks, use `smee.io` to retrieve a payload url. This will be the proxy url (relay url) you'll **need** to test webhooks in a local environment.

Set up a test github repository, and play around with how you can create new conditions based off webhook payload data.

Have fun!

## Project Structure
```text
├── contracts
│   ├── hello_world
│   │   ├── src
│   │   │   ├── lib.rs
│   │   │   └── test.rs
│   │   └── Cargo.toml
│   └── timelock
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
│
├── webhook
│   ├── src
│   │   ├── main.rs
│   │   └── lib.rs
│   └── Cargo.toml
│
├── Cargo.toml
└── README.md
