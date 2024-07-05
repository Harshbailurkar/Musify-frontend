import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
} from "react-icons/hi";

export const genres = [
  { title: "Bollywood", value: "bollywood" },
  { title: "Hollyood", value: "hollyood" },
  { title: "Pop", value: "pop" },
  { title: "Dance", value: "dance" },
  { title: "Electronic", value: "electronic" },
  { title: "Rock", value: "rock" },
  { title: "Latin", value: "latin" },
  { title: "Film", value: "FILM_TV" },
  { title: "Worldwide", value: "worldwide" },
  { title: "House", value: "house" },
];

export const links = [
  { name: "Discover", to: "/", icon: HiOutlineHome },
  { name: "Around You", to: "/around-you", icon: HiOutlinePhotograph },
  { name: "Top Artists", to: "/top-artists", icon: HiOutlineUserGroup },
  { name: "Top Charts", to: "/top-charts", icon: HiOutlineHashtag },
];
