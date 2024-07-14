# Musify Frontend

Musify is a feature-rich frontend application for an online music web platform. This project allows users to explore, play, and like high-quality songs, view detailed song descriptions, and manage their music preferences.

## Features

- **High-Quality Songs:** Browse and listen to a vast collection of high-quality music.
- **Advanced Search:** Search for songs by name, artist, genre, or language.
- **Song Details:** View detailed information about each song.
- **Like Songs:** Like your favorite songs to save them for later.
- **User Authentication:** Secure login and registration for personalized experiences.
- **Responsive Design:** Enjoy a seamless experience across various devices.

## Demo

Check out the live demo of Musify [here](https://musifyharshbailurkar.netlify.app/).

## Requirements

- Node.js v19
- A running instance of the [Musify Backend](https://github.com/Harshbailurkar/Musify-Backend)

## Installation

To run the project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Harshbailurkar/musify-frontend.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd musify-frontend
    ```

3. **Install the dependencies:**
    ```bash
    npm install
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Usage

Once the development server is running, you can explore the following features:

- **Homepage:** View the list of popular songs.
- **Song Details:** Click on a song to view its details and play it.
- **Like Songs:** Click on the like button to like a song (requires login).
- **User Authentication:** Sign up or log in to access personalized features.

## Technologies

- **React**: JavaScript library for building user interfaces
- **Redux**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client for making API requests

## Folder Structure

musify-frontend/
├── public/
│ ├── index.html
│ └── ...
├── src/
│ ├── assets/
│ │ ├── images/
│ │ └── constant.js
│ ├── components/
│ │ ├── Songs.js
│ │ └── ...
│ ├── API/
│ │ ├── songAPI.js
│ │ └── favoriteAPI.js
│ ├── pages/
│ │ ├── HomePage.js
│ │ └── ...
│ ├── redux/
│ │ ├── authSlice.js
│ │ └── ...
│ ├── App.js
│ ├── index.js
│ └── ...
└── package.json


## Contributing

If you want to contribute to this project, please fork the repository and create a new branch for your features or bug fixes. Once you are done, submit a pull request.

## License

This project is licensed under the MIT License.

---

Happy coding!

