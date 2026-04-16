interface AuthorCardProps {
  name: string;
  bio?: string;
}

export default function AuthorCard({ name, bio }: AuthorCardProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        padding: "28px 32px",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #C0392B",
        background: "#0d0d0d",
        marginTop: "48px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #C0392B 0%, #6b1a13 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-bebas)",
          fontSize: "20px",
          color: "#fff",
          letterSpacing: "0.05em",
        }}
      >
        {initials}
      </div>

      {/* Text */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "10px",
            color: "#C0392B",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}
        >
          Written by
        </p>
        <p
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "#f0f0f0",
            letterSpacing: "0.06em",
            margin: "0 0 8px",
          }}
        >
          {name}
        </p>
        {bio && (
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: "15px",
              color: "#888",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "520px",
            }}
          >
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}
