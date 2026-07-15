import React from "react";
import { Globe, Link2, Book, Star, Mail, Phone } from "lucide-react";

export function parseCustomLink(title) {
  if (typeof title !== "string") return { icon: null, title: "" };
  const match = title.match(/^\[([a-zA-Z0-9_-]+)\]\s*(.*)$/);
  if (match) {
    return { icon: match[1], title: match[2] };
  }
  return { icon: null, title };
}

export function renderCustomLinkIcon(iconName) {
  if (!iconName) return null;
  const size = "w-4 h-4 shrink-0";
  const icons = {
    globe: <Globe className={`${size} text-blue-500`} />,
    link: <Link2 className={`${size} text-indigo-500`} />,
    book: <Book className={`${size} text-emerald-500`} />,
    star: <Star className={`${size} text-amber-500`} />,
    mail: <Mail className={`${size} text-rose-500`} />,
    phone: <Phone className={`${size} text-teal-500`} />,
  };
  return icons[iconName.toLowerCase()] || null;
}

export function getSafeMapUrl(urlOrAddress) {
  if (!urlOrAddress) return "";
  
  // If it is already a valid embed URL, return it
  if (urlOrAddress.includes("/maps/embed") || urlOrAddress.includes("output=embed")) {
    return urlOrAddress;
  }
  
  let query = urlOrAddress;
  
  // Try to parse out the place name from a google maps place link
  const placeMatch = urlOrAddress.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch && placeMatch[1]) {
    query = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  }
  
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}
