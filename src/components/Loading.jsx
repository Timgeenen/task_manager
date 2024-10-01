
function Loading() {
  return (
    <div className="h-12 w-12 m-4">
      <svg
      viewBox="0 0 50 50"
      id="spinner"
      >
        <circle
        cx={"50%"}
        cy={"50%"}
        r={20}
        stroke="url(#myGradient)"
        fill="none"
        strokeWidth={10}
        // strokeDasharray={100}
        strokeLinecap="round"
        />
        <linearGradient
        id="myGradient"
        gradientTransform="rotate(120)"
        >
          <stop offset="5%" stopColor="#D5DCF9" />
          <stop offset="95%" stopColor="#3182ce" />
        </linearGradient>
      </svg>
    </div>
  )
}

export default Loading
