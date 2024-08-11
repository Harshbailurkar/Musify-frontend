import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { genre } from "../../assets/constant";
import { uploadSong } from "../../API/songAPI";

export default function UploadSong({ onClose, onSuccess }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    language: "",
    songUrl: null,
    thumbnailUrl: null,
    genres: [],
  });

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, genres: selectedOptions });
  };

  const onDropSong = (acceptedFiles) => {
    setFormData({ ...formData, songUrl: acceptedFiles[0] });
  };

  const onDropThumbnail = (acceptedFiles) => {
    setFormData({ ...formData, thumbnailUrl: acceptedFiles[0] });
  };

  const { getRootProps: getRootPropsSong, getInputProps: getInputPropsSong } =
    useDropzone({ onDrop: onDropSong });
  const {
    getRootProps: getRootPropsThumbnail,
    getInputProps: getInputPropsThumbnail,
  } = useDropzone({ onDrop: onDropThumbnail });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    uploadSong(formData)
      .then((response) => {
        if (response.success) {
          onSuccess("Song Uploaded successfully");
          onClose();
        } else {
          setError(response.message);
        }
      })
      .catch((error) => setError("Error :" + error.message + ". Try again"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto scrollbar scrollbar-thumb-black">
      <div className="relative flex flex-col items-center p-8 bg-musify-dark text-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-52">
        <button
          className="absolute top-4 text-4xl mr-2 right-4 text-gray-500 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h1 className="text-4xl font-bold mb-8">Upload Your Song</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="Enter song title"
              className="p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              onChange={handleChange}
              value={formData.title}
              name="title"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="artist" className="block text-lg font-medium mb-2">
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              placeholder="Enter artist name"
              className="p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              onChange={handleChange}
              value={formData.artist}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="album" className="block text-lg font-medium mb-2">
              Album
            </label>
            <input
              type="text"
              id="album"
              name="album"
              placeholder="Enter album name"
              className="p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              onChange={handleChange}
              value={formData.album}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="language"
              className="block text-lg font-medium mb-2"
            >
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              placeholder="Enter song language"
              className="p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500"
              onChange={handleChange}
              value={formData.language}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="genres" className="block text-lg font-medium mb-2">
              Genre / Categories
            </label>
            <p className="pb-2">Ctrl + click to select multiple</p>
            <select
              id="genre"
              name="genre"
              multiple
              className="p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500 scrollbar scrollbar-thumb-gray-900"
              style={{ height: "150px" }}
              onChange={handleGenreChange}
              value={formData.genres}
            >
              {genre.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                  className="text-white"
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between md:col-span-2 space-x-6">
            <div className="flex flex-col w-1/2">
              <label htmlFor="song" className="block text-lg font-medium mb-2">
                Song File (.mp3)
              </label>
              <div
                {...getRootPropsSong()}
                className="flex items-center justify-center h-32 p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500 text-center cursor-pointer"
              >
                <input
                  {...getInputPropsSong({
                    accept: ".mp3",
                    name: "songUrl",
                    multiple: false,
                  })}
                />

                {formData.songUrl ? (
                  <p>{formData.songUrl.name}</p>
                ) : (
                  <p>Drag & drop a song file here, or click to select one</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="thumbnail"
                className="block text-lg font-medium mb-2"
              >
                Thumbnail Image
              </label>
              <div
                {...getRootPropsThumbnail()}
                className="flex items-center justify-center h-32 p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500 text-center cursor-pointer"
              >
                <input
                  {...getInputPropsThumbnail({
                    accept: "image/*",
                    name: "thumbnailUrl",
                  })}
                />
                {formData.thumbnailUrl ? (
                  <p>{formData.thumbnailUrl.name}</p>
                ) : (
                  <p>
                    Drag & drop a thumbnail image here, or click to select one
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center md:col-span-2">
            <button
              type="submit"
              className="py-3 px-8 rounded-md bg-gray-300 text-black text-lg font-semibold hover:bg-white transition duration-200"
            >
              {loading ? "Uploading..." : "Upload Song"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
