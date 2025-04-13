#API List for DevMatcher

authRouter
-POST /signup (/auth/signup - can be used)
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password (forgot password API)

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignore/:userId
in the above to make the status part dynamic
these 2 can have a single api as well
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

userRouter
-GET /user/connections
-GET /user/requests/received
-GET /user/feed  (Gets you profiles of other users ont he platform like 20 30 at a time)



Status- ignore, interested, accepted, rejected

