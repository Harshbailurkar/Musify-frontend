import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSong } from "../../API/songAPI";

export default function EditSongInfo({
  onClose,
  songName,
  songAlbum,
  songThumbnail,
  songId,
}) {
  const [formData, setFormData] = useState({
    title: songName,
    album: songAlbum,
    thumbnailUrl: songThumbnail,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updateData = new FormData();

    if (formData.title !== songName) {
      updateData.append("title", formData.title);
    }
    if (formData.album !== songAlbum) {
      updateData.append("album", formData.album);
    }
    if (thumbnailFile) {
      updateData.append("thumbnailUrl", thumbnailFile);
    }

    updateSong(songId, updateData)
      .then((response) => {
        if (response.success) {
          onClose();
          navigate(`/user`);
        } else {
          setError(response.message);
        }
      })
      .catch((error) => setError("Error updating song: " + error.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-musify-dark rounded-3xl p-6 w-1/3 flex flex-col items-center">
        <h1 className="text-2xl p-2 pb-4">Edit Song Details</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
            />
            <label
              htmlFor="album"
              className="block text-sm font-medium text-white mt-4"
            >
              Album
            </label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
            />
            <div>
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-medium text-white"
              >
                New Thumbnail
              </label>
              <input
                type="file"
                id="thumbnailUrl"
                name="thumbnailUrl"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-800 text-white hover:bg-gray-700 py-2 px-4 rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-300 hover:bg-white text-black py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
