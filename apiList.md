# DevConnect APIs

## Auth APIs

- POST /signup
- POST /login
- POST /logout

## Profile APIs

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Friend Request Related APIs

- POST /request/send/:status/:toUserId
- POST /request/review/:status/:fromUserId

## User APIs

- GET /user/requests/received
- GET /user/connections
- GET /user/feed

## Friend Request Status

- Ignore
- Interested
- Accept
- Reject

## Payment Integration APIs

- POST /payment/create
- POST /payment/webhook
- GET /payment/verify
