

# YouTube Clone Application

This is a simple YouTube clone application built with React. It features user registration, login, and basic video list and detail functionalities. The app uses `sessionStorage` to temporarily store user data for the session. Below is a brief overview of the different screens and their functionalities.

## All Screens

### 1. Register
- **Path:** `/register`
- **Description:** This screen allows new users to create an account. Users must enter a username, password, confirm password, display name, and optionally upload a profile photo. Passwords must be at least 6 characters long and must match the confirmed password. On successful registration, the user data is stored in `sessionStorage`, an alert is displayed, and the user is redirected to the login screen.
- **File:** `register.js`
- **Styles:** `register.css`

### 2. Login
- **Path:** `/login`
- **Description:** This screen allows registered users to log in. Users must enter their username and password. The credentials are checked against the data stored in `sessionStorage`. On successful login, the user is redirected to the home screen. If the credentials are incorrect, an error message is displayed.
- **File:** `login.js`
- **Styles:** `login.css`

### 3. Home
- **Path:** `/`
- **Description:** The home screen provides a brief overview or welcome message. This can be customized to include trending videos, user recommendations, or any other content you'd like to highlight.

### 4. Video List
- **Path:** `/videolist`
- **Description:** This screen displays a list of videos. Users can search for videos by title. Clicking on a video will navigate to the video detail screen. The list is scrollable and each video is displayed with a title, description, and number of views. Users can edit or delete their videos. A button is provided to add new videos, which redirects to the add video screen.
- **File:** `VideoList.js`
- **Styles:** `videolist.css`

### 5. Add Video
- **Path:** `/add`
- **Description:** This screen allows users to add new videos to the list. Users must enter a video title, description, and URL. On submitting the form, the video is added to the list of videos, but it will only persist for the session (it will disappear when the app is restarted).
- **File:** `addvideo.js`
- **Styles:** `addvideo.css`

### 6. Video Detail
- **Path:** `/video/:id`
- **Description:** This screen displays the details of a selected video, including the video player, title, description, and interactive buttons for liking, sharing, and commenting. Users can add new comments, edit existing comments, or delete comments. The like button is interactive and changes appearance when clicked. The share button opens a list of sharing options.
- **File:** `videodetail.js`
- **Styles:** `videodetail.css`

### 7. My Videos
- **Path:** `/myvideos`
- **Description:** This screen displays the videos uploaded by the logged-in user. Users can edit the title and description of their videos or delete them. Editing a video opens an inline form within the video card.
- **File:** `my_videos.js`
- **Styles:** `my_video.css`

## Installation and Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-repo/youtube-clone.git
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm start
   ```

4. **Open in Browser:**
   Open your browser and navigate to `http://localhost:3000`.

## Dependencies

- **React:** A JavaScript library for building user interfaces.
- **React Router:** A library for routing in React applications.
- **Axios:** A promise-based HTTP client for making requests.

## File Structure

```
.
├── public
│   ├── index.html
│   └── videos.json        # Sample videos data
└── src
    ├── screens
    │   ├── AddVideo.js
    │   ├── Login.js
    │   ├── Register.js
    │   ├── VideoDetail.js
    │   ├── VideoList.js
    │   ├── MyVideos.js
    │   ├── addvideo.css
    │   ├── login.css
    │   ├── my_video.css
    │   ├── register.css
    │   ├── videodetail.css
    │   ├── videolist.css
    ├── App.js
    ├── App.css
    └── index.js
```

