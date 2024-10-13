mod lib; // fix later

use lib::webhook_handler;

use axum::{
  routing::post,
  Router,
};
use std::net::SocketAddr;
use tracing_subscriber;
use tracing::info;


#[tokio::main]
async fn main() {
    // will trace basic logger to stdout i.e., will 'print' webhook events.
    tracing_subscriber::fmt::init();
    
    let app: Router = Router::new()
        .route("/", post(webhook_handler)); 
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
