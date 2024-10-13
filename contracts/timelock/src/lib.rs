//! This contract demonstrates 'timelock' concept and implements a
//! greatly simplified Claimable Balance (similar to
//! https://developers.stellar.org/docs/glossary/claimable-balance).
//! The contract allows to deposit some amount of token and allow another
//! account(s) claim it before or after provided time point.
//! For simplicity, the contract only supports invoker-based auth.
#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Vec};


#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Init,
    Balance,
    PullRequest, // I think this imports pub struct
}

#[derive(Clone)]
#[contracttype]
pub enum TimeBoundKind {
    Before,
    After,
}

#[derive(Clone)]
#[contracttype]
pub struct TimeBound {
    pub kind: TimeBoundKind,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct ClaimableBalance {
    pub token: Address,
    pub amount: i128,
    pub claimants: Vec<Address>,
    pub time_bound: TimeBound,
}

#[contract]
pub struct ClaimableBalanceContract;
// function 1: timestamp
// The 'timelock' part: check that provided timestamp is before/after
// the current ledger timestamp.
fn check_time_bound(env: &Env, time_bound: &TimeBound) -> bool {
    let ledger_timestamp: u64 = env.ledger().timestamp(); // typecasted unsigned 64bit 

    match time_bound.kind {
        TimeBoundKind::Before => ledger_timestamp <= time_bound.timestamp,
        TimeBoundKind::After => ledger_timestamp >= time_bound.timestamp,
    }
}

// impl == class for contract where you claim balance
#[contractimpl]
impl ClaimableBalanceContract {
    // function 2: `trustless`, non-authority intermediary
    pub fn deposit(
        env: Env,
        from: Address,
        token: Address,
        amount: i128,
        claimants: Vec<Address>,
        time_bound: TimeBound,
    ) {
        if claimants.len() > 1 { // changed to 1 
            panic!("too many claimants");
        }
        if is_initialized(&env) {
            panic!("contract has been already initialized");
        }
        // Make sure `from` address authorized the deposit call with all the
        // arguments.
        from.require_auth();

        // Transfer token from `from` to this contract address.
        token::Client::new(&env, &token).transfer(&from, &env.current_contract_address(), &amount);
        // Store all the necessary info to allow one of the claimants to claim it.

        // interlude: How 2 split up equitably? (percentage based?)

        // initialisation of env balance 
        env.storage().instance().set(
            &DataKey::Balance,
            &ClaimableBalance {
                token,
                amount,
                time_bound,
                claimants,
            },
        );
        // Mark contract as initialized to prevent double-usage.
        // Note, that this is just one way to approach initialization - it may
        // be viable to allow one contract to manage several claimable balances.
        env.storage().instance().set(&DataKey::Init, &());
    }

    // function 2: Claimant to extract from intermediary
    pub fn claim(env: Env, claimant: Address) {
        // Make sure claimant has authorized this call, which ensures their
        // identity.
        claimant.require_auth();
        
        // Check if the merge was successful
        let merge_status: bool = env.storage().instance().get(&DataKey::MergeStatus).unwrap_or(false);
        if !merge_status {
        panic!("merge was not successful, cannot claim");
        }

        let claimable_balance: ClaimableBalance =
            env.storage().instance().get(&DataKey::Balance).unwrap(); // recommended not to use .unwrap()

        // if they claim outside of time bound, panic
        if !check_time_bound(&env, &claimable_balance.time_bound) {
            panic!("time predicate is not fulfilled");
        }

        // pub struct Address has env: and obj: AddressObject => which is??? i32 or Option<i32>?
        let claimants: &Vec<Address> = &claimable_balance.claimants; // typecasted vector array of addresses
        // if claimant in vec<address> or not (removed by env.storage...remove(&DataKey::Balance))
        if !claimants.contains(&claimant) {
            panic!("claimant is not allowed to claim this balance");
        }

        // FYI: Transfer is a built in fun in _ library
        // Transfer the stored amount of token to claimant after passing
        // all the checks.
        token::Client::new(&env, &claimable_balance.token).transfer(
            &env.current_contract_address(),
            &claimant,
            &claimable_balance.amount,
        );

        // Remove the balance entry to prevent any further claims.
        env.storage().instance().remove(&DataKey::Balance);
    }
}

fn is_initialized(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Init)
}

mod test;