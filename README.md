# social-media

This is a social media application where a user can,
1) Creat an account.
2) Follow or Unfollow an user.
3) Like or Dislike a post.
4) Create a Post with caption and Image.
5) Update Profile Name, Bio and Profile Pic.
6) Delete the account.

## Specification of Application:
1. Fronted is powered by React, Redux, React-Router-DOM, WebPack bundler.
2. Styling is done via SCSS.
3. Backend is supported by NodeJS using ExpressJS framework.
4. Authentication of user is done by providing providing an access token at time of login and for further visit on server we verify the access token with a special key.
5. Each access token has some expiry time associated with it. After period expiry we generate a new access token for the user using another special token the refresh token.
6. Refresh token is kept on user side in cookie which is secure from cross-site-scripting. It also has some expiry time associated with it. (Usually expiry of access token <<< expiry of refresh token)
5. Password is hashed and stored in DB. Hence it is not vulnerability to attackers to extract and decode it.

Here is a demo video of SOCIAL-MEDIA application,
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/HWbutPswVqM/0.jpg)](https://www.youtube.com/watch?v=HWbutPswVqM)
