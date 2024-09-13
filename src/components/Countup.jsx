import { CountUp } from "use-count-up";
//TODO: change styles to tailwind

function Countup({actual, total, parameter, radius, color}) {
  const circumference = radius * 2 * Math.PI;
  const offset = radius / 5;
  const boxSize = (radius * 2) + (offset * 2)
  return (
    <div className="flex items-center gap-2 border-slate-300 p-1 w-36">
      <CountUp
      isCounting
      end={actual}
      duration={2}
      >
        {
          (({ value }) => (
          <svg
          width={boxSize}
          height={boxSize}
          >
            <circle 
            cx={(radius + offset)}
            cy={-(radius + offset)}
            r={radius}
            style={{transform: "rotate(90deg)"}}
            stroke={color ? color : "blue"}
            strokeWidth={offset}
            strokeDashoffset={circumference - (value / total) * circumference}
            strokeDasharray={circumference}
            fill="transparent"
            />
            <text
            className="font-bold"
            x={boxSize / 2}
            y={boxSize / 2}
            dominantBaseline="middle"
            textAnchor="middle"
            >
              {value}
            </text>
          </svg>
          ))
        }
      </CountUp>
      <text className="text-sm text-nowrap">{parameter}</text>
    </div>
  )
}

export default Countup
