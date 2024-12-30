import React from "react";

export function File(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <circle cx={10} cy={28} r={2} fill="currentColor"></circle>
      <circle cx={24} cy={28} r={2} fill="currentColor"></circle>
      <path
        fill="currentColor"
        d="M4.98 2.804A1 1 0 0 0 4 2H0v2h3.18l3.84 19.196A1 1 0 0 0 8 24h18v-2H8.82l-.8-4H26a1 1 0 0 0 .976-.783L29.244 7h-2.047l-1.999 9H7.62Z"
      ></path>
      <path
        fill="currentColor"
        d="M21.586 9.414L18 5.828V14h-2V5.828l-3.586 3.586L11 8l6-6l6 6z"
      ></path>
    </svg>
  );
}
