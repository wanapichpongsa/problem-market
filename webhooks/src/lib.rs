use axum::{
    extract::Json,
    response::IntoResponse,
};

use serde::Deserialize;
use tracing::info;

#[derive(Deserialize, Debug)]
pub struct PullRequestPayload {
    action: String, // closed/open
    pull_request: PullRequest, // defined in successor struct
}
#[derive(Deserialize, Debug)]
pub struct PullRequest {
    merged: bool,
    user: User,
    merged_at: Option<String>, // 2024-10-13T01:57:59Z
}

#[derive(Deserialize, Debug)]
pub struct User {
    login: String,
    id: u64, 
}
// payload is the identifier/code-name for webhooks we receive
// POST route handler                                       // use Hashmap <type, vector> if possible for dynamic processing.
pub async fn webhook_handler(Json(payload): Json<PullRequestPayload>) -> impl IntoResponse { // interesting name (maybe PayloadResponse)
    info!("Received webhook: {:?}", payload); // {:?} synonymous with ?payload, "str"
    // if payload.__owner.url == payload.__user.commit.url ?
    if payload.action == "closed" && payload.pull_request.merged { // if merged from payload.pull_request.merged is True? ("pull_request" is from json, not Rust struct)
        info!("Pull request merged by: {} (ID: {}) through {}", 
        payload.pull_request.user.login, // reduce to user.login?
        payload.pull_request.user.id, // changed from header being colored to everything else
        match payload.pull_request.merged_at {
            Some(date) => date, // date if exists
            None => "Not merged".to_string(), // 'None' default value
        }
        );
        //macro logging info (console.log + format string) for successful operations?
    }
    "Webhook received and processed"
    // throw an error when you can
}
// server.at("/*").all(|req| async move {
// info!("Received request on path {}", req.url.path())
// })
