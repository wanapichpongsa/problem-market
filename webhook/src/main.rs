use axum::{
    routing::post,
    extract::Json, // {Path, Query Json?}
    Router,
    response::IntoResponse,
};
use std::net::SocketAddr;
use serde::Deserialize;
use tracing::info;
use tracing_subscriber;
#[derive(Deserialize, Debug)]
struct PullRequestPayload {
    action: String, // closed/open, we'll see if bool is more efficient
    pull_request: PullRequest, // defined in successor struct
}
#[derive(Deserialize, Debug)]
struct PullRequest {
    merged: bool,
    user: User,
    merged_at: Option<String>, // None, SOme?
}
// unfortunately need to define new struct since we need to specify login object :(
#[derive(Deserialize, Debug)]
struct User {
    login: String,
    id: i8, // I think
    // url: String, // perhaps define string literal? https:\/\/www.github.com\/+. or *.
}
// payload is the identifier/code-name for webhooks we receive
// POST route handler
async fn webhook_handler(Json(payload): Json<PullRequestPayload>) -> impl IntoResponse { // interesting name (maybe PayloadResponse)
    info!("Received webhook: {:?}", payload);
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
    // user.login -> String: claimant address relational database
    // interaction with smart contract?
    "Webhook received and processed"
}
// server.at("/*").all(|req| async move {
// info!("Received request on path {}", req.url.path())
// })
#[tokio::main]
async fn main() {
    // Set up logging....
    // needs to be a loop?
    tracing_subscriber::fmt::init();
    // info!("webhook received at {}");
    // variable/const for each webhook request
    // Build the Axum app with the webhook route
    let app: Router = Router::new()
        .route("/webhook", post(webhook_handler)); // might have to keep as "/"
    // message comes from webhook_handler :)
    // route is HTTP method, addr is IP address and Port
    let address: SocketAddr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("server running on {}", address); 
    //with hyper rust, can run on global server
    axum::Server::bind(&address)
    .serve(app.into_make_service())
    .await
    .expect("Failed to start server");
}
