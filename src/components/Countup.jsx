import { CountUp } from "use-count-up";
//TODO: change styles to tailwind

function Countup({actual, total, parameter, radius}) {
  const circumference = radius * 2 * Math.PI;
  const offset = radius / 5;
  const boxSize = (radius * 2) + (offset * 2)
  return (
    <div>
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
            cx={radius + offset}
            cy={radius + offset}
            r={radius}
            stroke="blue"
            strokeWidth={offset}
            strokeDashoffset={circumference - (value / total) * circumference}
            strokeDasharray={circumference}
            fill="transparent"
            />
            <text
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
    </div>
  )
}

export default Countup
