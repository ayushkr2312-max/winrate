export function SolutionIcon({ id }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true };

  switch (id) {
    case "workflow":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="6" height="5" rx="1" />
          <rect x="15" y="4" width="6" height="5" rx="1" />
          <rect x="9" y="15" width="6" height="5" rx="1" />
          <path d="M9 6.5H15M12 9v3M12 15H12" />
        </svg>
      );
    case "scouting":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
        </svg>
      );
    case "data":
      return (
        <svg {...props}>
          <path d="M4 18V10M10 18V6M16 18V12M20 18H4" />
        </svg>
      );
    case "social":
      return (
        <svg {...props}>
          <path d="M4 16c2-4 4-6 8-6s6 2 8 6" />
          <circle cx="8" cy="9" r="2" />
          <circle cx="16" cy="7" r="2" />
        </svg>
      );
    case "web":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 9h18M8 5V3h8v2" />
        </svg>
      );
    case "roster":
      return (
        <svg {...props}>
          <circle cx="8" cy="9" r="2.5" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M4 18c0-2.5 2-4 4-4s4 1.5 4 4M12 18c0-2.5 2-4 4-4s4 1.5 4 4" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 6v12M6 12h12" />
        </svg>
      );
  }
}
